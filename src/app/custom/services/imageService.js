angular.module('meuml.services.image', [
  'meuml.resources.image'
])

.factory('SellerImageService', ['$rootScope', '$q', '$mdDialog', '$state', 'SellerImage',
  'LocalUserService',

  function($rootScope, $q, $mdDialog, $state, SellerImage, LocalUserService) {
    // Estatísticas das imagens
    var stats = {
      count: 0,
    };

    $rootScope.$on('userLogout', function() {
      stats.count = 0;
    });

    var service = {
      save: function(image) {
        if (image.id) {
          return SellerImage.patch(image).$promise;
        } else {
          return SellerImage.save(image).$promise;
        }
      },
      delete: function(id) {
        return SellerImage.delete({ id: id }).$promise;
      },
      getStats: function() {
        if (stats.count) {
          return stats;
        }

        var deferred = $q.defer();

        SellerImage.query({ results_per_page: 0 }, function(response) {
          stats.count = response.limit;
          deferred.resolve(stats);
        }, function(error) {
          deferred.reject(error);
        });

        return stats;
      },
      resetStats: function() {
        stats.count = 0;

        var deferred = $q.defer();

        SellerImage.query({ results_per_page: 0 }, function(response) {
          stats.count = response.limit;
          deferred.resolve(stats);
        }, function(error) {
          deferred.reject(error);
        });

        return stats;
      },
      incrementImagesCount: function() {
        stats.count++;
      },
      decrementImagesCount: function(amount) {
        stats.count -= amount;
      },
      checkImagesCount: function(amount) {
        var user = LocalUserService.getUser();

        if (!user.subscription) {
          return false;
        }

        var currentPlan = user.subscription.plan;
        var newImagesCount = stats.count + amount;

        if (newImagesCount > currentPlan.max_images) {
          var confirm = $mdDialog.confirm()
            .title('Limite de imagens atingido')
            .htmlContent('O limite de imagens que podem ser hospedadas foi atingido.<br>Você ' +
                'pode enviar mais imagens excluindo outras imagens ou alterando para outro plano.')
            .ariaLabel('Limite de imagens atingido')
            .ok('Alterar o plano')
            .cancel('Cancelar');

          $mdDialog.show(confirm).then(function() {
            $state.go('protected.plan.list');
          });

          return false;
        }

        return true;
      },
    };

    return service;
  }
])

.factory('SellerImageSearchService', ['SellerImage',
  function(SellerImage) {
    var service = {
      search: function(parameters) {
        return SellerImage.query(parameters).$promise;
      },
    };

    return service;
  }
])

;