(function () {
    'use strict';

    angular
        .module('football')
        .controller('PredictionsController', PredictionsController);

    /** @ngInject */
    function PredictionsController(footballDataService) {
        var vm = this;
        vm.predictions = [];

        activate();

        function activate() {
            getPredictions();
        }

        function getPredictions() {
            footballDataService.getLiveScoresData('http://ipivanov.com/bettingapp/get_predictions.php').then(function (result) {
                vm.predictions = result.data;
            });
        }

    }
})();
