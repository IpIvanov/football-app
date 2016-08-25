(function () {
    'use strict';

    angular
        .module('football')
        .controller('MainController', MainController);

    /** @ngInject */
    function MainController($interval, $filter, uiGridConstants, moment, footballDataService, fixturesService, _) {
        _.each([1, 2, 3], console.log);
        var vm = this;
        vm.today = moment().format("dddd, MMMM DD, YYYY");
        vm.fixtures = [];
        vm.competitions = [];
        vm.livescoreMatches = [];
        vm.gridOptions = {
            onRegisterApi: function (gridApi) {
                vm.gridApi = gridApi;
                var browserHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0) - 200;
                angular.element(document.getElementsByClassName('grid')[0]).css('height', browserHeight + 'px');
            },
            //showGridFooter: true,
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
                    type: 'date',
                    enableFiltering: false
                },
                {
                    name: 'League',
                    field: 'leagueName',
                    width: 70,
                    enableFiltering: false,
                    cellTemplate: '<div class="ui-grid-cell-contents" ng-init="grid.appScope.parseTooltip(row.entity.flag)" ng-mouseenter="grid.appScope.parseTooltip(row.entity.flag)" uib-tooltip="{{grid.appScope.toolTip}}" tooltip-append-to-body="true" tooltip-placement="left" tooltip-animation="false"><img class="flag-image" ng-src="{{row.entity.flag}}" alt="Country flag image">{{COL_FIELD}}</div>'
                },
                {
                    name: 'State',
                    field: 'matchState',
                    width: 55,
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        if (grid.getCellValue(row, col) === '1 HF' || grid.getCellValue(row, col) === '2 HF' || grid.getCellValue(row, col) === 'H/T') {
                            return 'green';
                        }
                    },
                    cellTemplate: '<div class="ui-grid-cell-contents" ng-if="row.entity.matchState !== \'Sched\'">{{COL_FIELD}}</div>',
                    enableFiltering: false
                },
                {
                    name: 'Time',
                    field: 'liveTime',
                    width: 40,
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        if (grid.getCellValue(row, col) !== '' || row.entity.matchState == 'H/T') {
                            return 'green';
                        }
                    },
                    enableFiltering: false
                },
                {
                    name: 'Home Team',
                    field: 'homeTeam.name',
                    cellTemplate: '<div class="ui-grid-cell-contents"><b>{{COL_FIELD}}</b> <span class="team-rank">{{row.entity.homeTeam.leagueRank}}</span><span class="yellow-cards" ng-if="row.entity.homeTeam.yellowCards !== \'0\'">{{row.entity.homeTeam.yellowCards}}</span><span class="red-cards" ng-if="row.entity.homeTeam.redCards !== \'0\'">{{row.entity.homeTeam.redCards}}</span></div>'
                },
                {
                    name: 'Away Team',
                    field: 'awayTeam.name',
                    cellTemplate: '<div class="ui-grid-cell-contents"><b>{{COL_FIELD}}</b> <span class="team-rank">{{row.entity.awayTeam.leagueRank}}</span><span class="yellow-cards" ng-if="row.entity.awayTeam.yellowCards !== \'0\'">{{row.entity.awayTeam.yellowCards}}</span><span class="red-cards" ng-if="row.entity.awayTeam.redCards !== \'0\'">{{row.entity.awayTeam.redCards}}</span></div>'
                },
                {name: 'H/T', field: 'halfTimeResult', width: 50, enableFiltering: false},
                {
                    name: 'F/T',
                    field: 'fullTimeResult',
                    width: 50,
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        if (grid.getCellValue(row, col) !== '-') {
                            return 'bold-text';
                        }
                    },
                    enableFiltering: false
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
            vm.toolTip = p.split( "/" ).pop().split(".")[0].toUpperCase();
        }

        activate();

        function activate() {
            getLiveMatches();
            $interval(function () {
                getLiveMatches();
            }, 30000);
        }

        function getLiveMatches() {
            footballDataService.getLiveScoresData('http://freegeoip.net/json/').then(function (result) {
                vm.timeZone = result.time_zone;
                footballDataService.setTimeZone(result.time_zone);
                vm.localTime = moment().tz(footballDataService.getTimeZone()).format("HH:mm");
                footballDataService.getLiveScoresData('http://ipivanov.com/bettingapp/get_data.php').then(function (result) {
                    vm.gridOptions.data = result.data;
                    fixturesService.setFixtures(result.data);
                    angular.forEach(vm.gridOptions.data, function (value, index) {
                        vm.gridOptions.data[index].startTime = $filter('convertDateFilter')(value.startTime)
                    });
                });
            });
        }
    }
})();
