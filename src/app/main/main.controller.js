(function () {
    'use strict';

    angular
        .module('football')
        .controller('MainController', MainController);

    /** @ngInject */
    function MainController($interval, $filter, moment, footballData, uiGridConstants) {
        var vm = this;
        vm.today = moment().format("dddd, MMMM DD, YYYY");

        vm.fixtures = [];
        vm.competitions = [];
        vm.livescoreMatches = [];
        vm.gridOptions = {
            onRegisterApi: function (gridApi) {
                vm.gridApi = gridApi;
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
                    type: 'date'
                },
                {
                    name: 'Flag',
                    field: 'flag',
                    width: 30,
                    cellTemplate: '<div class="ui-grid-cell-contents"><img class="flag-image" src="{{COL_FIELD}}" alt="Country flag image"></div>',
                    enableFiltering: false,
                    enableSorting: false
                },
                {name: 'League', field: 'leagueName', width: 50},
                {
                    name: 'State',
                    field: 'matchState',
                    width: 50,
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        if (grid.getCellValue(row, col) === '1 HF' || grid.getCellValue(row, col) === '2 HF' || grid.getCellValue(row, col) === 'H/T') {
                            return 'green';
                        }
                    },
                    cellTemplate: '<div class="ui-grid-cell-contents" ng-if="row.entity.matchState !== \'Sched\'">{{COL_FIELD}}</div>'
                },
                {
                    name: 'Time',
                    field: 'liveTime',
                    width: 30,
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        if (grid.getCellValue(row, col) !== '') {
                            return 'green';
                        }
                    }
                },
                {
                    name: 'Home Team',
                    field: 'teams[0].homeTeamName',
                    cellTemplate: '<div class="ui-grid-cell-contents"><b>{{COL_FIELD}}</b> <span class="team-rank">{{row.entity.teams[0].homeTeamLeagueRank}}</span><span class="yellow-cards" ng-if="row.entity.teams[0].homeTeamYcards !== \'0\'">{{row.entity.teams[0].homeTeamYcards}}</span><span class="red-cards" ng-if="row.entity.teams[0].homeTeamRcards !== \'0\'">{{row.entity.teams[0].homeTeamRcards}}</span></div>'
                },
                {
                    name: 'Away Team',
                    field: 'teams[1].awayTeamName',
                    cellTemplate: '<div class="ui-grid-cell-contents"><b>{{COL_FIELD}}</b> <span class="team-rank">{{row.entity.teams[1].awayTeamLeagueRank}}</span><span class="yellow-cards" ng-if="row.entity.teams[1].awayTeamYcards !== \'0\'">{{row.entity.teams[1].awayTeamYcards}}</span><span class="red-cards" ng-if="row.entity.teams[1].awayTeamRcards !== \'0\'">{{row.entity.teams[1].awayTeamRcards}}</span></div>'
                },
                {name: 'H/T', field: 'halfTimeResult', width: 50},
                {
                    name: 'F/T',
                    field: 'fullTimeResult',
                    width: 50,
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        if (grid.getCellValue(row, col) !== '-') {
                            return 'bold-text';
                        }
                    }
                },
                {name: 'E/T', field: 'extraTimeResult', width: 50, visible: false},
                {name: 'P/R', field: 'penaltiesResult', width: 50, visible: false}
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
                getLiveMatches();
            }, 30000);
        }

        function getLiveMatches() {
            footballData.getLiveScoresData('http://freegeoip.net/json/').then(function (result) {
                vm.timeZone = result.time_zone;
                footballData.setTimeZone(result.time_zone);
                vm.localTime = moment().tz(footballData.getTimeZone()).format("HH:mm");
                footballData.getLiveScoresData('http://ipivanov.com/bettingapp/get_data.php').then(function (result) {
                    vm.gridOptions.data = result.data;
                    angular.forEach(vm.gridOptions.data, function (value, index) {
                        vm.gridOptions.data[index].startTime = $filter('convertDateFilter')(value.startTime)
                    });
                });
            });
        }
    }
})();
