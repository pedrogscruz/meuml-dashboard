angular.module('meuml.protected.migration-fix-duplicated-images')

.controller('MigrationFixDuplicatedImagesController', ['NotificationService', 'MigrationService',
  'OAuthService', 'SellerAccountService',

  function(NotificationService, MigrationService, OAuthService, SellerAccountService) {

    var self = this;

    // Indica se a correção foi iniciada
    self.fixStarted = false;

    self.fix = function() {
      self.fixStarted = true;

      OAuthService.getCode(function(code) {
        SellerAccountService.add(code).then(function(account) {
          var parameters = {
            account_id: account.id,
          };

          MigrationService.fixDuplicatedImages(parameters).then(function() {
            // Correção iniciada
          }, function(error) {
            self.fixStarted = false;
            NotificationService.error('Não foi possível começar a correção. Tente novamente mais ' +
                'tarde.', error);
          });
        }, function(error) {
          self.fixStarted = false;
          NotificationService.error('Não foi possível adicionar a conta. Tente novamente mais ' +
              'tarde.', error);
        });
      });
    };
  }
])

;
