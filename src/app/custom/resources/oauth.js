angular.module('meuml.resources.oauth', [
  'gorillascode.resource',
])

.factory('OAuthToken', ['configuration', 'ResourceFactory',
  function (configuration, ResourceFactory) {
    return new ResourceFactory(configuration.apiUrl, '_oauth/token');
  }]
)

;