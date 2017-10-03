angular.module('meuml.resources.image-tag', [
  'gorillascode.resource'
])

.factory('SellerImageTag', ['configuration', 'ResourceFactory',
  function (configuration, ResourceFactory) {
    return new ResourceFactory(configuration.apiUrl, 'seller/image_tag');
  }]
)

.factory('SellerImageTagSearch', ['configuration', 'ResourceFactory',
  function (configuration, ResourceFactory) {
    return new ResourceFactory(configuration.apiUrl, 'seller/image_tag/_search');
  }]
)

;