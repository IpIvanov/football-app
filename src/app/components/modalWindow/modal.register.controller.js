(function () {
    'use strict';

    angular
        .module('football')
        .controller('ModalRegister', ModalRegister);

    /** @ngInject */
    function ModalRegister($uibModalInstance, toastr, toastrConfig, registerLoginService) {
        var modalRegister = this;

        toastrConfig.positionClass = 'toast-top-right';
        modalRegister.showLoadingBar = false;

        modalRegister.registerInfo = {
            username: undefined,
            email: undefined,
            password: undefined
        }


        modalRegister.ok = function (registerForm, error, validEmail) {
            modalRegister.showLoadingBar = true;
            if (registerForm.$valid) {
                modalRegister.registerInfo = {
                    username: modalRegister.name,
                    email: modalRegister.email,
                    password: modalRegister.password
                }
                console.log(modalRegister.registerInfo);
                registerLoginService.registerUser(modalRegister.registerInfo).then(function (result) {
                    modalRegister.showLoadingBar = false;
                    if(result === 'This user name already exists.'){
                        toastr.error('This user name already exists.');
                    }
                    else{
                        localStorage.setItem("token", result);
                        $uibModalInstance.close(result.split("|")[0]);
                        toastrConfig.positionClass = "toast-bottom-right";
                        toastr.success('Registration was Successful, welcome ' + result.split("|")[0]  + '!');
                    }
                });


            }
            if (error) {
                modalRegister.showLoadingBar = false;
                toastr.warning('Please fill all required fields.', 'Warning!');
            }
            if (modalRegister.password !== modalRegister.confirmPassword) {
                modalRegister.showLoadingBar = false;
                toastr.warning('Please confirm your password.', 'Warning!');
            }
            if (validEmail) {
                modalRegister.showLoadingBar = false;
                toastr.warning('Please fill valid email.', 'Warning!');
            }
        };

        modalRegister.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }

})();
