angular.module('myModule').controller('MyController', ['$scope', '$stateParams',
    '_pageTitle', '_appUser', MyController]);

function MyController($scope, $stateParams, _pageTitle, _appUser) {

    $scope.hello = 'Hello World!';
    $scope.params = $stateParams;

    if ($stateParams.name) {
        $scope.hello = 'Hello ' + $stateParams.name + '!';
        _pageTitle.set($scope.hello);
    }

    _appUser.get().then(function(user){
        $scope.user = user;
    });

}
