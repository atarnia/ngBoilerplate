angular.module('myModule').controller('MyController', ['$scope', '$stateParams', 'pageTitleService', MyController]);

function MyController($scope, $stateParams, pageTitleService) {

    $scope.hello = 'Hello World!';
    $scope.params = $stateParams;

    if ($stateParams.name) {
        $scope.hello = 'Hello ' + $stateParams.name + '!';
        pageTitleService.setTitle($scope.hello);
    }
}
