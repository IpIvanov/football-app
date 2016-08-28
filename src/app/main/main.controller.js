(function () {
    'use strict';

    angular
        .module('football')
        .controller('MainController', MainController);

    /** @ngInject */
    function MainController($interval, $filter, uiGridConstants, moment, footballDataService, fixturesService) {
        var vm = this;
        vm.today = moment().format("dddd, MMMM DD, YYYY");
        vm.fixtures = [];
        vm.competitions = [];
        vm.livescoreMatches = [];
        vm.showWatermark = false;
        vm.emptyTableMessage = "Loading Data...";
        vm.gridOptions = {
            onRegisterApi: function (gridApi) {
                vm.gridApi = gridApi;
                vm.gridApi.grid.registerRowsProcessor(vm.singleFilter, 200);
                var browserHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0) - 230;
                angular.element(document.getElementsByClassName('grid')[0]).css('height', browserHeight + 'px');
            },
            enableColumnMenus: false,
            minRowsToShow: 25,
            enableGridMenu: true,
            fastWatch: true,
            enableFiltering: false,
            enableSorting: true,
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
                    name: 'State',
                    field: 'matchState',
                    width: 55,
                    cellClass: function (grid, row, col) {
                        if (grid.getCellValue(row, col) === '1 HF' || grid.getCellValue(row, col) === '2 HF' || grid.getCellValue(row, col) === 'H/T') {
                            return 'green';
                        }
                    },
                    cellTemplate: '<div class="ui-grid-cell-contents" ng-if="row.entity.matchState !== \'Sched\'">{{COL_FIELD}}</div>'
                },
                {
                    name: '',
                    field: 'liveTime',
                    width: 40,
                    cellClass: function (grid, row, col) {
                        if (grid.getCellValue(row, col) !== '' || row.entity.matchState == 'H/T') {
                            return 'green';
                        }
                    }
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
                {name: 'H/T', field: 'halfTimeResult', width: 50, enableFiltering: false},
                {
                    name: 'F/T',
                    field: 'fullTimeResult',
                    width: 50,
                    cellClass: function (grid, row, col) {
                        if (grid.getCellValue(row, col) !== '-') {
                            return 'bold-text';
                        }
                    }
                },
                {name: 'E/T', field: 'extraTimeResult', width: 50, visible: false},
                {name: 'P/R', field: 'penaltiesResult', width: 50, visible: false}
            ]
        };

        vm.gridOptions.appScopeProvider = vm;


        vm.toggleFiltering = function () {
            vm.gridOptions.enableFiltering = !vm.gridOptions.enableFiltering;
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

        activate();

        function activate() {
            getLiveMatches();
            $interval(function () {
                getLiveMatches();
            }, 60000);
        }

        function getLiveMatches() {
            footballDataService.getLiveScoresData('http://ipivanov.com/bettingapp/get_data.php').then(function (result) {
                vm.gridOptions.data = result.data;
                fixturesService.setFixtures(result.data);
                angular.forEach(vm.gridOptions.data, function (value, index) {
                    vm.gridOptions.data[index].startTime = $filter('convertDateFilter')(value.startTime)
                });
            }).finally(function () {
                vm.emptyTableMessage = "No Results";
                vm.timeZone = footballDataService.getTimeZone();
                vm.localTime = moment().tz(footballDataService.getTimeZone()).format("HH:mm");
            });
        }
    }
})();
