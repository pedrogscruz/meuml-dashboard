angular.module('meuml.services.migration', [
  'meuml.resources.migration'
])

.factory('MigrationService', ['Migration', 'MigrationRestart', 'MigrationFixDuplicatedImages',
  'MigrationProcessRequest',

  function(Migration, MigrationRestart, MigrationFixDuplicatedImages, MigrationProcessRequest) {
    var service = {
      save: function(migration) {
        if (migration.id) {
          return Migration.patch(migration).$promise;
        } else {
          return Migration.save(migration).$promise;
        }
      },
      fixDuplicatedImages: function(parameters) {
        return MigrationFixDuplicatedImages.save(parameters).$promise;
      },
      processRequest: function(parameters) {
        return MigrationProcessRequest.save(parameters).$promise;
      },
      restart: function(migration) {
        return MigrationRestart.save(migration).$promise;
      },
    };

    return service;
  }
])

.factory('MigrationSearchService', ['Migration',
  function(Migration) {
    var service = {
      search: function(parameters) {
        return Migration.query(parameters).$promise;
      },
      getLastMigration: function() {
        var parameters = {
          q: {
            filters: [{
              name: 'type',
              op: '==',
              val: 'UPDATE_MERCADO_LIVRE_LINKS',
            }],
            order_by: [{
              field: 'created_at',
              direction: 'desc',
            }],
          },
          results_per_page: 1,
        };

        return Migration.query(parameters).$promise.then(function(response) {
          return response.result.length ? response.result[0] : null;
        });
      },
      getRequestCount: function() {
        var parameters = {
          q: {
            filters: [{
              name: 'status',
              op: 'in',
              val: ['REQUEST'],
            }, {
              name: 'type',
              op: '!=',
              val: 'UPDATE_MERCADO_LIVRE_LINKS',
            }],
          },
          results_per_page: 1,
        };

        return Migration.query(parameters).$promise.then(function(response) {
          return response.result.length;
        });
      },
    };

    return service;
  }
])

;