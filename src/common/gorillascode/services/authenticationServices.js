angular.module('gorillascode.services.authentication', [
  'gorillascode.user',
  'gorillascode.resources.login',
  'ui.router'
])

.factory('AuthenticationService', ['$log', '$rootScope', '$q', '$state', 'NotificationService',
  'RegisterUser', 'Login', 'LoginOAuth', 'LocalUserService', 'UserLogged', 'PasswordReset',
  'PasswordChange',

  function ($log, $rootScope, $q, $state, NotificationService, RegisterUser, Login, LoginOAuth,
            LocalUserService, UserLogged, PasswordReset, PasswordChange) {

    var service = {
      getLoggedUser: function() {
        return UserLogged.get().$promise;
      },
      createUser: function(user, plan) {
        return RegisterUser.save({plan: plan}, user, function (response) {
          response = response.response;

          if (response.errors) {
            showErrorMessage(response.errors);
          }
        }, function (error) {
          NotificationService.error('Não foi possível criar a conta. Tente novamente mais tarde.',
            error);
        }).$promise;
      },
      login: function (email, password) {
        var credentials = {
          email: email,
          password: password
        };

        return Login.save(credentials, function (response) {
          response = response.response;

          if (response.errors) {
            showErrorMessage(response.errors);
          } else {
            LocalUserService.setAuthenticationToken(response.user.authentication_token);

            if ($state.params.continue) {
              var continueTo = decodeURIComponent($state.params.continue);
              window.location = continueTo;
            } else {
              $state.go('protected.home');
            }
          }
        }, function (error) {
          NotificationService.error('Não foi possível fazer o login. Tente novamente mais ' +
            'tarde.', error);
        }).$promise;
      },
      loginOAuth: function (provider, accessToken) {
        var credentials = {
          access_token: accessToken,
          provider: provider,
        };

        return LoginOAuth.save(credentials, function(response) {
          response = response.response;

          if (response.errors) {
            showErrorMessage(response.errors);
          } else {
            LocalUserService.setAuthenticationToken(response.user.authentication_token);

            if ($state.params.continue) {
              var continueTo = decodeURIComponent($state.params.continue);
              window.location = continueTo;
            } else {
              $state.go('protected.home');
            }
          }
        }, function (error) {
          NotificationService.error('Não foi possível fazer o login. Tente novamente mais ' +
            'tarde.', error);
        }).$promise;
      },
      logout: function () {
        LocalUserService.cleanUser();
        return $q.when([]);
      },
      changePassword: function (password, newPassword, newPasswordConfirm) {
        var parameters = {
          password: password,
          new_password: newPassword,
          new_password_confirm: newPasswordConfirm
        };

        return PasswordChange.save(parameters, function (response) {
          response = response.response;

          if (response.errors) {
            showErrorMessage(response.errors);
          } else {
            // Quando a senha do usuário é alterada um novo token é gerado
            LocalUserService.setAuthenticationToken(response.user.authentication_token);
          }
        }, function (error) {
          NotificationService.error('Não foi possível alterar a senha. Tente novamente mais ' +
            'tarde.', error);
        }).$promise;
      },
      recoverPassword: function (email) {
        return PasswordReset.save({email: email}, function (response) {
          response = response.response;

          if (response.errors) {
            showErrorMessage(response.errors);
          }
        }, function (error) {
          NotificationService.error('Não foi possível recuperar a senha. Tente novamente mais ' +
            'tarde.', error);
        }).$promise;
      },
      resetPassword: function (password, token) {
        var parameters = {
          password_confirm: password,
          password: password,
          token: token
        };

        return PasswordReset.save(parameters, function (response) {
          response = response.response;

          if (response.errors) {
            showErrorMessage(response.errors);
          }
        }, function (error) {
          NotificationService.error('Não foi possível alterar a senha. Tente novamente mais ' +
            'tarde.', error);
        }).$promise;
      }
    };

    function showErrorMessage(errors) {
      var firstError = null;
      var keys = Object.keys(errors);
      var message = null;

      if (keys.length === 0) {
        return;
      }

      firstError = errors[keys[0]];

      if (!angular.isArray(firstError)) {
        return;
      }

      message = firstError[0];
      NotificationService.error(message);
    }

    return service;
  }
])

.factory('AuthenticationInterceptor', ['LocalUserService',
  function (LocalUserService) {
    var service = {
      request: function (config) {
        if (LocalUserService.getAuthenticationToken()) {
          config.headers['Authentication-Token'] = LocalUserService.getAuthenticationToken();
        } else {
          delete config.headers['Authentication-Token'];
        }

        return config;
      }
    };

    return service;
  }
])

;