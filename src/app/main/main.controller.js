(function () {
    'use strict';

    angular
        .module('football')
        .controller('MainController', MainController);

    /** @ngInject */
    function MainController($interval, moment, footballData, uiGridConstants) {
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
                    type: 'date',
                    cellFilter: 'convertDateFilter'
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
                {name: 'State', field: 'matchState', width: 75},
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
            footballData.getLiveScoresData('http://ipivanov.com/bettingapp/get_data.php').then(function (result) {
                vm.livescoreMatches = result.data;
                vm.gridOptions.data = result.data;
            });
        }
    }
})();
