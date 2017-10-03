angular.module('meuml.protected.migration-fix-duplicated-images', [
  'meuml.services.migration',
  'ui.router',
])

.config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider.state('protected.migration-fix-duplicated-images', {
      url: '/migration/fix',
      controller: 'MigrationFixDuplicatedImagesController as migrationFixCtrl',
      templateUrl: 'custom/protected/migration/fix-duplicated-images/fix-duplicated-images.tpl.html',
      data: {
        pageTitle: 'Corretor de anúncios de imagens duplicadas',
      },
    });
  }
])

;
