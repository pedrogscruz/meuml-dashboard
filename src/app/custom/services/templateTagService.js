angular.module('meuml.services.template-tag', [
  'meuml.resources.template-tag'
])

.factory('SellerTemplateTagService', ['SellerTemplateTag',
  function(SellerTemplateTag) {
    var service = {
      save: function(templateTag) {
        if (templateTag.id) {
          return SellerTemplateTag.patch(templateTag).$promise;
        } else {
          return SellerTemplateTag.save(templateTag).$promise;
        }
      },
      delete: function(id) {
        return SellerTemplateTag.delete({ id: id }).$promise;
      },
    };

    return service;
  }
])

.factory('SellerTemplateTagSearchService', ['$rootScope', '$q', 'SellerTemplateTagSearch',
  function($rootScope, $q, SellerTemplateTagSearch) {
    // Cache com as tags os templates
    var tags = {};

    $rootScope.$on('userLogout', function() {
      tags = {};
    });

    var service = {
      /**
       * Faz a pesquisa das 1.0000 tags mais usadas nos templates e armazena o resultado em cache.
       */
      search: function() {
        // Se a pesquisa já foi feita retorna o resultado em cache.
        if (tags.result) {
          return $q.resolve(tags);
        }

        var parameters = {
          results_per_page: 1000,
        };

        return SellerTemplateTagSearch.query(parameters, function(response) {
          tags = response;
        }).$promise;
      },
    };

    return service;
  }
])

;