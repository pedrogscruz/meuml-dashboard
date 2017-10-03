angular.module('meuml.resources.product-category', [
  'gorillascode.resource'
])

.factory('ProductCategory', ['configuration', 'ResourceFactory',
  function (configuration, ResourceFactory) {
    return new ResourceFactory(configuration.apiUrl, 'seller/product_category');
  }]
)

;