angular.module('myApp').factory('adapter', function(){

    var apiServer = {
        host : '',
        port : '',
        namespace : '/api/'
    };

    return {
        getApiUrl: function(){
            var url = apiServer.host;
            url = apiServer.port ? url + ':' + apiServer.port : url;
            url += apiServer.namespace;
            return url;
        }
    };

});

angular.module('myApp').config(['$httpProvider', function ($httpProvider) {
    $httpProvider.interceptors.push(['$cookies', function($cookies) {
        return {
            'request': function(config) {
                config.headers['X-CSRFToken'] = $cookies.csrftoken;
                return config;
            }
        };
    }]);
}]);

