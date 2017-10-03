angular.module('meuml.protected.template')

.controller('TemplateListController', ['$log', '$scope', '$controller', '$state', '$stateParams',
  '$mdDialog', 'NotificationService', 'SellerTemplateService', 'SellerTemplateSearchService',
  'SellerTemplateTagSearchService',

  function($log, $scope, $controller, $state, $stateParams, $mdDialog, NotificationService,
           SellerTemplateService, SellerTemplateSearchService, SellerTemplateTagSearchService) {

    var self = this;

    // Número máximo de tags exibidas na lista de tags mais usadas
    var MAX_TOP_TEMPLATE_TAGS = 20;

    var templateTags = {
      result: [],
    };

    // Filtros passados como parâmetros na URL
    self.filters = {
      tag: $stateParams.tag || [],
    };

    self.order = $stateParams.order;
    self.templates = {};

    // As tags mais usadas nos templates
    self.topTemplateTags = [];

    $controller('PaginationController', {
      $scope: $scope,
      self: this,
      list: self.templates,
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

      return SellerTemplateSearchService.search(searchParameters);
    }

    /**
     * Monta os parãmetros da pesquisa a partir dos parâmetros informados na URL.
     *
     * @returns os parâmetros para fazer a pesquisa.
     */
    function createSearchParameters() {
      var searchParameters = {
        q: {
          filters: [],
          order_by: [],
        },
        results_per_page: 20,
      };

      if (self.filters.tag && self.filters.tag.length) {
        // Usa o filtro de tags para pesquisar tanto nas tags das templatens quanto no nome do arquivo

        var nameFilter = [];
        var tagsFilter = [];

        angular.forEach(self.filters.tag, function(tag) {
          nameFilter.push({
            name: 'name',
            op: 'like',
            val: '%' + tag + '%',
          });

          tagsFilter.push({
            name: 'tags',
            op: 'any',
            val: {
              name: 'tag',
              op: '==',
              val: tag,
            },
          });
        });

        // Pesquisa no nome do arquivo ou nas tags da templatem
        searchParameters.q.filters.push({
          or: [{
            and: nameFilter,
          }, {
            and: tagsFilter,
          }]
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
          direction: 'desc'
        });
      }

      return searchParameters;
    }

    function searchTags() {
      $log.debug('Listando todas as tags');

      SellerTemplateTagSearchService.search().then(function(response) {
        $log.debug('Tags listadas');

        templateTags = response;
        self.topTemplateTags = templateTags.result.slice(0, MAX_TOP_TEMPLATE_TAGS);
      }, function(error) {
        NotificationService.error('Não foi possível listar as tags', error);
      });
    }

    self.searchTemplateTag = function(searchText) {
      if (!searchText) {
        return [];
      }

      return templateTags.result.filter(function(templateTag) {
        return (templateTag.tag.indexOf(angular.lowercase(searchText)) > -1);
      }).map(function(templateTag) {
        return templateTag.tag;
      });
    };

    /**
     * Adiciona a tag junto das tags atuais do filtro de pesquisa e sem seguida faz uma nova
     * pesquisa.
     *
     * @param tag a tag que será adicionada no filtro.
     */
    self.appendTagToFilters = function(tag) {
      if (self.filters.tag.indexOf(tag) != -1) {
        // Tag já está adicionada
        return;
      }

      self.filters.tag.push(tag);
      self.changeFilters();
    };

    /**
     * Altera os parâmetros da URL usando os valores informados nos filtros.
     */
    self.changeFilters = function() {
      $state.go('.', {
        tag: self.filters.tag,
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

    searchTags();

    self.loadMore();
  }
])

.controller('TemplateEditController', ['$log', '$mdDialog', '$state', 'NotificationService',
  'SellerTemplateService', 'SellerTemplateTagSearchService', 'ImagePicker', 'template',

  function($log, $mdDialog, $state, NotificationService, SellerTemplateService,
           SellerTemplateTagSearchService, ImagePicker, template) {
    var self = this;

    // Todas as tags usadas pelo usuário nos templates
    var templateTags = [];

    self.tags = [];
    self.template = template;

    self.tinymceOptions = {
      branding: false,
      elementpath: false,
      file_picker_callback: function(callback, value, meta) {
        if (meta.filetype != 'image') {
          return;
        }

        ImagePicker.show().then(function(image) {
          var description = image.tags.map(function(imageTag) {
            return imageTag.tag;
          }).join(' ');

          callback(image.url, { alt: description });
        });
      },
      file_picker_types: 'image',
      height: 500,
      image_dimensions: false,
      language: 'pt_BR',
      language_url: '/assets/js/tinymce-language-pt_BR.js',
      menubar: 'edit insert view format table tools',
      plugins: [
        'advlist autolink save link image lists charmap preview hr anchor pagebreak searchreplace',
        'wordcount visualblocks visualchars code insertdatetime media nonbreaking table',
        'contextmenu directionality emoticons template paste textcolor',
      ],
      statusbar: false,
      toolbar1: 'undo redo | bold italic strikethrough underline | fontsizeselect | forecolor ' +
        'backcolor | alignleft aligncenter alignright alignjustify | bullist numlist ' +
        'outdent indent',
      toolbar2: 'image | link | table | code',
    };

    if (self.template) {
      self.tags = self.template.tags.map(function(templateTag) {
        return templateTag.tag;
      });
    }

    function searchTags() {
      $log.debug('Listando todas as tags');

      SellerTemplateTagSearchService.search().then(function(response) {
        $log.debug('Tags listadas');
        templateTags = response;
      }, function(error) {
        NotificationService.error('Não foi possível listar as tags', error);
      });
    }

    self.save = function() {
      var tagsToSave = null;

      // Template existente está sendo editado
      if (self.template.id) {
        tagsToSave = {
          add: [],
          remove: [],
        };

        // Busca as tags que foram adicionadas
        angular.forEach(self.tags, function(tag) {
          var tagExists = self.template.tags.some(function(templateTag) {
            return templateTag.tag == tag;
          });

          if (!tagExists) {
            tagsToSave.add.push({
              tag: tag,
            });
          }
        });

        angular.forEach(self.template.tags, function(templateTag) {
          var tagExists = self.tags.some(function(tag) {
            return templateTag.tag == tag;
          });

          if (!tagExists) {
            tagsToSave.remove.push({
              id: templateTag.id,
            });
          }
        });
      } else {
        // Novo template está sendo criado
        tagsToSave = self.tags.map(function(templateTag) {
          return { tag: templateTag };
        });
      }

      var templateToSave = {
        html_text: self.template.html_text,
        id: self.template.id,
        name: self.template.name,
        tags: tagsToSave,
      };

      SellerTemplateService.save(templateToSave).then(function(response) {
        NotificationService.success('Template salvo');

        angular.extend(self.template, response);

        // Altera a URL para usar a URL de edição do template
        $state.transitionTo('protected.template.edit', {
          id: self.template.id,
        }, {
          location:'replace',
          notify: false,
        });
      }, function(error) {
        NotificationService.error('Não foi possível salvar o template', error);
      });
    };

    self.delete = function(ev) {
      var prompt = $mdDialog.confirm()
        .title('Excluir o template?')
        .ariaLabel('Excluir o template?')
        .textContent('Não é possível desfazer a exclusão')
        .targetEvent(ev)
        .ok('Excluir')
        .cancel('Cancelar');

      $mdDialog.show(prompt).then(function() {
        SellerTemplateService.delete(self.template.id).then(function() {
          NotificationService.success('Template excluído');
          $state.go('protected.template.list');
        }, function(error) {
          NotificationService.error('Não foi possível excluída o template', error);
        });
      });
    };

    self.searchTemplateTag = function(searchText) {
      if (!searchText) {
        return [];
      }

      return templateTags.result.filter(function(templateTag) {
        return (templateTag.tag.indexOf(angular.lowercase(searchText)) > -1);
      }).map(function(templateTag) {
        return templateTag.tag;
      });
    };

    searchTags();
  }
])

;
