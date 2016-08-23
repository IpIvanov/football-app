(function () {
    'use strict';

    angular
        .module('football')
        .controller('MainController', MainController);

    /** @ngInject */
    function MainController($interval, $filter, moment, footballData, uiGridConstants) {
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
                {
                    name: 'Start',
                    field: 'startTime',
                    width: 75,
                    enableCellEdit: true,
                    type: 'date'
                },
                {
                    name: 'Flag',
                    field: 'flag',
                    width: 50,
                    cellTemplate: '<div class="ui-grid-cell-contents"><img class="flag-image" src="{{COL_FIELD}}" alt="Country flag image"></div>',
                    enableFiltering: false,
                    enableSorting: false
                },
                {name: 'League', field: 'leagueName', width: 75},
                {
                    name: 'State',
                    field: 'matchState',
                    width: 75,
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        if (grid.getCellValue(row, col) === '2 HF') {
                            return 'red';
                        }
                    }
                },
                {
                    name: 'Time',
                    field: 'liveTime',
                    width: 75,
                    cellTemplate: '<div class="ui-grid-cell-contents red">{{COL_FIELD}}</div>'
                },
                {
                    name: 'Home Team',
                    field: 'teams[0].homeTeamName',
                    cellTemplate: '<div class="ui-grid-cell-contents"><b>{{COL_FIELD}}</b></div>'
                },
                {
                    name: 'Away Team',
                    field: 'teams[1].awayTeamName',
                    cellTemplate: '<div class="ui-grid-cell-contents"><b>{{COL_FIELD}}</b></div>'
                },
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
                getLiveMatches();
            }, 30000);
        }

        function getLiveMatches() {
            footballData.getLiveScoresData('http://freegeoip.net/json/').then(function (result) {
                footballData.setTimeZone(result.time_zone);
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
