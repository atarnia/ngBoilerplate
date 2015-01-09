angular.module('Atarnia.utils').factory('_pageTitle', ['$rootScope', _pageTitleService]);

function _pageTitleService($rootScope){

    // Define service API
    return {
        get: getTitle,
        set: setTitle
    };

    function getTitle(){
        return $rootScope._pageTitle;
    }

    function setTitle(title){
        $rootScope._pageTitle = title;
    }

}
