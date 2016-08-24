(function () {
    'use strict';

    angular
        .module('football')
        .filter('convertDateFilter', convertDateFilter);

    /** @ngInject */
    function convertDateFilter(moment, footballDataService) {
        return function (date) {
            return moment(date).tz(footballDataService.getTimeZone()).format("HH:mm");
        }
    }

})();