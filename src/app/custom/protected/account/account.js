angular.module('meuml.protected.account', [
  'meuml.services.account',
  'meuml.services.oauth',
  'ui.router',
])

.config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider.state('protected.account', {
      url: '/account',
      abstract: true,
      template: '<ui-view/>',
    }).state('protected.account.list', {
      url: '',
      controller: 'AccountListController as accountListCtrl',
      templateUrl: 'custom/protected/account/account-list.tpl.html',
      data: {
        pageTitle: 'Contas do Mercado Livre',
      },
    });
  }
])

;
