angular.module('gorillascode.user', [
  'gorillascode.resources.users'
])

.factory('LocalUserService', ['$cookies',
  function($cookies) {
    var COOKIE_AUTHENTICATION_TOKEN = 'authenticationToken';

    var loggedUser = null;
    var authenticationToken = $cookies.getObject(COOKIE_AUTHENTICATION_TOKEN);

    var service = {
      setUser: function(user) {
        loggedUser = user;
      },
      setAuthenticationToken: function(token) {
        var expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 365);

        authenticationToken = token;

        $cookies.putObject(COOKIE_AUTHENTICATION_TOKEN, authenticationToken, {
          expires: expirationDate,
        });
      },
      getAuthenticationToken: function() {
        return authenticationToken;
      },
      getUser: function() {
        return loggedUser;
      },
      isAuthenticated: function() {
        return (loggedUser != null);
      },
      cleanUser: function() {
        authenticationToken = null;
        loggedUser = null;

        $cookies.remove(COOKIE_AUTHENTICATION_TOKEN);
      },
      isUserInRole: function(role, user) {
        var roles = [];

        if (!user) {
          user = loggedUser;
        }

        if (!user || !user.roles) {
          return false;
        }

        roles = angular.isArray(role) ? role : [role];

        for (var i = 0; i < user.roles.length; i++) {
          if (roles.indexOf(user.roles[i]) > -1) {
            return true;
          }
        }

        return false;
      }
    };

    return service;
  }
])

.factory('UserService', ['$http', 'configuration', 'Users',
  function($http, configuration, Users) {
    var service = {
      save: function(user) {
        return Users.patch(user).$promise;
      },
      exists: function(parameters) {
        return $http.head(configuration.apiUrl + '/user/_exists', {params: parameters});
      },
    };

    return service;
  }
])

;
