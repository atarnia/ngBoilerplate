angular.module('Atarnia.utils').provider('atarniaSettings', atarniaSettings);

function atarniaSettings() {

    var settings = {

        apiAdapter : {
            protocol: '',
            host : '',
            port : '',
            namespace : '/api/'
        },

        $get: function(){
            return settings;
        }
    };

    return settings;
}
