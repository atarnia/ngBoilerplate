angular.module('myModule').controller('UploadController', ['$scope', '_uploader', UploadController]);

function UploadController($scope, _uploader) {

    $scope.uploadProgress = '';

    _uploader.setUp($scope, 'yourFile', 'yourToken', 'uploadProgress');
    _uploader.setUp($scope, 'yourOtherFile', 'yourOtherFile', 'uploadProgress');

    $scope.formIsValid = function() {
        return _.isEmpty($scope.uploadProgress);
    };

}
