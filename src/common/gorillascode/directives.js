angular.module('gorillascode.directives', [])

/**
 * @ngdoc directive
 * @name gorillasScrollBottomNotifier
 * @module gorillascode.directives
 * @restrict E
 *
 * @description
 * Dispara o evento "scrollBottomEvent" sempre que a barra de rolagem chegar até o fim da tela.
 *
 * @example
 * <ANY gorillas-scroll-bottom-notifier></ANY>
 */
.directive('gorillasScrollBottomNotifier', [
  function() {
    return {
      restrict: 'A',
      link: function($scope, element, attrs) {
        var raw = element[0];
        element.bind('scroll', function() {
          if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight) {
            $scope.$broadcast('scrollBottomEvent');
          }
        });
      }
    };
  }
])

/**
 * @ngdoc directive
 * @name gorillasGravatar
 * @module gorillascode.directives
 * @restrict E
 *
 * @description
 * Cria e exibe uma URL do Gravatar caso a imagem informada não exista.
 * Se o elemento for <img> então altera o "src", caso contrário define a URL no
 * "background-image" do CSS do elemento.
 *
 * @param {string} gorillas-gravatar a URL da imagem. Só deve ser passado um valor caso o elemento
 *                                    não seja <img>
 * @param {string} gorillas-gravatar-email o e-mail que será usado para gerar a imagem do Gravatar.
 *
 * @example
 * <ANY gorillas-gravatar="url" gorillas-gravatar-email="email"></ANY>
 */
.directive('gorillasGravatar', ['md5',
  function(md5) {
    return {
      restrict: 'A',
      scope: {
        'gorillasGravatar': '=',
        'gorillasGravatarEmail': '=',
      },
      link: function(scope, element, attrs) {
        var host = (window.location.hostname == 'localhost') ?
            'app.meuml.staging.gorillascode.com' : window.location.host;

        // Imagem padrão
        var imageUrl = window.location.protocol + '//' + host + '/assets/images/default-avatar.png';

        if (scope.gorillasGravatar) {
          imageUrl = scope.gorillasGravatar;
        } else if (attrs.ngSrc) {
          imageUrl = attrs.ngSrc;
        } else if (scope.gorillasGravatarEmail) {
          var parameters = [
            'default=' + imageUrl,
          ];

          // Pega a maior dimensão do elemento
          if (element[0].clientHeight > element[0].clientWidth) {
            parameters.push('size=' + element[0].clientHeight);
          } else {
            parameters.push('size=' + element[0].clientWidth);
          }

          // Cria a URL do Gravatar
          var hash = md5.createHash(scope.gorillasGravatarEmail.trim().toLowerCase());
          imageUrl = '//www.gravatar.com/avatar/' + hash + '?' + parameters.join('&');
        }

        // Se o elemento for <img> então altera o "src", caso contrário define a URL no
        // "background-image" do CSS do elemento
        if (element[0].tagName.toLowerCase() == 'img') {
          element.attr('src', imageUrl);
        } else {
          element[0].style.backgroundImage = 'url(' + imageUrl + ')';
        }
      }
    };
  }
])

/**
 * Adaptado de https://github.com/czarpino/angular-fix-image-orientation
 */
.directive('gorillasImgFixOrientation', [
  function() {
    return {
      restrict: 'A',
      scope: {
        'gorillasImgFixOrientation': '='
      },
      link: function(scope, element, attrs) {
        var imageUrl = scope.gorillasImgFixOrientation;

        if (0 === imageUrl.indexOf('data:image')) {
          var base64 = imageUrl.split(',')[1];
          var exifData = EXIF.readFromBinaryFile(base64ToArrayBuffer(base64));
          reOrient(parseInt(exifData.Orientation || 1, 10), element);
        }
        else {
          var xhr = new XMLHttpRequest();
          xhr.open("GET", imageUrl, true);
          xhr.responseType = "arraybuffer";
          xhr.onload = function(e) {
            var arrayBuffer = new Uint8Array(this.response);
            var exifData = EXIF.readFromBinaryFile(arrayBuffer.buffer);
            reOrient(parseInt(exifData.Orientation || 1, 10), element);
          };
          xhr.send();
        }
      }
    };

    /**
     * Convert base64 string to array buffer.
     *
     * @param {string} base64
     * @returns {object}
     */
    function base64ToArrayBuffer(base64) {
      var binaryString = window.atob(base64);
      var len = binaryString.length;
      var bytes = new Uint8Array( len );

      for (var i = 0; i < len; i++)    {
        bytes[i] = binaryString.charCodeAt(i);
      }

      return bytes.buffer;
    }

    /**
     * Reorient specified element.
     *
     * @param {number} orientation
     * @param {object} element
     * @returns {undefined}
     */
    function reOrient(orientation, element) {
      switch (orientation) {
        case 1:
          element.css({
            'transform': 'rotate(0deg)'
          });
          break;
        case 2:
          element.css({
            '-moz-transform': 'scaleX(-1)',
            '-o-transform': 'scaleX(-1)',
            '-webkit-transform': 'scaleX(-1)',
            'transform': 'scaleX(-1)',
            'filter': 'FlipH',
            '-ms-filter': "FlipH"
          });
          break;
        case 3:
          element.css({
            'transform': 'rotate(180deg)'
          });
          break;
        case 4:
          element.css({
            '-moz-transform': 'scaleX(-1)',
            '-o-transform': 'scaleX(-1)',
            '-webkit-transform': 'scaleX(-1)',
            'transform': 'scaleX(-1) rotate(180deg)',
            'filter': 'FlipH',
            '-ms-filter': "FlipH"
          });
          break;
        case 5:
          element.css({
            '-moz-transform': 'scaleX(-1)',
            '-o-transform': 'scaleX(-1)',
            '-webkit-transform': 'scaleX(-1)',
            'transform': 'scaleX(-1) rotate(90deg)',
            'filter': 'FlipH',
            '-ms-filter': "FlipH"
          });
          break;
        case 6:
          element.css({
            'transform': 'rotate(90deg)'
          });
          break;
        case 7:
          element.css({
            '-moz-transform': 'scaleX(-1)',
            '-o-transform': 'scaleX(-1)',
            '-webkit-transform': 'scaleX(-1)',
            'transform': 'scaleX(-1) rotate(-90deg)',
            'filter': 'FlipH',
            '-ms-filter': "FlipH"
          });
          break;
        case 8:
          element.css({
            'transform': 'rotate(-90deg)'
          });
          break;
      }
    }
  }
])

/**
 * @ngdoc directive
 * @name gorillasLightbox
 * @module gorillascode.directives
 * @restrict E
 *
 * @description
 * Exibe uma imagem usando a técnica de lightbox.
 *
 * @example
 * <ANY gorillas-lightbox></ANY>
 */
.directive('gorillasLightbox', ['$mdDialog',
  function($mdDialog) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        var template = '' +
          '<md-dialog flex="100" style="height: 100%; max-height: 100%;">' +
          '  <md-toolbar style="background: #000;">' +
          '    <div class="md-toolbar-tools">' +
          '      <md-button ng-click="ctrl.cancel()" class="md-icon-button">' +
          '        <md-icon md-font-icon="material-icons" aria-label="Fechar"' +
          '                 style="color: rgba(255, 255, 255, 0.87)">' +
          '          arrow_back' +
          '        </md-icon>' +
          '      </md-button>' +
          '    </div>' +
          '  </md-toolbar>' +
          '  <md-dialog-content flex layout="column" layout-align="center center"' +
          '                     style="background: #000;">' +
          '    <img src="{{ctrl.url}}" style="max-width: 100%; max-height: 100%;" alt="Foto">' +
          '  </md-dialog-content>' +
          '</md-dialog>';

        element.on('click', function(ev) {
          ev.preventDefault();

          var url = attrs.href;

          $mdDialog.show({
            bindToController: true,
            controller: ['$mdDialog', function($mdDialog) {
              var self = this;

              self.cancel = function() {
                $mdDialog.cancel();
              };
            }],
            controllerAs: 'ctrl',
            fullscreen: true,
            locals: {
              url: url,
            },
            parent: angular.element(document.body),
            targetEvent: ev,
            template: template,
          });
        });
      }
    };
  }
])

;
