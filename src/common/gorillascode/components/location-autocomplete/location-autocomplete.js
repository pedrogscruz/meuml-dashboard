/**
 * @ngdoc module
 * @name gorillascode.components.location-autocomplete
 *
 * @description
 * Componente para exibir um campo de autocomplete para a escolha de uma cidade.
 * Depende de https://github.com/wpalahnuk/ngAutocomplete
 */
angular.module('gorillascode.components.location-autocomplete', [
  'gorillascode.addressService',
  'ngAutocomplete'
])

.factory('LocationAutocompleteService', ['$mdDialog', '$mdMedia',
  function ($mdDialog, $mdMedia) {
    var service = {
      getLocation: function(event) {
        return $mdDialog.show({
          controller: 'LocationAutocompleteController as locationAutocompleteCtrl',
          templateUrl: 'gorillascode/components/location-autocomplete/location-autocomplete.tpl.html',
          parent: angular.element(document.body),
          targetEvent: event,
          fullscreen: $mdMedia('xs')
        });
      }
    };

    return service;
  }
])

.controller('LocationAutocompleteController', ['$scope', '$mdDialog', 'AddressService',
  function($scope, $mdDialog, AddressService) {
    var self = this;

    // Nome formatado do local
    self.locationFormattedAddress = null;

    // Detalhes do local
    self.locationDetails = null;

    // Indica que nenhum local foi selecionado
    self.noLocation = false;

    self.cancel = function() {
      $mdDialog.cancel();
    };

    self.changeLocation = function() {
      var location = null;
      var locationDetails = self.locationDetails;

      // Se foi marcado o checkbox para pesquisar no país inteiro então cria um objeto para
      // representar o país
      if (self.noLocation) {
        locationDetails = {
          address_components: [],
          formatted_address: 'Brasil'
        };
      }

      if (locationDetails) {
        var coords = null;

        if (locationDetails.geometry) {
          coords = {
            latitude: locationDetails.geometry.location.lat(),
            longitude: locationDetails.geometry.location.lng()
          };
        }

        location = AddressService.transformGoogleLocation(coords, locationDetails);
      }

      $mdDialog.hide(location);
    };

    // Se se um novo local foi escolhido então faz a alteração do local
    $scope.$watch(function() {
      return self.locationDetails;
    }, function(newValue) {
      if (newValue) {
        self.changeLocation();
      }
    });
  }
])

;
