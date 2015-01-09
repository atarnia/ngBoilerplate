angular.module('myApp').config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {

    // For any unmatched url, redirect to default
    $urlRouterProvider.otherwise('/hello');

    // Now set up the states
    $stateProvider
        .state('helloWorld', {
            title: 'Hi There!',
            url: '/hello',
            templateUrl: 'myModule/template.tpl.html',
            controller: 'MyController'
        })
        .state('helloWorldWithParams', {
            title: 'Hello Parameters!',
            url: '/hello/:name?param&param2',
            templateUrl: 'myModule/template.tpl.html',
            controller: 'MyController'
        })
        .state('userLogin', {
            title: 'Log in',
            url: '/user/login',
            templateUrl: 'atarnia/auth/login.tpl.html',
            controller: '_LoginController'
        });

}]);

angular.module('myApp').run(['$rootScope', '_pageTitle', function($rootScope, _pageTitle) {
    _pageTitle.set('Welcome!');
    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
        _pageTitle.set(toState.title);
    });
}]);
