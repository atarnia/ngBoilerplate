angular.module('Atarnia.utils').factory('_uploader', ['$upload', '_apiAdapter', _uploader]);

function _uploader($upload, _apiAdapter) {

    return {
        setUp: setUpUploader
    };

    function setUpUploader(scope, fileFieldLabel, tokenFieldLabel, progressFieldLabel) {
        var url = _apiAdapter.getApiUrl() + 'upload/',
            uploader;

        scope.$watch(fileFieldLabel, function() {
            var file = scope[fileFieldLabel] && scope[fileFieldLabel][0];

            if (file){
                if (uploader) { uploader.abort(); }

                uploader = $upload.upload({
                    url: url,
                    method: 'POST',
                    file: file
                    })
                    .progress(function(evt) {
                        scope[progressFieldLabel] = scope[progressFieldLabel] || {};

                        scope[progressFieldLabel][fileFieldLabel] = {
                            progress: parseInt(100.0 * evt.loaded / evt.total),
                            loaded: evt.loaded,
                            total: evt.total
                        };
                    })
                    .success(function(data, status, headers, config) {
                        scope[tokenFieldLabel] = data.token;
                        delete scope[progressFieldLabel][fileFieldLabel];
                    })
                    .error(function(reason){
                        scope[progressFieldLabel][fileFieldLabel] = { error: reason };
                    });
            }
        });
    }
}
