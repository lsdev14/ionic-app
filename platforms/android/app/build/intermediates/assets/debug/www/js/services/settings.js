angular.module('controlePresenca.services')

.factory('Settings',['$localStorage',function ($localStorage) {

    var settings = [];

    return {
        all: function () {
            settings = $localStorage.getObject('settings');
            return settings;
        },
        remove: function (setting) {
            settings = $localStorage.getObject('settings');
            settings.splice(settings.indexOf(setting),1);
            $localStorage.setObject('settings',settings);
        },
        get: function (settingCodigo) {
            settings = $localStorage.getObject('settings');
            for (var i = 0;i < settings.length;i++) {
                if (settings[i].codigo == settingCodigo) {
                    return settings[i];
                }
            }
            return null;
        },
        set: function (setting) {
            settings = $localStorage.getObject('settings');

            var updateSettings = -1;
            for (var i = 0;i < settings.length;i++) {
                if (settings[i].codigo == setting.codigo) {
                    updateSettings = i;
                    break;
                }
            }

            if (updateSettings == -1) {
                settings.push(setting);
            }
            else {
                settings[updateSettings] = setting;
            }
            $localStorage.setObject('settings',settings);
        }
    };

}]);