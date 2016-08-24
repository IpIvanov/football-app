(function () {
    'use strict';

    angular
        .module('football')
        .factory('fixturesService', fixturesService);

    /** @ngInject */
    function fixturesService() {

        var vm = this;
        vm.fixtures = [];

        var service = {
            setFixtures: setFixtures,
            getFixtures: getFixtures
        };

        return service;

        function setFixtures(fixtures) {
            if(fixtures !== vm.fixtures){
                vm.fixtures = fixtures;
            }
            else{
                console.log('fixtures are the same')
            }
        }

        function getFixtures(){
            return vm.fixtures;
        }
    }
})();
