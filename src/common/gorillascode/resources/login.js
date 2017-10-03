angular.module('gorillascode.resources.login', [
  'gorillascode.resource'
])

.factory('Login', ['configuration', 'ResourceFactory',
  function (configuration, ResourceFactory) {
    return new ResourceFactory(configuration.apiUrl, 'user/_login');
  }]
)

.factory('LoginOAuth', ['configuration', 'ResourceFactory',
  function (configuration, ResourceFactory) {
    return new ResourceFactory(configuration.apiUrl, 'user/_oauth');
  }]
)

.factory('PasswordReset', ['configuration', 'ResourceFactory',
  function (configuration, ResourceFactory) {
    return new ResourceFactory(configuration.apiUrl, 'reset', ':token', { token: '@token' });
  }]
)

.factory('PasswordChange', ['configuration', 'ResourceFactory',
  function (configuration, ResourceFactory) {
    return new ResourceFactory(configuration.apiUrl, 'user/_change');
  }]
)

;