angular.module('meuml.protected.product-category', [
  'meuml.services.product-category',
  'ui.router',
])

.config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider.state('protected.product-category', {
      url: '/category',
      abstract: true,
      template: '<ui-view/>'
    }).state('protected.product-category.list', {
      url: '?order&q',
      controller: 'ProductCategoryController as productCategoryCtrl',
      templateUrl: 'custom/protected/product-category/product-category-list.tpl.html',
      data: {
        pageTitle: 'Categorias'
      },
      params: {
        order: {
          squash: true,
          value: 'description',
        },
      },
    });
  }
])

;
