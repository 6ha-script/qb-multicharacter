let re = "(" + profList.join("|") + ")\\b";
const regTest = new RegExp(re, "i");

document.addEventListener("DOMContentLoaded", () => {
    const viewmodel = new Vue({
        el: "#app",
        vuetify: new Vuetify({ theme: { dark: true } }),
        data: {
            characters: [],
            chardata: {},
            show: {
                loading: false,
                characters: false,
                register: false,
                delete: false,
            },
            registerData: {
                date: '',
                firstname: '',
                lastname: '',
                nationality: '',
                gender: 0, // 0 = male, 1 = female
            },
            displayDate: '00/00/0000',
            datePosition: 0,
            allowDelete: false,
            dataPickerMenu: false,
            characterAmount: 0,
            loadingText: "",
            selectedCharacter: -1,
            dollar: Intl.NumberFormat("en-US"),
            translations: {},
            customNationality: false,
            nationalities: [],
            formKey: 0,
        },
        watch: {
            'registerData.gender': function(newGender) {
                const model = newGender === 1 ? 'mp_f_freemode_01' : 'mp_m_freemode_01';
                axios.post("https://qb-multicharacter/updateCreationPed", {
                    model: model,
                });
            }
        },
        computed: {
            selectedCharData() {
                console.log('Computing selectedCharData for index:', this.selectedCharacter);
                console.log('Available characters:', this.characters);
                
                if (this.selectedCharacter !== -1) {
                    const char = this.characters[this.selectedCharacter];
                    console.log('Selected character data:', char);
                    
                    // Log detailed data
                    if (char) {
                        console.log('Character info:', char.charinfo);
                        console.log('Character job:', char.job);
                        console.log('Character money:', char.money);
                    }
                    
                    return char || null;
                }
                return null;
            }
        },
        methods: {
            getGenderText: function(gender) {
                // gender can be: 0 (male), 1 (female), "male", "Male", "female", "Female"
                if (gender === 0 || gender === "0" || gender === "male" || gender === "Male" || gender === "m" || gender === "M") {
                    return "ذكر";
                } else if (gender === 1 || gender === "1" || gender === "female" || gender === "Female" || gender === "f" || gender === "F") {
                    return "أنثى";
                }
                return "-";
            },
            onDateFocus: function(event) {
                // عند التركيز، نضع المؤشر في أول موضع
                this.$nextTick(() => {
                    this.datePosition = 0;
                    event.target.setSelectionRange(0, 0);
                });
            },
            onDateKeyDown: function(event) {
                const input = event.target;
                const key = event.key;
                
                // السماح بمفاتيح التحكم
                if (['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight'].includes(key)) {
                    if (key === 'Backspace' || key === 'Delete') {
                        event.preventDefault();
                        let pos = input.selectionStart;
                        
                        // تخطي الشرطات
                        if (this.displayDate[pos - 1] === '/' && key === 'Backspace') {
                            pos--;
                        }
                        
                        if (pos > 0 && key === 'Backspace') {
                            let newDate = this.displayDate.split('');
                            newDate[pos - 1] = '0';
                            this.displayDate = newDate.join('');
                            this.$nextTick(() => {
                                input.setSelectionRange(pos - 1, pos - 1);
                            });
                        }
                    }
                    return;
                }
                
                // قبول الأرقام فقط
                if (!/^\d$/.test(key)) {
                    event.preventDefault();
                    return;
                }
                
                event.preventDefault();
                let pos = input.selectionStart;
                
                // تخطي الشرطات
                if (this.displayDate[pos] === '/') {
                    pos++;
                }
                
                // استبدال الصفر بالرقم المدخل
                if (pos < this.displayDate.length) {
                    let newDate = this.displayDate.split('');
                    newDate[pos] = key;
                    this.displayDate = newDate.join('');
                    
                    // الانتقال للموضع التالي
                    pos++;
                    if (this.displayDate[pos] === '/') {
                        pos++;
                    }
                    
                    this.$nextTick(() => {
                        input.setSelectionRange(pos, pos);
                    });
                    
                    // تحديث registerData.date
                    this.updateRegisterDate();
                }
            },
            formatDate: function(event) {
                // هذه الدالة للحفاظ على التوافق، لكن المنطق الرئيسي في onDateKeyDown
                this.updateRegisterDate();
            },
            updateRegisterDate: function() {
                // التحقق من أن التاريخ مكتمل وليس 00/00/0000
                if (this.displayDate !== '00/00/0000' && this.displayDate.length === 10) {
                    const parts = this.displayDate.split('/');
                    const day = parts[0];
                    const month = parts[1];
                    const year = parts[2];
                    
                    // التحقق من أن جميع الأجزاء ليست أصفار
                    if (day !== '00' && month !== '00' && year !== '0000') {
                        this.registerData.date = year + '-' + month + '-' + day;
                    } else {
                        this.registerData.date = '';
                    }
                } else {
                    this.registerData.date = '';
                }
            },
            selectCharacterSlot: function (idx) {
                this.selectedCharacter = idx;
                console.log('Selected character slot:', idx);
                console.log('Character data:', this.characters[idx]);

                if (this.characters[idx] !== undefined) {
                    axios.post("https://qb-multicharacter/cDataPed", {
                        cData: this.characters[idx],
                    });
                } else {
                    // Empty slot - open character creation with default male model
                    axios.post("https://qb-multicharacter/updateCreationPed", {
                        model: 'mp_m_freemode_01',
                    });
                    // إعادة تعيين البيانات قبل فتح النموذج
                    this.resetRegisterData();
                    this.$nextTick(() => {
                        this.show.characters = false;
                        this.show.register = true;
                    });
                }
            },
            click_character: function (idx) {
                this.selectedCharacter = idx;

                if (this.characters[idx] !== undefined) {
                    axios.post("https://qb-multicharacter/cDataPed", {
                        cData: this.characters[idx],
                    });
                } else {
                    axios.post("https://qb-multicharacter/cDataPed", {});
                }
            },
            cancelCreate: function () {
                this.resetRegisterData();
                this.show.register = false;
                this.show.characters = true;
            },
            play_character: function () {
                if (this.selectedCharacter !== -1) {
                    var data = this.characters[this.selectedCharacter];

                    if (data !== undefined) {
                        axios.post("https://qb-multicharacter/selectCharacter", {
                            cData: data,
                        });
                        setTimeout(() => {
                            this.show.characters = false;
                        }, 500);
                    } else {
                        this.resetRegisterData();
                        this.show.characters = false;
                        this.show.register = true;
                    }
                }
            },
            resetRegisterData: function () {
                this.registerData = {
                    date: '',
                    firstname: '',
                    lastname: '',
                    nationality: '',
                    gender: 0, // 0 = male, 1 = female
                };
                this.displayDate = '00/00/0000';
                this.datePosition = 0;
                // زيادة formKey لإجبار إعادة render
                this.formKey++;
                // إجبار Vue على تحديث الحقول
                this.$forceUpdate();
            },
            create_character: function () {
                const registerData = this.registerData;
                const validationResult = characterValidator.validateCharacter({
                    firstname: registerData.firstname,
                    lastname: registerData.lastname,
                    nationality: registerData.nationality,
                    gender: registerData.gender,
                    date: registerData.date,
                });

                if (validationResult.isValid) {
                    this.show.register = false;

                    axios.post("https://qb-multicharacter/createNewCharacter", {
                        firstname: registerData.firstname,
                        lastname: registerData.lastname,
                        nationality: registerData.nationality,
                        birthdate: registerData.date,
                        gender: registerData.gender,
                        cid: this.selectedCharacter,
                    }).then(() => {
                        // إعادة تعيين البيانات بعد الإنشاء الناجح
                        this.resetRegisterData();
                        
                        setTimeout(() => {
                            this.show.characters = false;
                        }, 500);
                    }).catch((error) => {
                        console.error("Error creating character:", error);
                        Swal.fire({
                            icon: "error",
                            title: this.translate("ran_into_issue"),
                            text: this.translate("creation_failed"),
                            timer: 5000,
                            timerProgressBar: true,
                            showConfirmButton: false,
                        });
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        title: this.translate("ran_into_issue"),
                        text: this.translate(validationResult.message, { field: this.translate(validationResult.field) }),
                        timer: 5000,
                        timerProgressBar: true,
                        showConfirmButton: false,
                    });
                }
            },
            translate(key, params) {
                if (params) {
                    return translationManager.formatTranslation(key, params);
                }
                return translationManager.translate(key);
            },
        },
        mounted() {
            initializeValidator();
            var loadingProgress = 0;
            var loadingDots = 0;
            
            // Auto-select first character on load
            window.addEventListener("message", (event) => {
                var data = event.data;
                switch (data.action) {
                    case "ui":
                        this.customNationality = event.data.customNationality;
                        translationManager.setTranslations(event.data.translations);
                        this.translations = event.data.translations;
                        this.nationalities = event.data.countries;
                        this.characterAmount = data.nChar;
                        this.selectedCharacter = -1;
                        this.show.register = false;
                        this.show.delete = false;
                        this.show.characters = false;
                        this.allowDelete = event.data.enableDeleteButton;

                        if (data.toggle) {
                            this.show.loading = true;
                            this.loadingText = this.translate("retrieving_playerdata");
                            var DotsInterval = setInterval(() => {
                                loadingDots++;
                                loadingProgress++;
                                if (loadingProgress == 3) {
                                    this.loadingText = this.translate("validating_playerdata");
                                }
                                if (loadingProgress == 4) {
                                    this.loadingText = this.translate("retrieving_characters");
                                }
                                if (loadingProgress == 6) {
                                    this.loadingText = this.translate("validating_characters");
                                }
                                if (loadingDots == 4) {
                                    loadingDots = 0;
                                }
                            }, 500);

                            setTimeout(() => {
                                axios.post("https://qb-multicharacter/setupCharacters");
                                setTimeout(() => {
                                    clearInterval(DotsInterval);
                                    loadingProgress = 0;
                                    this.loadingText = this.translate("retrieving_playerdata");
                                    this.show.loading = false;
                                    this.show.characters = true;
                                    axios.post("https://qb-multicharacter/removeBlur");
                                    
                                    // Auto-select first character
                                    setTimeout(() => {
                                        for (let i = 1; i <= this.characterAmount; i++) {
                                            if (this.characters[i]) {
                                                this.click_character(i);
                                                break;
                                            }
                                        }
                                    }, 100);
                                }, 2000);
                            }, 2000);
                        }
                        break;
                    case "setupCharacters":
                        console.log('Setting up characters:', event.data.characters);
                        // مسح المصفوفة أولاً
                        this.characters = [];
                        
                        // إضافة الشخصيات باستخدام cid كفهرس
                        for (var i = 0; i < event.data.characters.length; i++) {
                            var char = event.data.characters[i];
                            // استخدام Vue.set لضمان التفاعلية
                            this.$set(this.characters, char.cid, char);
                        }
                        console.log('Characters array after setup:', this.characters);
                        
                        // تحديد أول شخصية تلقائياً بعد الحذف
                        if (this.show.characters && this.selectedCharacter === -1) {
                            this.$nextTick(() => {
                                for (let i = 1; i <= this.characterAmount; i++) {
                                    if (this.characters[i]) {
                                        this.selectCharacterSlot(i);
                                        break;
                                    }
                                }
                            });
                        }
                        break;
                    case "setupCharInfo":
                        this.chardata = event.data.chardata;
                        break;
                    case "refreshCharacters":
                        // تحديث قائمة الشخصيات بعد الحذف
                        axios.post("https://qb-multicharacter/setupCharacters");
                        break;
                }
            });
        },
    });
});