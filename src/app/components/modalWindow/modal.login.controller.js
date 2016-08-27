(function () {
    'use strict';

    angular
        .module('football')
        .controller('ModalLogin', ModalLogin);

    /** @ngInject */
    function ModalLogin($uibModalInstance, registerLoginService, toastr, toastrConfig) {
        var modalLogin = this;

        toastrConfig.positionClass = 'toast-top-right';
        modalLogin.showLoadingBar = false;

        modalLogin.loginInfo = {
            username: undefined,
            password: undefined
        }


        modalLogin.ok = function (registerForm, error) {
            modalLogin.showLoadingBar = true;
            if (registerForm.$valid) {
                modalLogin.loginInfo = {
                    username: modalLogin.name,
                    password: modalLogin.password
                }
                console.log(modalLogin.loginInfo);
                registerLoginService.logInUser(modalLogin.loginInfo).then(function (result) {
                    modalLogin.showLoadingBar = false;
                    if(result === 'ERROR'){
                        toastr.error('Wrong username or password.');
                    }
                    else{
                        localStorage.setItem("token", result);
                        $uibModalInstance.close(result.split("|")[0]);
                        toastrConfig.positionClass = "toast-bottom-right";
                        toastr.success('Welcome back ' + result.split("|")[0]  + '!');
                    }
                });


            }
            if (error) {
                modalLogin.showLoadingBar = false;
                toastr.warning('Please fill all required fields.', 'Warning!');
            }
        };

        modalLogin.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }

})();
