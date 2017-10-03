angular.module('meuml.resources.account', [
  'gorillascode.resource'
])

.factory('SellerAccount', ['configuration', 'ResourceFactory',
  function (configuration, ResourceFactory) {
    return new ResourceFactory(configuration.apiUrl, 'seller/account');
  }]
)

.factory('SellerAccountAdd', ['configuration', 'ResourceFactory',
  function (configuration, ResourceFactory) {
    return new ResourceFactory(configuration.apiUrl, 'seller/account/_add');
  }]
)

;