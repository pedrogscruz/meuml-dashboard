angular.module('meuml.services.dashboard', [
  'meuml.resources.dashboard'
])

.factory('SellerDashboardService', ['SellerDashboard', 'SellerDashboardRefresh',
  function(SellerDashboard, SellerDashboardRefresh) {
    var service = {
      get: function(id) {
        return SellerDashboard.get({ id: id }).$promise;
      },
      refresh: function(parameters) {
        return SellerDashboardRefresh.save(parameters).$promise;
      },
    };

    return service;
  }
])

.factory('SellerDashboardSearchService', ['SellerDashboard',
  function(SellerDashboard) {
    var service = {
      search: function(parameters) {
        return SellerDashboard.query(parameters).$promise;
      }
    };

    return service;
  }
])

;