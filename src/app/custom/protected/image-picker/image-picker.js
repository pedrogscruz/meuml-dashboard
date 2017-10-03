angular.module('meuml.components.image-picker', [])

.factory('ImagePicker', ['$mdDialog',
  function($mdDialog) {
    var service = {
      show: function() {
        return $mdDialog.show({
          controller: 'ImagePickerController as imagePickerCtrl',
          fullscreen: true,
          parent: angular.element(document.body),
          templateUrl: 'custom/protected/image-picker/image-picker.tpl.html',
        });
      },
    };

    return service;
  }
])

.controller('ImagePickerController', ['$log', '$controller', '$scope', '$mdDialog', 'Upload',
  'UploadService', 'SellerImageService', 'SellerFileService', 'SellerImageSearchService',
  'SellerImageTagSearchService',

  function($log, $controller, $scope, $mdDialog, Upload, UploadService, SellerImageService,
           SellerFileService, SellerImageSearchService, SellerImageTagSearchService) {

    var self = this;

    // Largura máxima das imagens
    var IMAGE_MAX_WIDTH = 900;

    var imageTags = {
      result: [],
    };

    self.images = {};
    self.selectedFiles = [];
    self.selectedFilesTags = [];

    self.filters = {
      tag: [],
    };

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
          order_by: [{
            field: 'created_at',
            direction: 'desc'
          }],
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

      return searchParameters;
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

    self.selectedImage = function(image) {
      $mdDialog.hide(image);
    };

    self.close = function() {
      $mdDialog.cancel();
    };

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
     * Limpa a lista de imagens e pesquisa novamente.
     */
    self.changeFilters = function() {
      self.resetPagination();
      self.loadMore();
    };

    self.loadMore();

    searchTags();
  }
])

;
