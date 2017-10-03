angular.module('gorillascode.public', [
  'gorillascode.error',
  'gorillascode.info',
  'gorillascode.login',
  'gorillascode.signup',
  'ui.router'
])

.config(['$stateProvider',
  function($stateProvider) {
    $stateProvider.state('public', {
      abstract: true,
      url: '',
      templateUrl: 'common/public/public.tpl.html'
    });
  }
])

;
