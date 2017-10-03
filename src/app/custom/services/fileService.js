angular.module('meuml.services.file', [
  'meuml.resources.file'
])

.service('SellerFileService', ['SellerFile',
  function (SellerFile) {
    var service = {
      save: function(parameters, file) {
        if (file.id) {
          return SellerFile.patch(parameters, file).$promise;
        } else {
          return SellerFile.save(parameters, file).$promise;
        }
      }
    };

    return service;
  }
])

;
