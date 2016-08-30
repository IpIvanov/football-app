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
      vm.fixtures = fixtures;
    }

    function getFixtures() {
      return vm.fixtures;
    }
  }
})();
