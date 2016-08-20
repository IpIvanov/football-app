(function () {
  'use strict';

  angular
    .module('footballApp')
    .factory('footballData', footballData);

  /** @ngInject */
  function footballData($log, $http, $q, authHeader) {

    var service = {
      getFootballData: getFootballData,
      getLiveScoresData: getLiveScoresData
    };

    return service;

    function getFootballData(uri) {
      var deferred = $q.defer();

      $http.get(uri, authHeader).then(success).catch(error);

      function success(response) {
        deferred.resolve(response.data);
      }

      function error(error) {
        deferred.reject(error);
      }

      return deferred.promise;
    }

    function getLiveScoresData(uri) {
      var deferred = $q.defer();

      $http.get(uri).then(success).catch(error);

      function success(response) {
        deferred.resolve(response.data);
      }

      function error(error) {
        deferred.reject(error);
      }

      return deferred.promise;
    }
  }
})();
