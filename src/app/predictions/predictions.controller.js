(function () {
    'use strict';

    angular
        .module('football')
        .controller('PredictionsController', PredictionsController);

    /** @ngInject */
    function PredictionsController(footballDataService, $filter, _, $uibModal) {
        var vm = this;
        vm.predictions = [];
        vm.today = moment().format("dddd, MMMM DD, YYYY");

        activate();

        function activate() {
            getPredictions();
        }
        
        vm.addPrediction = function () {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'app/components/modalWindow/modal.prediction.html',
                controller: 'AddPredictionController',
                controllerAs: 'modalPrediction',
                bindToController: true,
                size: 'md',
                resolve: {
                    // errorMsg: function() {
                    //   return error;
                    // }
                }
            });


            modalInstance.result.then(function (username) {
                vm.username = username.trim();
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        }

        function getPredictions() {
            footballDataService.getLiveScoresData('http://ipivanov.com/bettingapp/get_predictions.php').then(function (result) {
                angular.forEach(result.data, function (value, index) {
                    if (value.prediction !== '') {
                        vm.predictions.push(value);
                    }
                });
                angular.forEach(vm.predictions, function (value, index) {
                    vm.predictions[index].startTime = $filter('convertDateFilter')(value.startTime)
                });
                vm.predictions = _.sortBy(vm.predictions, 'startTime');
            });
        }

    }
})();
