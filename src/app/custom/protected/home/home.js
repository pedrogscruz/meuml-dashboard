angular.module('meuml.protected.home', [
  'ui.router'
])

.config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider.state('protected.home', {
      url: '/',
      templateUrl: 'custom/protected/home/home.tpl.html',
      data: {
        pageTitle: 'MeuML.com'
      }
    });
  }
])

;

