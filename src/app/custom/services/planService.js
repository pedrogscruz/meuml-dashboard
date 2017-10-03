angular.module('meuml.services.plan', [
  'meuml.resources.plan',
])

.factory('SellerPlanService', ['SellerPlan', 'SellerPlanSubscribe',
  function(SellerPlan, SellerPlanSubscribe) {
    var service = {
      get: function(id) {
        return SellerPlan.get({ id: id }).$promise;
      },
      subscribe: function(plan) {
        return SellerPlanSubscribe.save({ plan_id: plan.id }).$promise;
      },
    };

    return service;
  }
])

.factory('SellerPlanSearchService', ['SellerPlan',
  function(SellerPlan) {
    var service = {
      search: function(parameters) {
        return SellerPlan.query(parameters).$promise;
      }
    };

    return service;
  }
])

;