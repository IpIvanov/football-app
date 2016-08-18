(function () {
    'use strict';

    angular
        .module('footballApp')
        .controller('MainController', MainController);

    /** @ngInject */
    function MainController($timeout, webDevTec, toastr, footballData) {
        var vm = this;

        vm.awesomeThings = [];
        vm.classAnimation = '';
        vm.creationDate = 1471520251974;
        vm.showToastr = showToastr;
        vm.fixtures = [];
        vm.competitions = [];

        activate();

        function activate() {
            getWebDevTec();
            $timeout(function () {
                vm.classAnimation = 'rubberBand';
            }, 4000);
            footballData.getFootballData('http://api.football-data.org/v1/fixtures?timeFrame=n2').then(function (result) {
                vm.fixtures = result.fixtures;
            });
        }

        function showToastr() {
            toastr.info('Fork <a href="https://github.com/Swiip/generator-gulp-angular" target="_blank"><b>generator-gulp-angular</b></a>');
            vm.classAnimation = '';
        }

        function getWebDevTec() {
            vm.awesomeThings = webDevTec.getTec();

            angular.forEach(vm.awesomeThings, function (awesomeThing) {
                awesomeThing.rank = Math.random();
            });
        }

        function getAllCompetitions() {
            footballData.getFootballData('http://api.football-data.org/v1/competitions').then(function (result) {
                vm.competitions = result;
            });
        }

        // function getCompetitionId(fixtures) {
        //     var competitionsIds = [];
        //     angular.forEach(fixtures, function (fixture) {
        //         competitionsIds.push(fixture._links.competition.href.split('/').pop());
        //     });
        //     getCompetitionNames(competitionsIds, vm.competitions);
        // }
        //
        // function getCompetitionNames(competitionsIds, arrayOfNames){
        //     debugger
        //     angular.forEach(competitionsIds, function (competitionId) {
        //         angular.forEach(arrayOfNames, function (elem) {
        //             if(elem.caption === competitionId){
        //                 console.log(competitionId)
        //             }
        //         });
        //     });
        // }
    }
})();
