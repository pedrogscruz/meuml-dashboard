angular.module('meuml.resources.template-tag', [
  'gorillascode.resource'
])

.factory('SellerTemplateTag', ['configuration', 'ResourceFactory',
  function (configuration, ResourceFactory) {
    return new ResourceFactory(configuration.apiUrl, 'seller/template_tag');
  }]
)

.factory('SellerTemplateTagSearch', ['configuration', 'ResourceFactory',
  function (configuration, ResourceFactory) {
    return new ResourceFactory(configuration.apiUrl, 'seller/template_tag/_search');
  }]
)

;