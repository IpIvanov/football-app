(function() {
  'use strict';

  angular
    .module('football')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log, $window, footballDataService) {
    angular.element($window).bind('resize', function(){
      var browserHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0) - 270;
      angular.element(document.getElementsByClassName('grid')[0]).css('height', browserHeight + 'px');
    });
    $log.debug('runBlock end');

    footballDataService.getLiveScoresData('http://freegeoip.net/json/').then(function (result) {
      footballDataService.setTimeZone(result.time_zone);
    });
  }

})();
