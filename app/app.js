angular.module('templates', []);
angular.module('myModule', ['templates']);
angular.module('myApp', ['ui.router', 'myModule', 'templates']);
