angular.module('meuml.protected.product-category')

.controller('ProductCategoryController', ['$scope', '$controller', '$state', '$stateParams',
  'ProductCategorySearchService',

  function($scope, $controller, $state, $stateParams, ProductCategorySearchService) {
    var self = this;

    // Filtros passados como parâmetros na URL
    self.filters = {
      query: $stateParams.q,
    };

    self.productCategories = {};
    self.order = $stateParams.order;

    $controller('PaginationController', {
      $scope: $scope,
      self: this,
      list: self.productCategories,
      searchFunction: search
    });

    /**
     * Faz a pesquisa.
     *
     * @param paginationParameters os parâmetros da paginação.
     * @returns uma promise para a pesquisa.
     */
    function search(paginationParameters) {
      var searchParameters = createSearchParameters();
      angular.extend(searchParameters, paginationParameters);

      return ProductCategorySearchService.search(searchParameters);
    }

    /**
     * Monta os parãmetros da pesquisa a partir dos parâmetros informados na URL.
     *
     * @returns os parâmetros para fazer a pesquisa.
     */
    function createSearchParameters() {
      var searchParameters = {
        q: {
          filters: [{
            name: 'weight',
            op: 'is_not_null',
          }, {
            name: 'width',
            op: 'is_not_null',
          }, {
            name: 'height',
            op: 'is_not_null',
          }, {
            name: 'length',
            op: 'is_not_null',
          }],
          order_by: [],
        },
        results_per_page: 50,
      };

      if (self.filters.query) {
        searchParameters.q.filters.push({
          or: [{
            name: 'description',
            op: 'like',
            val: '%' + self.filters.query + '%',
          }, {
            name: 'marketplace_code',
            op: 'like',
            val: '%' + self.filters.query + '%',
          }],
        });
      }

      if ($stateParams.order) {
        var fieldName = self.order.replace('-', '');
        var fieldDirection = (self.order[0] == '-') ? 'desc' : 'asc';

        searchParameters.q.order_by.push({
          field: fieldName,
          direction: fieldDirection
        });

        // Como vários objetos são criados ao mesmo tempo (com o mesmo "created_at") é necessário um
        // segundo campo para fazer a ordenação correta
        searchParameters.q.order_by.push({
          field: 'id',
          direction: 'asc'
        });
      }

      return searchParameters;
    }

    /**
     * Altera os parâmetros da URL usando os valores informados nos filtros.
     */
    self.changeFilters = function() {
      $state.go('.', {
        q: self.filters.query,
      });
    };

    /**
     * Altera o parâmetro de ordenação da URL.
     *
     * @param order o parãmetro usado para ordenação.
     */
    self.changeOrder = function(order) {
      $state.go('.', { order: order });
    };

    self.loadMore();
  }
])

;
