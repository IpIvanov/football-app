(function () {
    'use strict';

    angular
        .module('football')
        .factory('registerLoginService', registerLoginService);

    /** @ngInject */
    function registerLoginService($http, $q) {

        var service = {
            registerUser: registerUser,
            checkToken: checkToken,
            logInUser: logInUser,
            logOutUser: logOutUser
        };

        return service;

        function registerUser(data) {
            var deferred = $q.defer();

            $http.post("http://ipivanov.com/livescores/signup.php", data).then(success).catch(error);

            function success(response) {
                deferred.resolve(response.data);
            }

            function error(error) {
                deferred.reject(error);
            }

            return deferred.promise;
        }

        function checkToken(token) {
            var deferred = $q.defer();
            var data = {token: token};

            $http.post("http://ipivanov.com/livescores/checkToken.php", data).then(success).catch(error);

            function success(response) {
                deferred.resolve(response.data);
            }

            function error(error) {
                deferred.reject(error);
            }

            return deferred.promise;
        }

        function logOutUser(token) {
            var deferred = $q.defer();
            var data = {token: token};

            $http.post("http://ipivanov.com/livescores/logout.php", data).then(success).catch(error);

            function success(response) {
                deferred.resolve(response.data);
            }

            function error(error) {
                deferred.reject(error);
            }

            return deferred.promise;
        }

        function logInUser(data) {
            var deferred = $q.defer();

            $http.post("http://ipivanov.com/livescores/login.php", data).then(success).catch(error);

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
