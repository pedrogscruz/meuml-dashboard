angular.module('gorillascode.filters', [
  'angular-md5',
])

/**
 * Exibe o tempo relativo de uma data no fuso horário UTC.
 * Usa a API do Moment.js: https://momentjs.com/docs/#/displaying/fromnow/
 */
.filter('fromNow', [
  function() {
    return function (date) {
      return moment.utc(date).fromNow();
    };
  }
])

.filter('trustAsHtml', ['$sce',
  function($sce) {
    return function(value) {
      return value ? $sce.trustAsHtml(value) : value;
    };
  }
])

.filter('trustAsResourceUrl', ['$sce',
  function($sce) {
    return function(value) {
      return value ? $sce.trustAsResourceUrl(value) : value;
    };
  }
])

.filter('fileSize', ['$filter',
  function($filter) {
    var numberFilter = $filter('number');

    return function(bytes, precision) {
      if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) {
        return '-';
      }

      if (typeof precision === 'undefined') {
        precision = 1;
      }

      var units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
      var number = Math.floor(Math.log(bytes) / Math.log(1024));
      var numberFormatted = numberFilter(bytes / Math.pow(1024, Math.floor(number)), precision);

      return numberFormatted + ' ' + units[number];
    };
  }
])

.filter('gender', [
  function() {
    return function(value) {
      switch (value) {
        case 'FEMALE':
          return 'Feminino';

        case 'MALE':
          return 'Masculino';

        default:
          return 'Não informado';
      }
    };
  }
])

/**
 * Converte uma string, no fuso horário UTC, para um objeto Date.
 */
.filter('toUTCDate', [
  function() {
    return function (date) {
      if (!date) {
        return null;
      }

      // Se a string não possui a informação sobre o fuso horário UTC então adiciona o "Z" no final
      // para que o objeto Date seja gerado com o fuso horário UTC e não o fuso horário local.
      if (date.slice(-1) != 'Z') {
        date = date + 'Z';
      }

      return new Date(date);
    };
  }
])

;
