angular.module('gorillascode.login', [
  'gorillascode.services.authentication',
  'ui.router'
])

.config(['$stateProvider',
  function($stateProvider) {
    $stateProvider.state('public.login', {
      url: '/login?continue&oauth',
      controller: 'LoginController as loginCtrl',
      templateUrl: 'common/public/login/login.tpl.html',
      data: {
        pageTitle: 'Acesso'
      }
    }).state('public.password-change', {
      url: '/password/reset?token',
      controller: 'PasswordResetController as passwordResetCtrl',
      templateUrl: 'common/public/login/password-reset.tpl.html',
      data: {
        pageTitle: 'Recuperação de senha'
      }
    });
  }
])

;

