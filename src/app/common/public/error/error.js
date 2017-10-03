angular.module('gorillascode.error', [
  'ui.router'
])

.config(['$stateProvider',
  function($stateProvider) {
    $stateProvider.state('public.error', {
      abstract: true,
      url: '/error',
      templateUrl: 'common/public/error/error.tpl.html',
    }).state('public.error.404', {
      url: '/404',
      templateUrl: 'common/public/error/404.tpl.html',
      data: {
        pageTitle: 'Página não encontrada'
      },
    }).state('public.error.500', {
      url: '/500',
      templateUrl: 'common/public/error/500.tpl.html',
      data: {
        pageTitle: 'Erro'
      },
    });
  }
])

;
