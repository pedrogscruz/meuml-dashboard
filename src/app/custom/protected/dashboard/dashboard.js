angular.module('meuml.protected.dashboard', [
  'chart.js',
  'meuml.services.dashboard',
  'ui.router',
])

.config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider.state('protected.dashboard', {
      url: '/dashboard',
      controller: 'DashboardController as dashboardCtrl',
      templateUrl: 'custom/protected/dashboard/dashboard.tpl.html',
      data: {
        pageTitle: 'Dashboard',
      },
      resolve: {
        accounts: ['SellerAccountSearchService', function(SellerAccountSearchService) {
          var parameters = {
            q: {
              order_by: [{
                field: 'name',
                direction: 'asc',
              }],
            },
          };

          return SellerAccountSearchService.search(parameters);
        }],
      },
    });
  }
])

;
