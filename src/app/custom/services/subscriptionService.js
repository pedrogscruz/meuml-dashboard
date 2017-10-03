angular.module('meuml.services.subscription', [
  'meuml.resources.subscription',
])

.factory('SellerSubscriptionService', ['SellerSubscription',
  function(SellerSubscription) {
    var service = {
      get: function(id) {
        return SellerSubscription.get({ id: id }).$promise;
      },
      save: function(subscription) {
        return SellerSubscription.save(subscription).$promise;
      },
    };

    return service;
  }
])

.factory('SellerSubscriptionSearchService', ['SellerSubscription',
  function(SellerSubscription) {
    var service = {
      search: function(parameters) {
        return SellerSubscription.query(parameters).$promise;
      }
    };

    return service;
  }
])

;