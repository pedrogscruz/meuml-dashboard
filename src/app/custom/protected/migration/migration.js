angular.module('meuml.protected.migration', [
  'meuml.services.migration',
  'ui.router',
])

.config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider.state('protected.migration', {
      url: '/tools',
      controller: 'MigrationController as migrationCtrl',
      templateUrl: 'custom/protected/migration/migration.tpl.html',
      data: {
        pageTitle: 'Ferramentas',
      },
      resolve: {
        lastMigration: ['MigrationSearchService', function(MigrationSearchService) {
          return MigrationSearchService.getLastMigration();
        }],
      },
    });
  }
])

;
