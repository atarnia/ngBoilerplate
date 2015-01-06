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

angular.module('myApp').run(['$http','$cookies', function($http, $cookies) {
    $http.defaults.headers.common['X-CSRFToken'] = $cookies.csrftoken;
}]);
