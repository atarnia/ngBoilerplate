angular.module('myApp', ['ui.router', 'myModule', 'templates', 'Atarnia.utils'])

    .config(["atarniaSettingsProvider", function (atarnia) {
        atarnia.apiAdapter.namespace = '/api/';
    }]);


