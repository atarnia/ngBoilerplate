angular.module('Atarnia.utils').factory('_uploader', ['$upload', _uploader]);

function _uploader($upload) {

    return {
        setUp: setUpUploader
    };

    function setUpUploader(scope, fileFieldLabel, tokenFieldLabel, progressFieldLabel) {
        var uploader;
        scope.$watch(fileFieldLabel, function() {
            var file = scope[fileFieldLabel] && scope[fileFieldLabel][0];

            if (file){
                if (uploader) { uploader.abort(); }

                uploader = $upload.upload({
                    url: '/api/upload', // upload.php script, node.js route, or servlet url
                    method: 'POST',
                    // USE CSRF token (adapter.getCSRFToken)
                    //  //headers: {'Authorization': 'xxx'}, // only for html5
                    file: file, // single file or a list of files. list is only for html5
                    //  //withCredentials: true,
                    //  data: {myObj: 'test'},
                    //  //fileName: 'doc.jpg' or ['1.jpg', '2.jpg', ...] // to modify the name of the file(s)
                    //  //fileFormDataName: myFile, // file formData name ('Content-Disposition'), server side request form name
                    //                              // could be a list of names for multiple files (html5). Default is 'file'
                    //  //formDataAppender: function(formData, key, val){}  // customize how data is added to the formData.
                    //                                                      // See #40#issuecomment-28612000 for sample code
                    //
                }).progress(function(evt) {
                    scope[progressFieldLabel] = scope[progressFieldLabel] || {};

                    scope[progressFieldLabel][fileFieldLabel] = 'progress: ' + parseInt(100.0 * evt.loaded / evt.total) + '% file :'+ evt.config.file.name;
                }).success(function(data, status, headers, config) {
                    scope[tokenFieldLabel] = data.token;
                    delete scope[progressFieldLabel][fileFieldLabel];
                });
                //.error(...)

            }

        });
    }
}