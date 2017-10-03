angular.module('meuml.components.image-viewer', [
  'cfp.hotkeys',
])

.factory('ImageViewer', ['$mdDialog',
  function($mdDialog) {
    var service = {
      show: function(images, index, ev) {
        return $mdDialog.show({
          controller: 'ImageViewerController as imageViewerCtrl',
          targetEvent: ev,
          fullscreen: true,
          locals: {
            index: index,
            images: images,
          },
          parent: angular.element(document.body),
          templateUrl: 'custom/protected/image-viewer/image-viewer.tpl.html',
        });
      },
    };

    return service;
  }
])

.controller('ImageViewerController', ['$mdDialog', '$mdSidenav', 'index', 'images',
  function($mdDialog, $mdSidenav, index, images) {
    var self = this;

    self.index = index;
    self.image = images[index];
    self.images = images;

    self.close = function() {
      $mdDialog.cancel();
    };

    self.showNextImage = function () {
      if (self.index >= (images.length - 1)) {
        return;
      }

      self.index++;
      self.image = images[self.index];
    };

    self.showPreviousImage = function () {
      if (self.index <= 0) {
        return;
      }

      self.index--;
      self.image = images[self.index];
    };

    self.toggleInfo = function() {
      $mdSidenav('sidenav-image-information').toggle();
    };
  }
])

;
