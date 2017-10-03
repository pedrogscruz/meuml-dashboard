angular.module('meuml.protected.plan')

.controller('PlanListController', ['$log', '$state', '$window', '$mdDialog',
  'NotificationService', 'LocalUserService', 'SellerSubscriptionService', 'SellerImageService',
  'plans',

  function($log, $state, $window, $mdDialog, NotificationService, LocalUserService,
           SellerSubscriptionService, SellerImageService, plans) {

    var self = this;
    var user = LocalUserService.getUser();

    self.changingPlan = false;
    self.plans = plans;

    self.isCurrentPlan = function(plan) {
      if (!user.subscription) {
        return false;
      }

      return user.subscription.plan_id == plan.id && user.subscription.status != 'CANCELED';
    };

    self.isSubscribeButtonVisible = function(plan) {
      if (self.isCurrentPlan(plan)) {
        return false;
      }

      return true;
    };

    self.isPayButtonVisible = function(plan) {
      if (!self.isCurrentPlan(plan)) {
        return false;
      }

      if (!user.subscription.external_id) {
        return false;
      }

      if (user.subscription.status == 'PENDING') {
        return true;
      }

      return false;
    };

    self.isEndDateVisible = function(plan) {
      if (!self.isCurrentPlan(plan)) {
        return false;
      }

      if (user.subscription.status != 'CANCELED') {
        return true;
      }

      return true;
    };

    self.getSubscriptionLink = function(subscription) {
      if (!subscription) {
        return null;
      }

      return 'https://www.mercadopago.com.br/subscriptions/detail?id=' + subscription.external_id;
    };

    self.subscribe = function(plan, ev) {
      var imagesCount = SellerImageService.getStats().count;

      if (imagesCount > plan.max_images) {
        var alert = $mdDialog.alert()
          .title('Alterar assinatura')
          .textContent('Você deve excluir algumas imagens para poder alterar o plano')
          .targetEvent(ev)
          .ok('Ok');

        $mdDialog.show(alert);

        return;
      }

      var textContent = null;

      if (user.subscription && user.subscription.external_id) {
        textContent = 'O valor da sua assinatura será atualizado no MercadoPago e será debitado ' +
            'no próximo pagamento';
      } else {
        textContent = 'Você será redirecionado para fazer o pagamento no MercadoPago';
      }

      var confirm = $mdDialog.confirm()
        .title('Alterar assinatura')
        .textContent(textContent)
        .targetEvent(ev)
        .ok('Continuar')
        .cancel('Cancelar');

      $mdDialog.show(confirm).then(function() {
        var subscriptionToSave = {
          plan_id: plan.id,
        };

        self.changingPlan = true;

        SellerSubscriptionService.save(subscriptionToSave).then(function(subscription) {
          $log.info('Plano alterado');

          // Se a transação não foi aprovada automaticamente então exibe a tela de pagamento
          if (subscription.status == 'PENDING') {
            self.paySubscription(subscription.external_data.init_point);
          } else {
            // Atualiza as informações da assinatura do usuário autenticado
            user.subscription = subscription;

            NotificationService.success('Plano alterado');
          }
        }, function(error) {
          NotificationService.error('Não foi possível alterar o plano. Tente novamente mais ' +
              'tarde.', error);
        }).finally(function() {
          self.changingPlan = false;
        });
      });
    };

    /**
     * Exibe a tela de pagamento do MercadoPago.
     */
    self.paySubscription = function(paymentUrl) {
      paymentUrl = paymentUrl || user.subscription.external_data.init_point;
      $window.location = paymentUrl;
    };
  }
])

;
