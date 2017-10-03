angular.module('meuml.resources.template', [
  'gorillascode.resource'
])

.factory('SellerTemplate', ['configuration', 'ResourceFactory',
  function (configuration, ResourceFactory) {
    return new ResourceFactory(configuration.apiUrl, 'seller/template');
  }]
)

;