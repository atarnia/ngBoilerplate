angular.module('Atarnia.utils').factory('_apiAdapter', ['atarniaSettings', _apiAdapter]);

function _apiAdapter(settings) {

    return {
        getApiUrl: function(){
            var url = '';
            url += settings.apiAdapter.host;
            url += settings.apiAdapter.port ? ':' + settings.apiAdapter.port : '';
            url += settings.apiAdapter.namespace;
            return url;
        }
    };
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
