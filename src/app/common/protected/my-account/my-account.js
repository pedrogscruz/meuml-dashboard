angular.module('gorillascode.my-account', [
  'ui.router'
])

.config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider.state('protected.my-account', {
      url: '/my-account',
      controller: 'MyAccountController as myAccountControllerCtrl',
      templateUrl: 'common/protected/my-account/my-account.tpl.html',
      data: {
        pageTitle: 'Minha conta'
      }
    });
  }
])

;
