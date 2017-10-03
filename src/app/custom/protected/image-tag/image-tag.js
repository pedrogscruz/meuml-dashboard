angular.module('meuml.protected.image-tag', [
  'meuml.services.image-tag',
  'ui.router',
])

.config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider.state('protected.image-tag', {
      url: '/image/tag',
      abstract: true,
      template: '<ui-view/>'
    }).state('protected.image-tag.list', {
      url: '?order&tag',
      controller: 'ImageTagListController as imageTagListCtrl',
      templateUrl: 'custom/protected/image-tag/image-tag-list.tpl.html',
      data: {
        pageTitle: 'Tags das imagens'
      },
    });
  }
])

;
