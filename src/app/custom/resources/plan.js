angular.module('meuml.resources.plan', [
  'gorillascode.resource',
])

.factory('SellerPlan', ['configuration', 'ResourceFactory',
  function (configuration, ResourceFactory) {
    return new ResourceFactory(configuration.apiUrl, 'seller/plan');
  }]
)

.factory('SellerPlanSubscribe', ['configuration', 'ResourceFactory',
  function (configuration, ResourceFactory) {
    return new ResourceFactory(configuration.apiUrl, 'seller/plan/_subscribe');
  }]
)

;