angular.module('Atarnia.auth').factory('currentUser', ['$q', '$injector', '$http', currentUserService]);

function currentUserService($q, $injector, $http){
    console.info('Initializing currentUserService');

    var userDeferred = $q.defer(),
        apiUrl = '/api/user';

    try {
        // Check if the application defines an adapter and the adapter defines a getApiUrl method
        apiUrl = $injector.get('adapter').adapter.getApiUrl();
    }
    catch (e) {
        // Fail silently
    }
    console.log('apiUrl', apiUrl);

    // Define anonymous user
    var genericUser = {
        name: 'Anonymous',
        isAuthenticated: false,
        permissions: []
    };

    genericUser.hasPermission = function(permission) {
        return user.permissions.indexOf(permission) > -1;
    };

    // Create an application user object
    var user = angular.copy(genericUser);

    // Load the current user when the service is instantiated
    loadUser();

    // Define service API
    return {
        get: getUser,
        login: login,
        logout: logout
    };

    function getUser(name) {
        return userDeferred.promise;
    }

    function loadUser(){
        console.log('Loading user from API');
        $http.get(apiUrl).
            success(function(data, status, headers, config) {
                user = angular.extend(user, data);
                userDeferred.resolve(user);
            }).
            error(function(data, status, headers, config) {
                userDeferred.reject('Failed to load user data. Server responded with status:', status);
            });
        return userDeferred.promise;
    }

    function login(username, password) {
        console.log('calling Login');
        userDeferred = $q.defer();
        $http.post(apiUrl, {username: username, password: password}).
            success(function(data, status, headers, config) {
                user = angular.extend(user, data);
                userDeferred.resolve(user);
            }).
            error(function(data, status, headers, config) {
                userDeferred.reject(data);
            });
        return userDeferred.promise;
    }

    function logout() {
        console.log('calling Logout');
        userDeferred = $q.defer();
        $http.delete(apiUrl).
            success(function(data, status, headers, config) {
                user = angular.copy(genericUser);
                console.log('successfully logging out, new user is: ', user);

                userDeferred.resolve(user);
            }).
            error(function(data, status, headers, config) {
                userDeferred.reject(data);
            });
        return userDeferred.promise;
    }

}
