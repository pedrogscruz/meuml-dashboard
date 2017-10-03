angular.module('meuml.resources.file', [
  'gorillascode.resource'
])

.factory('SellerFile', ['configuration', 'ResourceFactory',
  function (configuration, ResourceFactory) {
    return new ResourceFactory(configuration.apiUrl, 'seller/file');
  }]
)


;
