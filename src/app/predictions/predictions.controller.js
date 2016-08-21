(function () {
  'use strict';

  angular
    .module('football')
    .controller('PredictionsController', PredictionsController);

  /** @ngInject */
  function PredictionsController(footballData) {
    var vm = this;

    vm.fixtures = [];
    vm.competitions = [];
    vm.livescoreMatches = [];
    vm.gridOptions = {
      excludeProperties: '__metadata',
    };

    activate();

    function activate() {
      footballData.getFootballData('http://api.football-data.org/v1/fixtures?timeFrame=n2').then(function (result) {
        vm.fixtures = result.fixtures;
        vm.gridOptions.data = result.fixtures;
      });
    }

    function getAllCompetitions() {
      footballData.getFootballData('http://api.football-data.org/v1/competitions').then(function (result) {
        vm.competitions = result;
        getCompetitionId(vm.fixtures);
      });
    }

    function getCompetitionId(fixtures) {
      var competitionsIds = [];
      angular.forEach(fixtures, function (fixture) {
        competitionsIds.push(fixture._links.competition.href.split('/').pop());
      });
      getCompetitionNames(competitionsIds, vm.competitions);
    }

    function getCompetitionNames(competitionsIds, arrayOfNames) {
      vm.arrayOfNames = [];
      angular.forEach(competitionsIds, function (competitionId) {
        angular.forEach(arrayOfNames, function (name) {
          if (competitionId === name.id.toString()) {
            vm.arrayOfNames.push(name.caption.slice(0, -8));
          }
        });
      });

    }
  }
})();
