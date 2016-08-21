(function () {
  'use strict';

  angular
      .module('football')
      .controller('MainController', MainController);

  /** @ngInject */
  function MainController(footballData) {
    var vm = this;

    vm.fixtures = [];
    vm.competitions = [];
    vm.livescoreMatches = [];

    activate();

    function activate() {
      footballData.getLiveScoresData('http://ipivanov.com/bettingapp/get_data.php').then(function (result) {
        console.log(result.data);
        vm.livescoreMatches = result.data;
      });
    }
  }
})();
