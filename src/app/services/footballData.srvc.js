(function () {
  'use strict';

  angular
    .module('football')
    .factory('footballDataService', footballDataService);

  /** @ngInject */
  function footballDataService($http, $q, authHeader) {

    var service = {
      getFootballData: getFootballData,
      getLiveScoresData: getLiveScoresData,
      setTimeZone: setTimeZone,
      getTimeZone: getTimeZone,
      getLiveScoresDataByTableName: getLiveScoresDataByTableName
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

    function getLiveScoresDataByTableName(uri, tableName) {
      var deferred = $q.defer();

      var data = {tableName: tableName};

      $http.post(uri, data).then(success).catch(error);

      function success(response) {
        deferred.resolve(response.data);
      }

      function error(error) {
        deferred.reject(error);
      }

      return deferred.promise;
    }

    function setTimeZone(timezone) {
      this.timezone = timezone;
    }

    function getTimeZone() {
      return this.timezone;
    }
  }
})();
