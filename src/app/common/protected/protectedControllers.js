angular.module('gorillascode.protected')

.controller('ProtectedController', ['$rootScope', '$state', '$mdSidenav', '$filter',
  'AuthenticationService', 'MigrationSearchService', 'LocalUserService', 'NotificationService',
  'user', 'plan', 'imagesStats',

  function($rootScope, $state, $mdSidenav, $filter, AuthenticationService, MigrationSearchService,
           LocalUserService, NotificationService, user, plan, imagesStats) {

    var self = this;

    // Indica quais menus serão exibidos
    self.isVisible = {
      htmlEditor: false,
      images: false,
      imagesCount: false,
      migration: false,
      plan: false,
      productCategory: false,
      templates: false,
    };

    self.imagesStats = imagesStats;
    self.subcriptionStatus = null;
    self.user = user;

    self.hasRequestedMigrations = false;

    MigrationSearchService.getRequestCount().then(function (count) {
      self.hasRequestedMigrations = count > 0;
    }, function(error) {
      NotificationService.error('Não foi possível listar as pendências para resolver', error);
    });

    // Adiciona as informações do plano no objeto com a assinatura
    if (self.user.subscription) {
      var endDate = new Date(self.user.subscription.end_date + 'Z');
      var isTrial = false;

      if (self.user.subscription.end_date_trial) {
        isTrial = new Date(self.user.subscription.end_date_trial + 'Z') > new Date();
      }

      self.user.subscription.plan = plan;

      self.isVisible.htmlEditor = self.user.subscription.status != 'CANCELED';
      self.isVisible.images = self.user.subscription.status != 'CANCELED';
      self.isVisible.imagesCount = self.user.subscription.status != 'CANCELED';
      self.isVisible.migration = self.user.subscription.status == 'ACTIVE';
      self.isVisible.plan = self.user.subscription.status != 'CANCELED';
      self.isVisible.productCategory = self.user.subscription.status != 'CANCELED';
      self.isVisible.templates = self.user.subscription.status != 'CANCELED';


      if (self.user.subscription.status == 'ACTIVE') {
        self.subcriptionStatus = 'Vence em ' +
            $filter('date')(endDate, "d 'de' MMMM");
      } else if (isTrial) {
        self.subcriptionStatus = 'Gratuito até ' +
            $filter('date')(self.user.subscription.end_date_trial, "d 'de' MMMM");
      } else if (self.user.subscription.status == 'PENDING') {
        self.subcriptionStatus = 'Pagamento pendente';
      } else if (endDate < new Date()) {
        self.subcriptionStatus = 'Assinatura vencida';
      }
    }

    self.toggleMenu = function() {
      $mdSidenav('sidenav-left').toggle();
    };

    self.logout = function() {
      AuthenticationService.logout().then(function() {
        $rootScope.$broadcast('userLogout');
        $state.go('public.login');
      });
    };
  }
])

;
