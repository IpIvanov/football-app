(function () {
  'use strict';

  angular
    .module('football')
    .controller('AddPredictionController', AddPredictionController);

  /** @ngInject */
  function AddPredictionController($uibModalInstance, $filter, $log, uiGridConstants, fixturesService, footballDataService) {
    var vm = this;


    vm.gridOptions = {
      onRegisterApi: function (gridApi) {
        vm.gridApi = gridApi;
        vm.gridApi.grid.registerRowsProcessor(vm.singleFilter, 200);
        var browserHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0) - 230;
        angular.element(document.getElementsByClassName('grid')[0]).css('height', browserHeight + 'px');
      },
      enableColumnMenus: false,
      minRowsToShow: 25,
      fastWatch: true,
      enableFiltering: false,
      enableSorting: true,
      rowEditWaitInterval: -1,
      columnDefs: [
        {
          name: 'Start',
          field: 'startTime',
          width: 50,
          enableCellEdit: true,
          type: 'date'
        },
        {
          name: 'League',
          field: 'leagueName',
          width: 70,
          cellTemplate: '<div class="ui-grid-cell-contents" ng-init="grid.appScope.parseTooltip(row.entity.flag)" ng-mouseenter="grid.appScope.parseTooltip(row.entity.flag)" uib-tooltip="{{grid.appScope.toolTip}}" tooltip-append-to-body="true" tooltip-placement="left" tooltip-animation="false"><img class="flag-image" ng-src="{{row.entity.flag}}" alt="Country flag image">{{COL_FIELD}}</div>'
        },
        {
          name: 'Home Team',
          field: 'homeTeam.name',
          cellTemplate: '<div class="ui-grid-cell-contents"><span class="yellow-cards" ng-if="row.entity.homeTeam.yellowCards !== \'0\'">{{row.entity.homeTeam.yellowCards}}</span><span class="red-cards" ng-if="row.entity.homeTeam.redCards !== \'0\'">{{row.entity.homeTeam.redCards}}</span><b>{{COL_FIELD}}</b> <span class="team-rank">{{row.entity.homeTeam.leagueRank}}</span></div>'
        },
        {
          name: 'Away Team',
          field: 'awayTeam.name',
          cellTemplate: '<div class="ui-grid-cell-contents"><b><span class="yellow-cards" ng-if="row.entity.awayTeam.yellowCards !== \'0\'">{{row.entity.awayTeam.yellowCards}}</span><span class="red-cards" ng-if="row.entity.awayTeam.redCards !== \'0\'">{{row.entity.awayTeam.redCards}}</span>{{COL_FIELD}}</b> <span class="team-rank">{{row.entity.awayTeam.leagueRank}}</span></div>'
        },
        {
          name: 'Prediction',
          field: 'prediction',
          width: 150,
          cellTemplate: '<div class="ui-grid-cell-contents"><select class="form-control" style="height: 24px;padding: 2px"><option selected="selected"></option><option value="home-win">Home Win</option><option value="away-win">Away Win</option><option value="over">Over 2.5goals</option><option value="under">Under 2.5goals</option><option value="gg">g / g</option><option value="gng">g / no goal</option></select></div>'
        }
      ]
    };
    vm.gridOptions.appScopeProvider = vm;


    vm.toggleFiltering = function () {
      vm.gridOptions.enableFiltering =  !vm.gridOptions.enableFiltering;
      vm.gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
    };

    vm.parseTooltip = function (p) {
      vm.toolTip = p.split("/").pop().split(".")[0].toUpperCase();
    };

    vm.filter = function () {
      vm.gridApi.grid.refresh();
    };

    vm.singleFilter = function (renderableRows) {
      if (angular.isDefined(vm.filterValue)) {
        var matcher = new RegExp(vm.filterValue.toUpperCase());
      }
      renderableRows.forEach(function (row) {
        var match = false;
        vm.countResults = 0;
        [row.entity.homeTeam.name, row.entity.awayTeam.name, row.entity.flag.split("/").pop().split(".")[0].toUpperCase()].forEach(function (field) {
          if (field.match(matcher)) {
            match = true;
          }
        });
        if (!match) {
          row.visible = false;
        }
      });

      return renderableRows;
    };

    vm.clearInput = function (event) {
      if (event.which === 27) { //esc key
        vm.filterValue = '';
        vm.gridApi.grid.refresh();
        event.preventDefault();
      }
    };

    footballDataService.getLiveScoresData('http://ipivanov.com/bettingapp/get_data.php').then(function (result) {
      console.log(result.data)
      var filteredMatches = [];
      angular.forEach(result.data, function (value, index) {
        if (value.matchState === 'Sched') {
          filteredMatches.push(value);
        }
      });
      vm.gridOptions.data = filteredMatches;
      angular.forEach(vm.gridOptions.data, function (value, index) {
        vm.gridOptions.data[index].startTime = $filter('convertDateFilter')(value.startTime);
      });
    }).finally(function () {
      vm.emptyTableMessage = "No Results";
    });


  }

})();
