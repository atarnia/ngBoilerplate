angular.module('myApp').config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {

    // For any unmatched url, redirect to /state1
    $urlRouterProvider.otherwise('/hello');

    // Now set up the states
    $stateProvider
        .state('helloWorld', {
            url: '/hello',
            templateUrl: 'myModule/template.tpl.html',
            controller: 'MyController'
        })
        .state('helloWorldWithParams', {
            url: '/hello/:name?param&param2',
            templateUrl: 'myModule/template.tpl.html',
            controller: 'MyController'
        });

}]);
