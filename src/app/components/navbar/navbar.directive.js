(function () {
    'use strict';

    angular
        .module('football')
        .directive('acmeNavbar', acmeNavbar);

    /** @ngInject */
    function acmeNavbar() {
        var directive = {
            restrict: 'E',
            templateUrl: 'app/components/navbar/navbar.html',
            scope: {},
            controller: NavbarController,
            controllerAs: 'vm',
            bindToController: true
        };

        return directive;

        /** @ngInject */
        function NavbarController($log, $location, $uibModal, registerLoginService) {
            var vm = this;
            var token;

            if (localStorage.token) {
                token = localStorage.token;
            } else {
                token = "NOT LOGGED IN";
            }
            registerLoginService.checkToken(token).then(function (result) {
                console.log(result)
                if (result.split("|")[0].trim() === "authorized") {
                    vm.username = result.split("|")[1].trim();
                } else {
                    vm.username = '';
                }
            });

            vm.isActive = function (viewLocation) {
                return viewLocation === $location.path();
            };

            vm.register = function () {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'app/components/modalWindow/modal.register.html',
                    controller: 'ModalRegister',
                    controllerAs: 'modalRegister',
                    bindToController: true,
                    size: 'md',
                    resolve: {
                        // errorMsg: function() {
                        //   return error;
                        // }
                    }
                });


                modalInstance.result.then(function (username) {
                    vm.username = username.trim();
                }, function () {
                    $log.info('Modal dismissed at: ' + new Date());
                });
            };

            vm.logout = function (){
                registerLoginService.logOutUser(token).then(function (result) {
                    localStorage.clear();
                    vm.username = '';
                });
            };

            vm.login = function (){
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'app/components/modalWindow/modal.login.html',
                    controller: 'ModalLogin',
                    controllerAs: 'modalLogin',
                    bindToController: true,
                    size: 'md',
                    resolve: {
                        // errorMsg: function() {
                        //   return error;
                        // }
                    }
                });


                modalInstance.result.then(function (username) {
                    vm.username = username.trim();
                }, function () {
                    $log.info('Modal dismissed at: ' + new Date());
                });
            };
        }
    }

})();
