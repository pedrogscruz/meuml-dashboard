angular.module('meuml.protected.account')

.controller('AccountListController', ['$scope', '$controller', '$mdDialog', 'NotificationService',
  'SellerAccountService', 'SellerAccountSearchService', 'OAuthService',

  function($scope, $controller, $mdDialog, NotificationService, SellerAccountService,
           SellerAccountSearchService, OAuthService) {

    var self = this;

    self.filters = {};
    self.order = 'email';
    self.accounts = {};

    $controller('PaginationController', {
      $scope: $scope,
      self: this,
      list: self.accounts,
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

      return SellerAccountSearchService.search(searchParameters);
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
        results_per_page: 20,
      };

      searchParameters.q.order_by.push({
        field: 'created_at',
        direction: 'asc',
      });

      return searchParameters;
    }

    self.new = function() {
      OAuthService.getCode(function(code) {
        SellerAccountService.add(code).then(function(response) {
          var account = null;

          angular.forEach(self.accounts.result, function(currentAccount) {
            if (currentAccount.id == response.id) {
              account = currentAccount;
            }
          });

          if (account) {
            NotificationService.success('Conta atualizada');
            angular.extend(account, response);
          } else {
            NotificationService.success('Conta adicionada');

            self.accounts.limit++;
            self.accounts.result.push(response);
          }
        }, function(error) {
          NotificationService.error('Não foi possível adicionar a conta. Tente novamente mais ' +
              'tarde.', error);
        });
      });
    };

    self.edit = function(account, ev) {
      var prompt = $mdDialog.prompt()
        .title('Editar nome')
        .ariaLabel('Editar nome')
        .initialValue(account.name)
        .placeholder('Informe o nome')
        .targetEvent(ev)
        .ok('Salvar')
        .cancel('Cancelar');

      $mdDialog.show(prompt).then(function(name) {
        if (!name) {
          return;
        }

        var accountToSave = {
          id: account.id,
          name: name,
        };

        SellerAccountService.save(accountToSave).then(function() {
          NotificationService.success('Conta atualizada');
          account.name = name;
        }, function(error) {
          NotificationService.error('Não foi possível atualizar a conta. Tente novamente mais ' +
              'tarde.', error);
        });
      });
    };

    self.delete = function(account, index, ev) {
      var prompt = $mdDialog.confirm()
        .title('Excluir ' + account.name + '?')
        .ariaLabel('Excluir a conta?')
        .textContent('Todo o histórico dessa conta também será removido')
        .targetEvent(ev)
        .ok('Excluir')
        .cancel('Cancelar');

      $mdDialog.show(prompt).then(function() {
        SellerAccountService.delete(account.id).then(function() {
          NotificationService.success('Conta excluída');
          self.accounts.result.splice(index, 1);
        }, function(error) {
          NotificationService.error('Não foi possível excluir a conta. Tente novamente mais ' +
              'tarde.', error);
        });
      });
    };

    self.loadMore();
  }
])

;
