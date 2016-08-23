(function () {
    'use strict';

    angular
        .module('football')
        .controller('PredictionsController', PredictionsController);

    /** @ngInject */
    function PredictionsController(footballData) {
        var vm = this;
        vm.predictions = [];

        activate();

        function activate() {
            getPredictions();
        }

        function getPredictions() {
            footballData.getLiveScoresData('http://ipivanov.com/bettingapp/get_predictions.php').then(function (result) {
                vm.predictions = result.data;
            });
        }

    }
})();
