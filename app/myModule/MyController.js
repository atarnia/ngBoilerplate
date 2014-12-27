angular.module('myModule').controller('MyController', ['$scope', '$stateParams', function ($scope, $stateParams) {

        $scope.hello = 'Hello World!';
        $scope.params = $stateParams;

        if ($stateParams.name) {
                $scope.hello = 'Hello ' + $stateParams.name + '!';
        }


}]);


