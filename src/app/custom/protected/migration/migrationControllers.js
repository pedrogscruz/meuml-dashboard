angular.module('meuml.protected.migration')

.controller('MigrationController', ['$scope', '$interval', '$state', 'NotificationService',
  'MigrationService', 'MigrationSearchService', 'SellerImageService', 'OAuthService',
  'SellerAccountService', 'lastMigration',

  function($scope, $interval, $state, NotificationService, MigrationService, MigrationSearchService,
           SellerImageService, OAuthService, SellerAccountService, lastMigration) {

    var self = this;

    // Timer para verificar o status da última migração
    var lastMigrationTimer = null;

    // Intervalo de verificação do status da última migração (em milisegundos)
    var REFRESH_LAST_MIGRATION_INTERVAL = 60000;

    self.lastMigration = lastMigration;
    self.providers = [
      'photobucket',
    ];

    self.start = function(type) {
      OAuthService.getCode(function(code) {
        SellerAccountService.add(code).then(function(account) {
          var migration = {
            data: {
              account_id: account.id,
              providers: self.providers,
            },
            type: type,
          };

          MigrationService.save(migration).then(function() {
            $state.go('.', {}, { reload: true });
          }, function(error) {
            NotificationService.error('Não foi possível começar a correção. Tente novamente mais ' +
                'tarde.', error);
            $state.go('.', {}, { reload: true });
          });
        }, function(error) {
          NotificationService.error('Não foi possível adicionar a conta. Tente novamente mais ' +
              'tarde.', error);
        });
      });
    };

    self.refreshLastMigration = function() {
      MigrationSearchService.getLastMigration().then(function(lastMigration) {
        var migratedChanged = false;

        if (lastMigration) {
          migratedChanged = self.lastMigration.migrated != lastMigration.migrated;
          self.lastMigration = lastMigration;
        } else {
          self.lastMigration = null;
          return;
        }

        if (self.lastMigration.status == 'ERROR') {
          stopMigrationTimer();
        }

        if (migratedChanged) {
          SellerImageService.resetStats();
        }
      }, function(error) {
        stopMigrationTimer();
        NotificationService.error('Não foi possível atualizar o status da correção. Tente ' +
            'novamente mais tarde', error);
      });
    };

    self.restart = function() {
      OAuthService.getCode(function(code) {
        SellerAccountService.add(code).then(function(account) {
          var migration = {
            data: {
              account_id: account.id,
            },
            id: self.lastMigration.id,
          };

          MigrationService.restart(migration).then(function() {
            $state.go('.', {}, { reload: true });
          }, function(error) {
            NotificationService.error('Não foi possível começar a correção. Tente novamente mais ' +
                'tarde.', error);
            $state.go('.', {}, { reload: true });
          });
        }, function(error) {
          NotificationService.error('Não foi possível adicionar a conta. Tente novamente mais ' +
              'tarde.', error);
        });
      });
    };

    if (self.lastMigration && self.lastMigration.status != 'ERROR') {
      lastMigrationTimer = $interval(self.refreshLastMigration, REFRESH_LAST_MIGRATION_INTERVAL);
    }

    function stopMigrationTimer() {
      if (lastMigrationTimer) {
        $interval.cancel(lastMigrationTimer);
        lastMigrationTimer = null;
      }
    }

    $scope.$on('$destroy', function() {
      stopMigrationTimer();
    });
  }
])

;
