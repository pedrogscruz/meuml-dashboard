angular.module('gorillascode.change-password', [
  'ui.router'
])

.config(['$stateProvider',
  function($stateProvider) {
    $stateProvider.state('protected.change-password', {
      url: '/change-password',
      controller: 'ChangePasswordController as changePasswordCtrl',
      templateUrl: 'common/protected/change-password/change-password.tpl.html',
      data: {
        pageTitle: 'Alterar senha'
      }
    });
  }
])

;

