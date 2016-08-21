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
        function NavbarController($location) {
            var vm = this;

            vm.isActive = function (viewLocation) {
                return viewLocation === $location.path();
            };
        }
    }

})();
