(function() {
  'use strict';

  angular
    .module('football')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log, $window) {
    angular.element($window).bind('resize', function(){
      var browserHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0) - 230;
      angular.element(document.getElementsByClassName('grid')[0]).css('height', browserHeight + 'px');
    });
    $log.debug('runBlock end');
  }

})();
