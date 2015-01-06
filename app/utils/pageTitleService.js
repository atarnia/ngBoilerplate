angular.module('Atarnia.utils').factory('pageTitleService', ['$rootScope', pageTitleService]);

function pageTitleService($rootScope){

    // Define service API
    return {
        getTitle: getTitle,
        setTitle: setTitle
    };

    function getTitle(){
        return $rootScope.pageTitle;
    }

    function setTitle(title){
        $rootScope.pageTitle = title;
    }

}
