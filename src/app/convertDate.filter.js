(function () {
    'use strict';

    angular
        .module('football')
        .filter('convertDateFilter', convertDateFilter);

    /** @ngInject */
    function convertDateFilter(moment, footballData) {
        return function (date) {
            return moment(date).tz(footballData.getTimeZone()).format("HH:mm");
        }
    }

})();