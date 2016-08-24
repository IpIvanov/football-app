(function () {
    'use strict';

    angular
        .module('football')
        .filter('convertDateFilter', convertDateFilter);

    /** @ngInject */
    function convertDateFilter(moment, footballDataService) {
        return function (date) {
            return moment(date, 'YYYY-MMM-DD HH:mm:ss').tz(footballDataService.getTimeZone()).format("HH:mm");
        }
    }

})();