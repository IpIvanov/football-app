(function() {
  'use strict';

  angular
    .module('football')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log, footballData) {
    footballData.getLiveScoresData('http://ip-api.com/json').then(function (result) {
      footballData.setTimeZone(result.timezone)
    });
    $log.debug('runBlock end');
  }

})();
