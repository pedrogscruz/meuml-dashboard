angular.module('meuml.resources.migration', [
  'gorillascode.resource',
])

.factory('Migration', ['configuration', 'ResourceFactory',
  function (configuration, ResourceFactory) {
    return new ResourceFactory(configuration.apiUrl, 'seller/migration');
  }]
)

.factory('MigrationFixDuplicatedImages', ['configuration', 'ResourceFactory',
  function (configuration, ResourceFactory) {
    return new ResourceFactory(configuration.apiUrl, 'seller/migration/_fix_duplicated_images');
  }]
)

.factory('MigrationProcessRequest', ['configuration', 'ResourceFactory',
  function (configuration, ResourceFactory) {
    return new ResourceFactory(configuration.apiUrl, 'seller/migration/_process_request');
  }]
)

.factory('MigrationRestart', ['configuration', 'ResourceFactory',
  function (configuration, ResourceFactory) {
    return new ResourceFactory(configuration.apiUrl, 'seller/migration/_restart');
  }]
)

;