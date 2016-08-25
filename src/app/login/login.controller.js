(function () {
    'use strict';

    angular
        .module('football')
        .controller('LoginController', LoginController);

    /** @ngInject */
    function LoginController($http) {
        var vm = this;
        console.log(localStorage)
        vm.signUpInfo = {
            username: undefined,
            password: undefined
        };

        vm.loginInfo = {
            username: undefined,
            password: undefined
        }
        
        vm.signUserUp = function () {
            var data = {
                username: vm.signUpInfo.username,
                password: vm.signUpInfo.password
            }


            $http.post("http://ipivanov.com/livescores/signup.php", data).then(successSignUp, error);
        }

        vm.loginUser = function () {
            var data = {
                username: vm.loginInfo.username,
                password: vm.loginInfo.password
            }


            $http.post("http://ipivanov.com/livescores/login.php", data).then(successLogin, error);
        }

        function successSignUp(response) {
            console.log(response);
            localStorage.setItem('user', response.data);
        }

        function successLogin(response) {
            console.log(response);
            localStorage.setItem('user', response.data.email);
        }

        function error(error) {
            console.log(error)
        }

        activate();

        function activate() {
        }

    }
})();
