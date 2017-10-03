angular.module('gorillascode.login')

.controller('LoginController', ['$log', '$scope', '$stateParams', 'NotificationService',
  'AuthenticationService',

  function($log, $scope, $stateParams, NotificationService, AuthenticationService) {

    var self = this;

    // Indica se o e-mail de recuperação de senha foi enviado
    self.emailSent = false;

    // Indica se o login deve ser mantido mesmo após o fim da sessão
    self.remember = true;

    // Indica se devem ser exibidos os botões de login via OAuth
    self.showOAuthButtons = $stateParams.oauth;

    // Informações de autenticação
    self.user = {};

    self.login = function() {
      AuthenticationService.login(self.user.email, self.user.password, self.remember);
    };

    self.recover = function() {
      AuthenticationService.recoverPassword(self.user.email).then(function(response) {
        self.emailSent = !response.response.errors;
      });
    };
  }
])

.controller('PasswordResetController', ['$state', '$stateParams', 'NotificationService',
  'AuthenticationService',

  function($state, $stateParams, NotificationService, AuthenticationService) {
    var self = this;
    var token = $stateParams.token;

    self.password = null;

    self.reset = function() {
      if (!token) {
        NotificationService.error('O token não foi informado. Tente novamente mais tarde.');
        return;
      }

      AuthenticationService.resetPassword(self.password, token).then(function(response) {
        if (!response.response.errors) {
          NotificationService.success('Senha alterada com sucesso. Faça o login com a nova senha.');
          $state.go('public.login');
        }
      });
    };
  }
])

;
