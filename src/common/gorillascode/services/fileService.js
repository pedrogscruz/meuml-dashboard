angular.module('gorillascode.services.file', [
  'gorillascode.resources.file'
])

.service('FileService', ['File',
  function (File) {
    var service = {
      save: function(file) {
        if (file.id) {
          return File.patch(file).$promise;
        } else {
          return File.save(file).$promise;
        }
      }
    };

    return service;
  }
])

;
