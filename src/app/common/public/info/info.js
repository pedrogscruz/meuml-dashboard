angular.module('gorillascode.info', [])

.config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider.state('public.info', {
      url: '/info',
      templateUrl: 'common/public/info/info.tpl.html',
      data: {
        pageTitle: 'Informações'
      }
    });
  }
])

;
