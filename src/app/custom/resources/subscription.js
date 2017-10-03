angular.module('meuml.resources.subscription', [
  'gorillascode.resource',
])

.factory('SellerSubscription', ['configuration', 'ResourceFactory',
  function (configuration, ResourceFactory) {
    return new ResourceFactory(configuration.apiUrl, 'seller/subscription');
  }]
)

;