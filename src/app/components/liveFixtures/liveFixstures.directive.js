(function() {
  'use strict';

  angular
    .module('football')
    .directive('liveFixtures', liveFixtures);

  /** @ngInject */
  function liveFixtures() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/liveFixtures/liveFixtures.html',
      scope: {
        livescoreMatches: '='
      },
      controller: LiveFixturesController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function LiveFixturesController() {
    }
  }

})();
