angular.module('meuml')

.provider('configuration', [
  function() {
    var config = null;

    var configs = {
      development: {
        environment: 'development',
        hostnames: ['localhost', '127.0.0.1'],
        apiUrl: 'http://localhost:5000/api',
        googleAnalyticsTrackingId: 'UA-93340830-2',
        mercadoLivreAppClientId: 1850317556892559,
        html5Mode: false,
      },
      staging: {
        environment: 'staging',
        hostnames: ['app.meuml.staging.gorillascode.com'],
        apiUrl: 'https://api.meuml.staging.gorillascode.com/api',
        googleAnalyticsTrackingId: 'UA-93340830-2',
        mercadoLivreAppClientId: 5325595540134918,
        html5Mode: true,
      },
      production: {
        environment: 'production',
        hostnames: ['app.meuml.com'],
        apiUrl: 'https://api.meuml.com/api',
        googleAnalyticsTrackingId: 'UA-93340830-3',
        mercadoLivreAppClientId: 3892071146919087,
        html5Mode: true,
      },
    };

    angular.forEach(configs, function(configItem) {
      angular.forEach(configItem.hostnames, function(hostname) {
        if (window.location.hostname == hostname) {
          config = configItem;
        }
      });
    });

    if (!config) {
      throw new Error('Configuração não encontrada para o ambiente');
    }

    console.log('Configurações carregadas para: ' + config.environment);

    return {
      $get: function() {
        return config;
      }
    };
  }
])

;
