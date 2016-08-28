/* global malarkey:false, moment:false */
(function () {
    'use strict';

    angular
        .module('football')
        .constant('malarkey', malarkey)
        .constant('moment', moment)
        .constant('_', window._)
        .constant('authHeader', {headers: {'X-Auth-Token': '7af66f944d6c4289a2a7da6c502dd4ae'}});

})();
