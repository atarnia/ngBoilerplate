angular.module('myApp', ['ui.router', 'myModule', 'templates', 'Atarnia.utils'])
.config(["apiAdapterProvider", function (apiAdapterProvider) {
        apiAdapterProvider.server.namespace = '/api/';
    }]);
