angular.module('meuml.services.template', [
  'meuml.resources.template'
])

.factory('SellerTemplateService', ['SellerTemplate',
  function(SellerTemplate) {
    var service = {
      get: function(id) {
        return SellerTemplate.get({ id: id }).$promise;
      },
      save: function(template) {
        if (template.id) {
          return SellerTemplate.patch(template).$promise;
        } else {
          return SellerTemplate.save(template).$promise;
        }
      },
      delete: function(id) {
        return SellerTemplate.delete({ id: id }).$promise;
      },
    };

    return service;
  }
])

.factory('SellerTemplateSearchService', ['SellerTemplate',
  function(SellerTemplate) {
    var service = {
      search: function(parameters) {
        return SellerTemplate.query(parameters).$promise;
      }
    };

    return service;
  }
])

;