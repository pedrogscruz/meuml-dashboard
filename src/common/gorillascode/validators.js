angular.module('gorillascode.validators', [])

.directive('compareTo', [
  function() {
    return {
      require: 'ngModel',
      scope: {
        otherModelValue: '=compareTo'
      },
      link: function(scope, element, attributes, ngModel) {
        ngModel.$validators.compareTo = function(modelValue) {
          return modelValue == scope.otherModelValue;
        };

        scope.$watch('otherModelValue', function() {
          ngModel.$validate();
        });
      }
    };
  }
])

.directive('checkIfUserExists', ['$q', 'UserService',
  function($q, UserService) {
    return {
      require: 'ngModel',
      link: function(scope, elm, attrs, ngModel) {
        ngModel.$asyncValidators.exists = function(value) {
          var deferred = $q.defer();

          UserService.exists({ email: value }).then(function() {
            // Se retornou 200 é por que o usuário já existe
            deferred.reject();
          }, function() {
            // Se retornou erro 404 é por que o usuário não existe
            deferred.resolve();
          });

          return deferred.promise;
        };
      }
    };
  }
])


;
