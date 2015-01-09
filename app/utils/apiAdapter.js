angular.module('Atarnia.utils').provider('apiAdapter', apiAdapter);

function apiAdapter() {

    var apiAdapterProvider = {

        server : {
            protocol: '',
            host : '',
            port : '',
            namespace : '/api/'
        },

        $get: [function(){

            var apiAdapter = {
                getApiUrl: function(){
                    var url = '';
                    url += apiAdapterProvider.server.protocol ? apiAdapterProvider.server.protocol + '://' : '';
                    url += apiAdapterProvider.server.host;
                    url += apiAdapterProvider.server.port ? ':' + apiAdapterProvider.server.port : '';
                    url += apiAdapterProvider.server.namespace;
                    return url;
                }
            };
            return apiAdapter;

        }]
    };
    return apiAdapterProvider;
}

angular.module('Atarnia.utils').config(['$httpProvider', function ($httpProvider) {
    $httpProvider.interceptors.push(['$cookies', function($cookies) {
        return {
            'request': function(config) {
                config.headers['X-CSRFToken'] = $cookies.csrftoken;
                return config;
            }
        };
    }]);
}]);
