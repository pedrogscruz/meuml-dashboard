angular.module('meuml.protected.template', [
  'meuml.services.template',
  'meuml.services.template-tag',
  'ui.router',
  'ui.tinymce',
])

.config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider.state('protected.template', {
      url: '/template',
      abstract: true,
      template: '<ui-view/>',
    }).state('protected.template.list', {
      url: '?order&tag',
      controller: 'TemplateListController as templateListCtrl',
      templateUrl: 'custom/protected/template/template-list.tpl.html',
      data: {
        pageTitle: 'Templates',
      },
      params: {
        order: {
          squash: true,
          value: '-updated_at',
        },
        tag: {
          array: true,
        },
      },
    }).state('protected.template.edit', {
      url: '/:id/edit',
      controller: 'TemplateEditController as templateEditCtrl',
      templateUrl: 'custom/protected/template/template-edit.tpl.html',
      data: {
        pageTitle: 'Edição do template',
      },
      resolve: {
        template: ['$stateParams', 'SellerTemplateService',
          function($stateParams, SellerTemplateService) {
            return SellerTemplateService.get($stateParams.id);
          }
        ],
      },
    }).state('protected.template.new', {
      url: '/new',
      controller: 'TemplateEditController as templateEditCtrl',
      templateUrl: 'custom/protected/template/template-edit.tpl.html',
      data: {
        pageTitle: 'Novo template',
      },
      resolve: {
        template: [function() {
          return null;
        }],
      },
    });
  }
])

;
