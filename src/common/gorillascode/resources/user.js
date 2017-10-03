angular.module('gorillascode.resources.users', [
  'gorillascode.resource'
])

.factory('Users', ['configuration', 'ResourceFactory',
  function (configuration, ResourceFactory) {
    return new ResourceFactory(configuration.apiUrl, 'user');
  }]
)

.factory('RegisterUser', ['configuration', 'ResourceFactory',
  function (configuration, ResourceFactory) {
    return new ResourceFactory(configuration.apiUrl, 'register');
  }]
)

.factory('UserLogged', ['configuration', 'ResourceFactory',
  function (configuration, ResourceFactory) {
    return new ResourceFactory(configuration.apiUrl, 'user', 'me');
  }]
)

;