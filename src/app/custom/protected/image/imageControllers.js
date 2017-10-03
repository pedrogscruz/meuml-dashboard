angular.module('meuml.protected.image')

.controller('ImageListController', ['$log', '$q', '$scope', '$controller', '$state', '$stateParams',
  '$mdDialog', '$mdMedia', 'Upload', 'NotificationService', 'SellerFileService', 'UploadService',
  'SellerImageService', 'SellerImageTagService', 'SellerImageTagSearchService',
  'SellerImageSearchService', 'ImageViewer',

  function($log, $q, $scope, $controller, $state, $stateParams, $mdDialog, $mdMedia, Upload,
           NotificationService, SellerFileService, UploadService, SellerImageService,
           SellerImageTagService, SellerImageTagSearchService, SellerImageSearchService,
           ImageViewer) {

    var self = this;

    // Largura máxima das imagens
    var IMAGE_MAX_WIDTH = 900;

    // Número máximo de tags exibidas na lista de tags mais usadas
    var MAX_TOP_IMAGE_TAGS = 20;

    var imageTags = {
      result: [],
    };

    // Filtros passados como parâmetros na URL
    self.filters = {
      tag: $stateParams.tag || [],
    };

    self.selectedFiles = [];
    self.selectedFilesTags = [];
    self.images = {};
    self.order = $stateParams.order;

    // As tags mais usadas nas imagens
    self.topImageTags = [];

    $controller('PaginationController', {
      $scope: $scope,
      self: this,
      list: self.images,
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

      return SellerImageSearchService.search(searchParameters);
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
        results_per_page: 36,
      };

      if (self.filters.tag && self.filters.tag.length) {
        // Usa o filtro de tags para pesquisar tanto nas tags das imagens quanto no nome do arquivo

        var keyFilter = [];
        var tagsFilter = [];

        angular.forEach(self.filters.tag, function(tag) {
          keyFilter.push({
            name: 'key',
            op: '==',
            val: tag,
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

        // Pesquisa no nome do arquivo ou nas tags da imagem
        searchParameters.q.filters.push({
          or: [{
            and: keyFilter,
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
          direction: fieldDirection,
        });

        // Como vários objetos são criados ao mesmo tempo (com o mesmo "created_at") é necessário um
        // segundo campo para fazer a ordenação correta
        searchParameters.q.order_by.push({
          field: 'id',
          direction: 'asc',
        });
      }

      return searchParameters;
    }

    function searchTags() {
      $log.debug('Listando todas as tags');

      SellerImageTagSearchService.clear();

      SellerImageTagSearchService.search().then(function(response) {
        $log.debug('Tags listadas');

        imageTags = response;
        self.topImageTags = imageTags.result.slice(0, MAX_TOP_IMAGE_TAGS);
      }, function(error) {
        NotificationService.error('Não foi possível listar as tags', error);
      });
    }

    self.searchImageTag = function(searchText) {
      if (!searchText) {
        return [];
      }

      return imageTags.result.filter(function(imageTag) {
        return (imageTag.tag.indexOf(angular.lowercase(searchText)) > -1);
      }).map(function(imageTag) {
        return imageTag.tag;
      });
    };

    self.getSelectedImages = function() {
      if (self.images.result.length === 0) {
        return [];
      }

      return self.images.result.filter(function(image) {
        return image.selected;
      });
    };

    self.deleteImages = function(images, ev) {
      if (images.length === 0) {
        return;
      }

      var title = (images.length > 1) ? 'Excluir as imagens?' : 'Excluir a imagem?';
      var confirm = $mdDialog.confirm()
        .title(title)
        .textContent('Não é possível desfazer a exclusão')
        .ariaLabel(title)
        .targetEvent(ev)
        .ok('Excluir')
        .cancel('Cancelar');

      $mdDialog.show(confirm).then(function() {
        var promises = [];

        angular.forEach(images, function(image) {
          promises.push(SellerImageService.delete(image.id));
        });

        $q.all(promises).then(function() {
          var message = (images.length > 1) ? 'Imagens excluídas' : 'Imagem excluída';
          NotificationService.success(message);

          SellerImageService.decrementImagesCount(images.length);

          $state.go('.', {}, { reload: true });
        }, function(error) {
          NotificationService.error('Não foi possível excluir as imagens. Tente novamente ' +
              'mais tarde.', error);
        });
      });
    };

    self.editTags = function(images, ev) {
      if (images.length === 0) {
        return;
      }

      $mdDialog.show({
        controller: 'TagDialogController as tagDialogCtrl',
        fullscreen: $mdMedia('xs'),
        locals: {
          images: images,
        },
        parent: angular.element(document.body),
        targetEvent: ev,
        templateUrl: 'custom/protected/image/tag-dialog.tpl.html',
      }).then(function(savedImages) {
        if (!savedImages) {
          return;
        }

        // Atualiza as tags das imagens selecionadas com as novas tags
        angular.forEach(images, function(image) {
          angular.forEach(savedImages, function(savedImage) {
            if (image.id == savedImage.id) {
              image.tags = savedImage.tags;
            }
          });
        });

        searchTags();
      });
    };

    self.selectFiles = function(files) {
      if (files.length === 0) {
        return;
      }

      if (!SellerImageService.checkImagesCount(files.length)) {
        return;
      }

      $log.debug(files.length + ' arquivo(s) selecionado(s)');

      self.selectedFiles = self.selectedFiles.concat(files);
    };

    self.removeFileFromUpload = function(index) {
      self.selectedFiles.splice(index, 1);
    };

    self.startFilesUpload = function() {
      if (self.selectedFiles.length === 0) {
        return;
      }

      var file = self.selectedFiles[0];
      self.startFileUpload(file, 0);
    };

    self.startFileUpload = function(file, index) {
      var filename = file.name || file.$ngfName;
      var resizedFile = null;
      var savedFile = null;

      $log.debug('Iniciando o processamento do arquivo ' + filename);

      // Redimensiona a imagem
      Upload.resize(file, {
        width: IMAGE_MAX_WIDTH,
        type: 'image/png',
        resizeIf: function(width) {
          return width > IMAGE_MAX_WIDTH;
        },
        restoreExif: false,
      }).then(function(response) {
        // Redimensionou a imagem então retorna as dimensões dela

        $log.debug('Arquivo ' + filename + ' redimensionado');

        resizedFile = response;
        return Upload.imageDimensions(resizedFile);
      }).then(function(dimensions) {
        // Retornou as dimensões da imagem então cria o File na API

        var fileToSave = {
          content_type: 'image/png',
          height: dimensions.height,
          original_name: filename,
          size: file.size,
          width: dimensions.width,
        };

        return SellerFileService.save({ type: 'image' }, fileToSave);
      }).then(function(response) {
        // Criou o File na API então faz o upload do arquivo

        $log.debug('File(' + response.id + ') criado para ' + filename);

        savedFile = response;
        return UploadService.upload(resizedFile, savedFile._storage);
      }).then(function() {
        var tags = self.selectedFilesTags.map(function(tag) {
          return { tag: tag };
        });

        // Fez o upload do arquivo então cria o Image na API
        var imageToSave = {
          file_id: savedFile.id,
          tags: tags,
        };

        return SellerImageService.save(imageToSave);
      }).then(function(response) {
        // Criou o Image na API
        $log.debug('Image(' + response.id + ') criado para ' + filename);

        self.selectedFiles.splice(index, 1);

        self.images.result.unshift(response);
        self.images.limit++;

        SellerImageService.incrementImagesCount();
        SellerImageTagSearchService.addTags(self.selectedFilesTags);
      }, function(error) {
        $log.error('Não foi possível enviar a imagem', error);
        file.error = 'Não foi possível enviar a imagem';
      }).finally(function() {
        // Busca o próximo arquivo para fazer o upload
        for (var i in self.selectedFiles) {
          var nextFile = self.selectedFiles[i];

          if (!nextFile.image && !nextFile.error) {
            self.startFileUpload(nextFile, i);
            return;
          }
        }

        searchTags();
      });
    };

    self.imageUrlCopied = function() {
      NotificationService.success('Link copiado');
    };

    self.imageUrlCopyError = function(error) {
      NotificationService.error('Não foi possível copiar o link', error);
    };

    self.replaceImage = function(image, file) {
      if (!file) {
        return;
      }

      var filename = file.name || file.$ngfName;
      var resizedFile = null;
      var savedFile = null;

      $log.debug('Iniciando o processamento do arquivo ' + filename);

      image.file.uploading = true;

      // Redimensiona a imagem
      Upload.resize(file, {
        width: IMAGE_MAX_WIDTH,
        type: 'image/png',
        resizeIf: function(width) {
          return width > IMAGE_MAX_WIDTH;
        },
        restoreExif: false,
      }).then(function(response) {
        // Redimensionou a imagem então retorna as dimensões dela

        $log.debug('Arquivo ' + filename + ' redimensionado');

        resizedFile = response;
        return Upload.imageDimensions(resizedFile);
      }).then(function(dimensions) {
        // Retornou as dimensões da imagem então cria o File na API

        var fileToSave = {
          content_type: 'image/png',
          height: dimensions.height,
          original_name: filename,
          size: file.size,
          width: dimensions.width,
        };

        return SellerFileService.save({ type: 'image' }, fileToSave);
      }).then(function(response) {
        // Criou o File na API então faz o upload do arquivo

        $log.debug('File(' + response.id + ') criado para ' + filename);

        savedFile = response;
        return UploadService.upload(resizedFile, savedFile._storage);
      }).then(function() {
        // Fez o upload do arquivo então atualiza o arquivo da imagem
        var imageToSave = {
          file_id: savedFile.id,
          id: image.id,
        };

        return SellerImageService.save(imageToSave);
      }).then(function(response) {
        // Atualizou o Image na API
        $log.debug('Image(' + response.id + ') atualizado para ' + filename);

        NotificationService.success('Imagem atualizada');
        angular.extend(image, response);
      }, function(error) {
        NotificationService.error('Não foi possível enviar a imagem. Tente novamente mais ' +
            'tarde.', error);
      }).finally(function() {
        image.file.uploading = false;
      });
    };

    /**
     * Desseleciona todas as imagens.
     */
    self.deselectImages = function() {
      angular.forEach(self.images.result, function(image) {
        image.selected = false;
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

    self.viewImage = function(index, ev) {
      ImageViewer.show(self.images.result, index, ev);
      ev.preventDefault();
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

    self.loadMore();

    searchTags();
  }
])

.controller('TagDialogController', ['$log', '$q', '$filter', '$mdDialog', 'NotificationService',
  'SellerImageService', 'SellerImageTagSearchService', 'images',

  function($log, $q, $filter, $mdDialog, NotificationService, SellerImageService,
           SellerImageTagSearchService, images) {

    var self = this;

    var imageTags = {
      result: [],
    };

    self.tags = [];

    if (images.length === 1) {
      // Está sendo editado as tags de uma imagem apenas
      var tags = $filter('orderBy')(images[0].tags, '-created_at');

      self.tags = tags.map(function(imageTag) {
        return imageTag.tag;
      });
    }

    function searchTags() {
      $log.debug('Listando todas as tags');

      SellerImageTagSearchService.search().then(function(response) {
        $log.debug('Tags listadas');
        imageTags = response;
      }, function(error) {
        NotificationService.error('Não foi possível listar as tags', error);
      });
    }

    self.searchImageTag = function(searchText) {
      if (!searchText) {
        return [];
      }

      return imageTags.result.filter(function(imageTag) {
        return (imageTag.tag.indexOf(angular.lowercase(searchText)) > -1);
      }).map(function(imageTag) {
        return imageTag.tag;
      });
    };

    self.cancel = function() {
      $mdDialog.cancel();
    };

    self.save = function() {
      var promises = [];

      // Para cada imagem verifica as tags que foram adicionadas ou removidas
      angular.forEach(images, function(image) {
        var newTags = [];
        var removedTags = [];

        // Busca as tags que foram adicionadas
        angular.forEach(self.tags, function(tag) {
          var tagExists = image.tags.some(function(imageTag) {
            return imageTag.tag == tag;
          });

          if (!tagExists) {
            newTags.push({
              tag: tag,
            });
          }
        });

        // Se estão sendo editadas as tags de apenas uma imagem então busca as tags que foram
        // removidas
        if (images.length === 1) {
          angular.forEach(image.tags, function (imageTag) {
            var tagExists = self.tags.some(function(tag) {
              return imageTag.tag == tag;
            });

            if (!tagExists) {
              removedTags.push({
                id: imageTag.id,
              });
            }
          });
        }

        if (newTags.length === 0 && removedTags.length === 0) {
          return;
        }

        var imageToSave = {
          id: image.id,
          tags: {
            add: newTags,
            remove: removedTags,
          },
        };

        promises.push(SellerImageService.save(imageToSave));
      });

      // Se todas as imagens foram atualizadas então fecha a modal e atualiza as informações na tela
      $q.all(promises).then(function(response) {
        NotificationService.success('Tags atualizadas');
        SellerImageTagSearchService.addTags(self.tags);

        $mdDialog.hide(response);
      }, function(error) {
        NotificationService.error('Não foi possível atualizar as tags. Tente novamente mais ' +
            'tarde.', error);
      });
    };

    searchTags();
  }
])

;
