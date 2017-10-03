angular.module('meuml.resources.dashboard', [
  'gorillascode.resource'
])

.factory('SellerDashboard', ['configuration', 'ResourceFactory',
  function (configuration, ResourceFactory) {
    return new ResourceFactory(configuration.apiUrl, 'seller/dashboard');
  }]
)

.factory('SellerDashboardRefresh', ['configuration', 'ResourceFactory',
  function (configuration, ResourceFactory) {
    return new ResourceFactory(configuration.apiUrl, 'seller/dashboard/_refresh');
  }]
)

;