angular.module('gorillascode.change-password')

.controller('ChangePasswordController', ['$state', 'NotificationService', 'AuthenticationService',
  function($state, NotificationService, AuthenticationService) {
    var self = this;

    self.password = null;
    self.newPassword = null;
    self.newPasswordConfirm = null;

    self.changePassword = function() {
      AuthenticationService.changePassword(self.password, self.newPassword, self.newPasswordConfirm)
          .then(function(response) {
            if (!response.response.errors) {
              NotificationService.success('Senha alterada');
              $state.go('protected.my-account');
            }
         });
    };
  }
])

;
