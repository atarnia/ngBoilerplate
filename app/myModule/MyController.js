angular.module('myModule').controller('MyController', ['$scope', '$stateParams',
    'pageTitleService', 'currentUser', MyController]);

function MyController($scope, $stateParams, pageTitleService, currentUser) {

    $scope.hello = 'Hello World!';
    $scope.params = $stateParams;

    if ($stateParams.name) {
        $scope.hello = 'Hello ' + $stateParams.name + '!';
        pageTitleService.setTitle($scope.hello);
    }

    currentUser.get().then(function(user){
        $scope.user = user;
    });

}
