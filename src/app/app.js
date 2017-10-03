angular.module('meuml', [
  'angular-clipboard',
  'angular-loading-bar',
  'angularMoment',
  'checklist-model',
  'meuml.components.image-picker',
  'meuml.components.image-viewer',
  'meuml.protected',
  'meuml.public',
  'gorillascode',
  'gorillascode.components.pagination',
  'gorillascode.directives',
  'gorillascode.filters',
  'gorillascode.protected',
  'gorillascode.public',
  'gorillascode.services.authentication',
  'gorillascode.services.file',
  'gorillascode.services.notification',
  'gorillascode.services.upload',
  'gorillascode.validators',
  'md.data.table',
  'ngCookies',
  'ngFileUpload',
  'ngMaterial',
  'ngMessages',
  'ngSanitize',
  'templates-app',
  'templates-common',
  'ui.router',
])

.config(['configurationProvider', '$urlRouterProvider', '$locationProvider',
  'cfpLoadingBarProvider', '$httpProvider', '$mdThemingProvider', '$mdDateLocaleProvider',

  function (configurationProvider, $urlRouterProvider, $locationProvider, cfpLoadingBarProvider,
            $httpProvider, $mdThemingProvider, $mdDateLocaleProvider) {

    var configuration = configurationProvider.$get();

    $locationProvider.html5Mode(configuration.html5Mode);
    $urlRouterProvider.otherwise('/');
    $httpProvider.interceptors.push('AuthenticationInterceptor');
    cfpLoadingBarProvider.includeSpinner = false;

    // Altera o formato das datas
    $mdDateLocaleProvider.formatDate = function(date) {
      return date ? moment(date).format('L') : null;
    };

    // Altera o parse das datas
    $mdDateLocaleProvider.parseDate = function(dateString) {
      var m = moment(dateString, 'L', true);
      return m.isValid() ? m.toDate() : new Date(NaN);
    };

    $mdThemingProvider.theme('default')
        .primaryPalette('blue-grey')
        .accentPalette('indigo');

    $mdThemingProvider.enableBrowserColor();
  }
])

.run(['$log', '$window', 'configuration', function ($log, $window, configuration) {
  // Configuração do Google Analytics
  $window.ga('create', configuration.googleAnalyticsTrackingId, 'auto');
}])

.controller('AppController', ['$rootScope', '$log', '$scope', '$state', '$timeout', '$window',
  '$location', 'NotificationService', 'AuthenticationService', 'LocalUserService', '$mdSidenav',
  '$mdComponentRegistry',

  function ($rootScope, $log, $scope, $state, $timeout, $window, $location, NotificationService,
            AuthenticationService, LocalUserService, $mdSidenav, $mdComponentRegistry) {

    $rootScope.$state = $state;
    $rootScope.appVersion = appVersion;

    if ($rootScope.appVersion) {
      $log.info('Versão: ' + $rootScope.appVersion.number);
      $log.info('Build: ' + $rootScope.appVersion.buildDate);
    }

    $scope.$on('$stateChangeStart', function (event, toState, toParams, fromState) {
      // URL para onde deve ser feito o redirecionamento após o login
      $rootScope.continueTo = $state.href(toState.name, toParams, {absolute: true});

      // Oculta o menu lateral ao alterar de tela
      if ($mdComponentRegistry.get('sidenav-left')) {
        $mdSidenav('sidenav-left').close();
      }
    });

    $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
      // Nome da classe CSS para ser adicionada ao <body> do HTML
      $rootScope.bodyClass = toState.name.replace(/\./g, '-');

      // Título da página
      $rootScope.pageTitle = toState.data ? toState.data.pageTitle : null;

      // Envia as informações para o Google Analytics
      $window.ga('set', 'page', $location.url());
      $window.ga('set', 'title', $rootScope.pageTitle || 'MeuML.com');
      $window.ga('send', 'pageview');

      // Faz o scroll até o início da tela
      var content = document.querySelector('.gorillascode-page md-content');

      if (content) {
        content.scrollTop = 0;
      }
    });

    $rootScope.$on('$stateNotFound', function(event, unfoundState, fromState, fromParams) {
      $state.go('public.error.404');
    });

    $rootScope.$on('$stateChangeError',
      function(event, toState, toParams, fromState, fromParams, error) {
        event.preventDefault();

        var errorMessage = null;

        if (angular.isObject(error)) {
          if (error.message) {
            errorMessage = error.message;
          } else if (error.status) {
            errorMessage = error.status + ' ' + error.statusText;
          }
        } else if ((typeof error.data) == 'string') {
          errorMessage = error;
        }

        $rootScope.error = errorMessage;
        $state.go('public.error.500');
      }
    );
  }
])

;
