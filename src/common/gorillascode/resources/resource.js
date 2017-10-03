/**
 * @description
 * Cria um $resource para uso com a API Rest da GorillasCode.
 */
angular.module('gorillascode.resource', [
  'ngResource'
])

.factory('ResourceFactory', ['$log', '$resource',
  function($log, $resource) {
    return function(apiBaseUrl, resourceName, subResourceName, paramDefaults) {
      paramDefaults = paramDefaults || { id: '@id' };

      var url = apiBaseUrl + '/' + resourceName + '/:id';
      var actions = {
        patch: { method: 'PATCH' },
        query: { method: 'GET', isArray: false, transformResponse: transformResponseQuery }
      };

      if (subResourceName) {
        url += '/' + subResourceName;

        // Se a chamada for para /exists então retorna a resposta sem modificações
        if (subResourceName != 'exists') {
          actions.get = {method: 'GET', transformResponse: transformResponseQuery};
        }
      }
      
      function transformResponseQuery(data, headersGetter) {
        var objects = [];

        try {
          data = angular.fromJson(data);
        } catch(error) {
          $log.error('Não foi possível interpretar a resposta da requisição', error);
        }

        // Se o servidor estiver offline, por exemplo, então "data" == null
        if (!data) {
          return {
            result: [],
            limit: 0,
            offset: 0,
            pages: 0
          };
        }

        //  Result padrão para o FlaskRestless que será convertido
        //  "num_results": 8,
        //  "total_pages": 3,
        //  "page": 2,
        //  "objects":
        //  [
        //    {"id": 1, "name": "Jeffrey", "age": 24},
        //    {"id": 2, "name": "John", "age": 13},
        //    {"id": 3, "name": "Mary", "age": 18}
        //  ]

        if (!data.objects && !data.num_results && !data.page && !data.total_pages) {
          return data;
        }

        var response = {
          result: data.objects,
          limit: data.num_results,
          offset: data.page,
          pages: data.total_pages
        };

        return response;
      }

      return $resource(url, paramDefaults, actions);
    };
  }
]);
