(function() {
  'use strict';

  angular
    .module('football')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log, footballData) {
    $log.debug('runBlock end');
  }

})();
