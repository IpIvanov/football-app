(function () {
    'use strict';

    angular
        .module('footballApp')
        .config(routerConfig);

    /** @ngInject */
    function routerConfig($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'app/main/main.html',
                controller: 'MainController',
                controllerAs: 'main'
            }).state('about', {
            url: '/about',
            templateUrl: 'app/main/main.html',
            controller: 'MainController',
            controllerAs: 'main'
        }).state('contact', {
            url: '/contact',
            templateUrl: 'app/main/main.html',
            controller: 'MainController',
            controllerAs: 'main'
        });

        $urlRouterProvider.otherwise('/');
    }

})();
