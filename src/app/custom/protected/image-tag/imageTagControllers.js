angular.module('meuml.protected.image-tag')

.controller('ImageTagListController', ['$scope', '$controller', '$state', '$stateParams',
  'SellerImageTagSearchService',

  function($scope, $controller, $state, $stateParams, SellerImageTagSearchService) {
    var self = this;

    self.imageTags = {};

    $controller('PaginationController', {
      $scope: $scope,
      self: this,
      list: self.imageTags,
      searchFunction: search
    });

    /**
     * Faz a pesquisa.
     *
     * @param paginationParameters os parâmetros da paginação.
     * @returns uma promise para a pesquisa.
     */
    function search(paginationParameters) {
      return SellerImageTagSearchService.search(paginationParameters);
    }

    self.loadMore();
  }
])

;
