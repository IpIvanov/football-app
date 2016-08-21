(function () {
  'use strict';

  angular
    .module('football')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController($interval, footballData, uiGridConstants) {
    var vm = this;
    vm.today = moment().format("Do MMMM");

    vm.fixtures = [];
    vm.competitions = [];
    vm.livescoreMatches = [];
    vm.gridOptions = {
      onRegisterApi: function (gridApi) {
        vm.gridApi = gridApi;
      },
      showGridFooter: true,
      minRowsToShow: 20,
      enableGridMenu: true,
      fastWatch: true,
      enableFiltering: false,
      enableSorting: true,
      columnDefs: [
        {name: 'Start', field: 'startTime', width: 75, enableCellEdit: true},
        {
          name: 'Flag',
          field: 'flag',
          width: 50,
          cellTemplate: '<div class="ui-grid-cell-contents"><img class="flag-image" src="{{COL_FIELD}}" alt="Country flag image"></div>',
          enableFiltering: false,
          enableSorting: false
        },
        {name: 'League', field: 'leagueName', width: 75},
        {name: 'State', field: 'matchState', width: 75},
        {name: 'Time', field: 'liveTime', width: 75},
        {name: 'Home Team', field: 'teams[0].homeTeamName'},
        {name: 'Away Team', field: 'teams[1].awayTeamName'},
        {name: 'H/T', field: 'halfTimeResult', width: 50},
        {name: 'F/T', field: 'fullTimeResult', width: 50},
        {name: 'E/T', field: 'extraTimeResult', width: 50},
        {name: 'P/R', field: 'penaltiesResult', width: 50}
      ]
    };

    vm.toggleFiltering = function () {
      vm.gridOptions.enableFiltering = !vm.gridOptions.enableFiltering;
      vm.gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
    };


    activate();

    function activate() {
      getLiveMatches();
      $interval(function () {
        console.log('updated')
        getLiveMatches();
      }, 30000);

    }

    function getLiveMatches() {
      footballData.getLiveScoresData('http://ipivanov.com/bettingapp/get_data.php').then(function (result) {
        console.log(result.data);
        vm.livescoreMatches = result.data;
        vm.gridOptions.data = result.data;
      });
    }
  }
})();
