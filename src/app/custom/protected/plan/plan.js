angular.module('meuml.protected.plan', [
  'meuml.services.plan',
  'meuml.services.subscription',
  'ui.router',
])

.config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider.state('protected.plan', {
      url: '/my-account/plan',
      abstract: true,
      template: '<ui-view/>',
    }).state('protected.plan.list', {
      url: '',
      controller: 'PlanListController as planListCtrl',
      templateUrl: 'custom/protected/plan/plan-list.tpl.html',
      data: {
        pageTitle: 'Planos',
      },
      resolve: {
        plans: ['SellerPlanSearchService', function(SellerPlanSearchService) {
          var parameters = {
            q: {
              filters: [{
                name: 'published',
                op: '==',
                val: true,
              }],
              order_by: [{
                field: 'price',
                direction: 'asc',
              }],
            },
          };

          return SellerPlanSearchService.search(parameters);
        }],
      },
    });
  }
])

;
