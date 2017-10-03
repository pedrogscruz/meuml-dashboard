angular.module('gorillascode.components.image-select', [
  'ngFileUpload',
  'ngImgCrop'
])

/**
 * @ngdoc directive
 * @name gorillascodeImageSelect
 * @module gorillascode.components.image-select
 * @restrict E
 *
 * @description
 * Exibe uma foto e adiciona um botão para permitir a escolha de outro arquivo de foto.
 * Quando o arquivo é escolhido exibe um modal para permitir recortar a foto.
 * Para deixar a foto redonda adicionar a classe CSS "circle".
 * Depende de https://github.com/danialfarid/ng-file-upload e https://github.com/alexk111/ngImgCrop
 *
 * @param {string} source o caminho da foto para ser exibida.
 * @param {number} imageDimension a largura/altura da imagem.
 * @param {function} imageSelected a função que será chamada quando for clicado no botão "Salvar".
 *
 * @example
 * <gorillascode-image-select
 *    source="/photo.jpg"
 *    image-dimension="150"
 *    image-selected="controller.uploadPhoto">
 * </gorillascode-image-select>
 */
.directive('gorillascodeImageSelect', [
  function() {
    return {
      controller: 'ImageSelectController as imageSelectCtrl',
      restrict: 'E',
      scope: {
        source: '@',
        imageDimension: '@',
        imageSelected: '&'
      },
      templateUrl: 'gorillascode/components/image-select/image-select.tpl.html',
      link: function ($scope, element, attrs) {
        if (!$scope.imageSelected()) {
          throw new Error('gorillascode-image-select: o atributo "imageSelected" não foi informado');
        }

        if (!$scope.source) {
          throw new Error('gorillascode-image-select: o atributo "source" não foi informado');
        }
      }
    };
  }
])

.controller('ImageSelectController', ['$scope', '$mdDialog',
  function($scope, $mdDialog) {
    var self = this;
    var dimension = $scope.imageDimension || 300;

    self.selectedPhoto = function(file, ev) {
      if (!file) {
        return;
      }

      $mdDialog.show({
        controller: 'ImageSelectEditController as imageSelectEditCtrl',
        templateUrl: 'gorillascode/components/image-select/image-select-edit.tpl.html',
        parent: angular.element(document.body),
        fullscreen: true,
        targetEvent: ev,
        locals: {
          dimension: dimension,
          file: file
        }
      }).then(function(fileCroppedData) {
        $scope.imageSelected()(file, fileCroppedData, dimension);
      });
    };
  }
])

.controller('ImageSelectEditController', ['$mdDialog', 'file', 'dimension',
  function($mdDialog, file, dimension) {
    var self = this;

    self.dimension = dimension;
    self.file = file;
    self.fileCroppedData = null;

    self.cancel = function() {
      $mdDialog.cancel();
    };

    self.save = function() {
      $mdDialog.hide(self.fileCroppedData);
    };
  }
])

;
