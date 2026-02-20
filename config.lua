--[[
    ╔═══════════════════════════════════════════════════════════════╗
    ║                   6HA VEHICLE CONTROL SYSTEM                  ║
    ║                        Configuration File                     ║
    ╠═══════════════════════════════════════════════════════════════╣
    ║  Developer: 6ha                                               ║
    ║  Discord: https://discord.gg/Zk4TTQrRdh                       ║
    ║  Server: 𝐑𝟔 | 𝐒𝐓𝐎𝐑𝐄                                            ║
    ║  All Rights Reserved © 2026                                   ║
    ╚═══════════════════════════════════════════════════════════════╝
]]--

Config = {}
Config.Interior = vector3(-763.2816, 330.0418, 199.4865)             -- Interior to load where characters are previewed
Config.DefaultSpawn = vector3(-1037.63, -2737.72, 20.17)              -- Default spawn coords if you have start apartments disabled
Config.PedCoords = vector4(-795.53, 330.28, 201.41, 329.5)           -- Create preview ped at these coordinates
Config.HiddenCoords = vector4(-779.0154, 326.1801, 196.0860, 91.0454) -- Hides your actual ped while you are in selection
Config.CamCoords = vector4(-793.45, 332.94, 201.50, 141.55)          -- Camera coordinates for character preview screen
Config.EnableDeleteButton = false                                     -- Define if the player can delete the character or not
Config.customNationality = false                                      -- Defines if Nationality input is custom of blocked to the list of Countries
Config.SkipSelection = false                                          -- Skip the spawn selection and spawns the player at the last location
Config.UseApartments = false                                          -- true  = يشتغل نظام qb-apartments (الشخصية الجديدة ترسب في الشقة)
Config.DefaultNumberOfCharacters = 2                                  -- عدد الشخصيات للاعب العادي

Config.PlayersNumberOfCharacters = {                                  -- تحديد عدد شخصيات محدد للاعبين حسب الـ license
    -- مثال: ضع license اللاعب وعدد الشخصيات المسموح له بها
     { license = 'license:b373070ed1028a8a9e1518864e5fd3c1e2e62a74', numberOfChars = 5 },
    -- { license = 'license:abcdef1234567890abcdef1234567890abcdef12', numberOfChars = 4 },
}