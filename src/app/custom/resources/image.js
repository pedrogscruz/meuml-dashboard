angular.module('meuml.resources.image', [
  'gorillascode.resource'
])

.factory('SellerImage', ['configuration', 'ResourceFactory',
  function (configuration, ResourceFactory) {
    return new ResourceFactory(configuration.apiUrl, 'seller/image');
  }]
)

;