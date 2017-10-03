angular.module('meuml.protected.migration-request', [
  'meuml.services.migration',
  'ui.router',
])

.config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider.state('protected.migration-request', {
      url: '/migration/request',
      controller: 'MigrationRequestController as migrationRequestCtrl',
      templateUrl: 'custom/protected/migration-request/migration-request.tpl.html',
      data: {
        pageTitle: 'Pendências para resolver',
      },
      resolve: {
        migrations: ['MigrationSearchService', function(MigrationSearchService) {
          var parameters = {
            q: {
              filters: [{
                name: 'status',
                op: '==',
                val: 'REQUEST',
              }, {
                name: 'type',
                op: '!=',
                val: 'UPDATE_MERCADO_LIVRE_LINKS',
              }],
            },
            results_per_page: 10,
          };

          return MigrationSearchService.search(parameters);
        }],
      },
    });
  }
])

;
