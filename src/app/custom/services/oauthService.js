angular.module('meuml.services.oauth', [
  'meuml.resources.oauth'
])

.factory('OAuthService', ['$log', '$window', 'configuration',
  function($log, $window, configuration) {
    var authorizeUrl = configuration.apiUrl + '/_oauth/authorize';

    var service = {
      getCode: function(callback) {
        // Função que será chamada quando a pop-up de autorização for fechada
        $window.oauthCallback = function(code) {
          callback(code);
        };

        var height = 510;
        var width = 830;
        var left = parseInt((screen.availWidth - width) / 2);
        var top = parseInt((screen.availHeight - height) / 2);

        window.open(authorizeUrl, '', 'toolbar=no,status=no,location=yes,menubar=no,resizable=no,' +
            'scrollbars=no,width=' + width + ',height=' + height + ',left=' + left+ ',top=' + top +
            'screenX=' + left+ ',screenY=' + top);
      },
    };

    return service;
  }
])

;