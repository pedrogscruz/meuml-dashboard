angular.module('meuml.services.product-category', [
  'meuml.resources.product-category'
])

.factory('ProductCategorySearchService', ['ProductCategory',
  function(ProductCategory) {
    var service = {
      search: function(parameters) {
        return ProductCategory.query(parameters).$promise;
      }
    };

    return service;
  }
])

;