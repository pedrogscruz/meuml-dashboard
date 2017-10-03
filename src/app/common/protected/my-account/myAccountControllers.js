angular.module('gorillascode.my-account')

.controller('MyAccountController', ['Utils', 'NotificationService', 'LocalUserService',
  'UserService', 'user',

  function (Utils, NotificationService, LocalUserService, UserService, user) {
    var self = this;

    self.user = angular.copy(user);

    self.save = function() {
      var user = {
        document: self.user.document,
        id: 'me',
        name: self.user.name,
      };

      UserService.save(user).then(function () {
        // Atualiza o nome do usuário no LocalUserService
        LocalUserService.getUser().name = self.user.name;
        NotificationService.success('Informações salvas');
      }, function (error) {
        NotificationService.success('Não foi possível salvar as informações', error);
      });
    };
  }
])

;
