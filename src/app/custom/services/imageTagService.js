angular.module('meuml.services.image-tag', [
  'meuml.resources.image-tag'
])

.factory('SellerImageTagService', ['SellerImageTag',
  function(SellerImageTag) {
    var service = {
      save: function(imageTag) {
        if (imageTag.id) {
          return SellerImageTag.patch(imageTag).$promise;
        } else {
          return SellerImageTag.save(imageTag).$promise;
        }
      },
      delete: function(id) {
        return SellerImageTag.delete({ id: id }).$promise;
      },
    };

    return service;
  }
])

.factory('SellerImageTagSearchService', ['$rootScope', '$q', 'SellerImageTagSearch',
  function($rootScope, $q, SellerImageTagSearch) {
    // Cache com as tags das imagens
    var tags = {};

    $rootScope.$on('userLogout', function() {
      service.clear();
    });

    var service = {
      clear: function() {
        tags = {};
      },
      /**
       * Faz a pesquisa das 1.0000 tags mais usadas nas imagens e armazena o resultado em cache.
       */
      search: function() {
        // Se a pesquisa já foi feita retorna o resultado em cache.
        if (tags.result) {
          return $q.resolve(tags);
        }

        var parameters = {
          results_per_page: 1000,
        };

        return SellerImageTagSearch.query(parameters, function(response) {
          tags = response;
        }).$promise;
      },
      addTags: function(newTags) {
        angular.forEach(newTags, function(newTag) {
          var tagExists = tags.result.some(function(imageTag) {
            return imageTag.tag == newTag;
          });

          if (!tagExists) {
            tags.result.push({
              tag: newTag,
            });
          }
        });
      },
    };

    return service;
  }
])

;