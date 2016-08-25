(function () {
    'use strict';

    angular
        .module('football')
        .config(routerConfig);

    /** @ngInject */
    function routerConfig($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'app/main/main.html',
                controller: 'MainController',
                controllerAs: 'main'
            })
            .state('predictions', {
                url: '/predictions',
                templateUrl: 'app/predictions/predictions.html',
                controller: 'PredictionsController',
                controllerAs: 'predictions'
            })
            .state('login', {
                url: '/login',
                templateUrl: 'app/login/login.html',
                controller: 'LoginController',
                controllerAs: 'login'
            });

        $urlRouterProvider.otherwise('/');
    }

})();
