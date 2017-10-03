angular.module('meuml.protected.dashboard')

.controller('DashboardController', ['$log', '$scope', '$mdToast', 'NotificationService',
  'SellerDashboardService', 'SellerDashboardSearchService', 'accounts',

function($log, $scope, $mdToast, NotificationService, SellerDashboardService,
       SellerDashboardSearchService, accounts) {

  var self = this;

  self.accounts = accounts;
  self.refreshing = false;
  self.selectedAccount = null;
  $scope.cores = {
    'vermelho': {
      'hex': '#ff605a',
      'des': '#ffe7e6'
    },
    'laranja': {
      'hex': '#ffb657',
      'des': '#fff4e7'
    },
    'amarelo': {
      'hex': '#fff044',
      'des': '#fffde5'
    },
    'verde_claro': {
      'hex': '#baff20',
      'des': '#f3fee0'
    },
    'verde': {
      'hex': '#31b93c',
      'des': '#dff4e3'
    }
  };

  // Seleciona a primeira conta
  if (self.accounts.result.length) {
    self.selectedAccount = accounts.result[0];
  }

  self.changeFilters = function() {
    // TODO atualizar os gráficos para a nova conta
    $log.info('Conta selecionada: ' + self.selectedAccount.name);
  };

  self.refresh = function() {
    if (!self.selectedAccount) {
      return;
    }

    var parameters = {
      account_id: self.selectedAccount.id,
    };

    self.refreshing = true;

    $mdToast.show({
      hideDelay: 0,
      template: '<md-toast>Atualizando o dashboard...</md-toast>',
    });

    SellerDashboardService.refresh(parameters).then(function(r) {
      $mdToast.hide();
      NotificationService.success('Dashboard atualizado');
      $scope.labels = [];
      $scope.data = [];
      $scope.series = [];
      $scope.reputation = r['reputação'];
      for (var dt in r.dados) {
        if (dt=="antes") {
          $scope.labels.unshift("antes");
        }
        else {
          $scope.labels.push(dt.substring(3,5) + '/' + dt.substring(0,2));
        }
      }
      for (var categoria in r.total) {
        $scope.series.push(categoria);
        $scope.data.push([]);
        for (var dta in r.dados) {
          if (dta=="antes") {
            $scope.data[$scope.data.length-1].unshift(r.dados[dta][categoria]);
          }
          else {
            $scope.data[$scope.data.length-1].push(r.dados[dta][categoria]);
          }
        }
      }
      $scope.vendas = ["Vendas OK", "Vendas com problemas"];
      $scope.colors = ['#45b7cd', '#ff6384', '#ffce56', '#FB8C00', '#795548'];
      $scope.vendas_colors = ['#45b7cd', '#ee3333'];
      if (1!==1) {
//      for (v in response) {
//        if (a===0 && m===0) {
//          a = parseInt(v.substring(0,2));
//          m = parseInt(v.substring(3,5));
//        }
//        else {
//          for (m; m != parseInt(v.substring(3,5)) || a != parseInt(v.substring(0,2)); m++) {
//            if (m==13) {
//              m=1;
//              a++;
//            }
//            $scope.labels.push(('0' + m).slice(-2)+'/'+a);
//            $scope.data[0].push(0);
//            $scope.data[1].push(0);
//            $scope.data[2].push(0);
//            $scope.data[3].push(0);
//            $scope.data[4].push(0);
//          }
//        }
//        $scope.labels.push(v.substring(3,5) + '/' + v.substring(0,2));
//        $scope.data[0].push(response[v]['vendas']);
//        $scope.data[1].push(response[v]['canceladas']);
//        $scope.data[2].push(response[v]['disputas']);
//        $scope.data[3].push(response[v]['reclamacoes']);
//        $scope.data[4].push(response[v]['atrasos']);
//        $scope.totalSale += response[v]['vendas'];
//        $scope.totalClaim += response[v]['reclamacoes'];
//        $scope.totalDelay += response[v]['atrasos'];
//        $scope.totalDispute += response[v]['disputas'];
//        $scope.totalCanceled += response[v]['canceladas'];
//        $scope.totalShipped += response[v]['envios'];
//        m++;
//        if (m==13) {
//          m=1;
//          a++;
//        }
//      }
//      if (r.period == "3 months") {
//        $scope.total = r.total;
//        var cncld = $scope.totalCanceled, dpt = $scope.totalDispute, clm = $scope.totalClaim, dl = $scope.totalDelay;
//        for (var o in response) { break; }
//        var sl = $scope.totalSale - response[o]['vendas'], envs = $scope.totalShipped - response[o]['envios'];
//        var prct_cncld = $scope.percentLimitCanceled($scope.totalCanceled / $scope.totalSale * 100);
//        var prct_dpt = $scope.percentLimitDispute($scope.totalDispute / $scope.totalSale * 100);
//        var prct_clm = $scope.percentLimitClaim($scope.totalClaim / $scope.totalSale * 100);
//        var prct_dl = $scope.percentLimitDelay($scope.totalDelay / $scope.totalShipped * 100);
//        console.log("prct_cncld: "+prct_cncld+" prct_dpt: "+prct_dpt+" prct_clm: "+prct_clm+" prct_dl: "+prct_dl);
//        for (var b=1; cncld == $scope.totalCanceled || dpt == $scope.totalDispute || clm == $scope.totalClaim || dl == $scope.totalDelay; b++) {
//          if  (cncld == $scope.totalCanceled) {
//            if (prct_cncld === 0.05) {
//              if ((cncld+b)/(sl+b) >= prct_cncld) {
//                cncld = cncld+b;
//                $scope.msg_cncld = "Para manter a sua reputação você pode ter no máximo " + cncld + " vendas com cancelamento";
//              }
//            }
//            else {
//              if ((cncld)/(sl+b) < prct_cncld) {
//                cncld = cncld+b;
//                $scope.msg_cncld = "Para subir a sua reputação para verde escuro você precisa fazer pelo menos " + (sl+b) + " vendas sem cancelamento";
//              }
//            }
//          }
//          if  (dpt == $scope.totalDispute) {
//            if (prct_dpt === 0.02) {
//              if ((dpt+b)/(sl+b) >= prct_dpt) {
//                dpt = dpt+b;
//                $scope.msg_dpt = "Para manter a sua reputação você pode ter no máximo " + dpt + " vendas com mediações";
//              }
//            }
//            else {
//              if ((dpt)/(sl+b) < prct_dpt) {
//                dpt = dpt+b;
//                $scope.msg_dpt = "Para subir a sua reputação para verde escuro você precisa fazer pelo menos " + (sl+b) + " vendas sem mediações";
//              }
//            }
//          }
//          if  (clm == $scope.totalClaim) {
//            if (prct_clm === 0.05) {
//              if ((clm+b)/(sl+b) >= prct_clm) {
//                clm = clm+b;
//                $scope.msg_clm = "Para manter a sua reputação você pode ter no máximo " + clm + " vendas com reclamação";
//              }
//            }
//            else {
//              if ((clm)/(sl+b) < prct_clm) {
//                clm = clm+b;
//                $scope.msg_clm = "Para subir a sua reputação para verde escuro você precisa fazer pelo menos " + (sl+b) + " vendas sem reclamação";
//              }
//            }
//          }
//          if  (dl == $scope.totalDelay) {
//            if (prct_dl === 0.2) {
//              if ((dl+b)/(envs+b) >= prct_dl) {
//                dl = dl+b;
//                $scope.msg_dl = "Para manter a sua reputação você pode ter no máximo " + dl + " vendas com atraso";
//              }
//            } else {
//              if ((dl)/(envs+b) < prct_dl) {
//                dl = dl+b;
//                $scope.msg_dl = "Para subir a sua reputação para verde escuro você pode ter no máximo " + (envs+b) + " envios com atraso";
//              }
//            }
//          }
//        }
//        console.log($scope.msg_cncld);
//        console.log($scope.msg_dpt);
//        console.log($scope.msg_clm);
//        console.log($scope.msg_dl);
//      }
//      else {
//        $scope.total = r.transactions;
//        var cmenor = 1, cbi, cbk;
//        for (i=$scope.totalClaim; i<=$scope.total*r.claim; i++) {
//          for (k=i; i/k>=r.claim; k++) {}
//          if (Math.abs(r.claim - i/k) < cmenor) {
//            cmenor = Math.abs(r.claim - i/k);
//            cbi = i;
//            cbk = k;
//          }
//          if (Math.abs(r.claim - i/(k-1)) < cmenor) {
//            cmenor = Math.abs(r.claim - i/(k-1));
//            cbi = i;
//            cbk = k-1;
//          }
//        }
//        console.log ("cmenor: " + cmenor + "cbi: " + cbi + "cbk: " + cbk + " i/k: " + cbi/cbk);
//        var dmenor = 1, dbi, dbk;
//        for (i=$scope.totalDelay; i<=$scope.total * r.late; i++) {
//          for (k=i; i/k>=r.late; k++) {}
//          if (Math.abs(r.late - i/k) < dmenor) {
//            dmenor = Math.abs(r.late - i/k);
//            dbi = i;
//            dbk = k;
//          }
//          if (Math.abs(r.late -  i/(k-1)) < dmenor) {
//            dmenor = Math.abs(r.late - i/(k-1));
//            dbi = i;
//            dbk = k-1;
//          }
//        }
//        console.log ("dmenor: " + dmenor + "dbi: " + dbi + "dbk: " + dbk + " i/k: " + dbi/dbk);
//        $scope.labels.unshift("antes");
//        $scope.data[0].unshift(cbk - $scope.totalSale); //vendas
//        $scope.totalSale = cbk;
//        $scope.data[3].unshift(cbi - $scope.totalClaim); //reclamações
//        $scope.totalClaim = cbi;
//        $scope.data[4].unshift(dbi - $scope.totalDelay); //atrasos
//        $scope.totalDelay = dbi;
//        $scope.totalShipped = dbk;
//        if ($scope.reputation == '4_light_green') {
//          if ($scope.totalCanceled < $scope.total * 0.05) {
//            if (r.canceled >= $scope.total * 0.05) {
//              $scope.data[1].unshift(r.canceled - $scope.totalCanceled);
//              $scope.totalCanceled = r.canceled;
//              $scope.data[2].unshift(0);
//            }
//            else {
//              if ($scope.totalDispute < $scope.total * 0.05) {
//                var dspt = parseInt($scope.total * 0.05) + 1;
//                $scope.data[2].unshift(dspt - $scope.totalDispute);
//                $scope.totalDispute = dspt;
//              }
//              else {
//                $scope.data[2].unshift(0);
//              }
//              $scope.data[1].unshift(0);
//            }
//          }
//          else {
//            $scope.data[2].unshift(0);
//            $scope.data[1].unshift(0);
//          }
//        }
//        else {
//          if (r.canceled < $scope.total * 0.05) {
//            $scope.data[1].unshift(r.canceled - $scope.totalCanceled);
//            $scope.totalCanceled = r.canceled;
//          } else {
//            $scope.data[1].unshift(0);
//          }
//          $scope.data[2].unshift(0);
//        }
//        $scope.ok += $scope.data[0][0] - $scope.data[0][1] - $scope.data[0][2] - $scope.data[0][3] - $scope.data[0][4];
//      }
}
      $scope.totalHit = 0;
      $scope.ttl = {};
      $scope.show = {};
      $scope.style = {};
      $scope.limit = {};
      $scope.percent = {};
      $scope.limites = {};
      $scope.objetivo = {};
      $scope.progress = {};
      $scope.rep_limite = {};
      $scope.rcategorias = [];
      for (var ctgr in r.categorias) {
        $scope.rcategorias[r.categorias[ctgr]['indx']]=ctgr;
        $scope.ttl[ctgr] = r.total[ctgr];
        $scope.show[ctgr] = r.categorias[ctgr]['show'];
        $scope.percent[ctgr] = r.categorias[ctgr]['porcentagem'] * 100;
        $scope.style[ctgr]={'margin-left': 'calc('+(100-marginRight(r.categorias[ctgr]['limites'], ctgr, $scope.percent[ctgr]))+'% - 20px)'};
        $scope.progress[ctgr]={'width': getProgress(r.categorias[ctgr]['limites'], $scope.percent[ctgr])+'%', 'background-color': $scope.cores[r.categorias[ctgr]['limites'][r.categorias[ctgr]['limite']['index']]['cor']]['hex']};
        $scope.limit[ctgr]={'percent': (r.categorias[ctgr]['limites'][r.categorias[ctgr]['limite']['index']]['num']*100), 'num': r.categorias[ctgr]['limite']['num']};
        $scope.limites[ctgr]=r.categorias[ctgr]['limites'];
        $scope.rep_limite[ctgr]=r.categorias[ctgr]['limite'];
        $scope.objetivo[ctgr]=r.categorias[ctgr]['objetivo'];
        $scope.totalHit += r.total[ctgr];
      }
      $scope.total = r.ml_ttl;
      $scope.vendas_info = [r.ok, r.ml_ttl - r.ok];
      $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }];
      $scope.vendas_options = {
        maintainAspectRatio : false,
        legend: {
          display: true,
          position: 'bottom',
          onClick: function (e) {
            e.stopPropagation();
          },
          labels: {
            generateLabels: function(chart) {
              chart.legend.afterFit = function () {
                var width = this.width;
                this.lineWidths = this.lineWidths.map(function(){return width;});
              };
              var data = chart.data;
              if (data.labels.length && data.datasets.length) {
                return data.labels.map(function(label, i) {
                  return {
                    text: label + ": " + data.datasets[0].data[i],
                    fillStyle: data.datasets[0].backgroundColor[i],
                    hidden: isNaN(data.datasets[0].data[i]),
                    index: i
                  };
                });
              } else {
                  return [];
              }
            }
          }
        }
      };

      $scope.options = {
        maintainAspectRatio : false,
        elements: {
          line: {
            tension: 0
          }
        },
        legend: {
          display: true
        },
        scales: {
          yAxes: [
            {
              id: 'y-axis-1',
              type: 'linear',
              display: true,
              position: 'left',
              ticks: {
                beginAtZero: true,
                callback: function(value) {if (value % 1 === 0) {return value;}}
              }
            }
          ]
        }
      };

    }, function(error) {
      $mdToast.hide();
      NotificationService.error('Não foi possível atualizar o dashboard. Tente novamente ' +
        'mais tarde', error);
    }).finally(function() {
      self.refreshing = false;
    });
  };

  function marginRight (limites, categ, percent) {
    var lmt, soma;
    for (var k=0; k<limites.length; k++) {
      lmt = limites[k]['num'] * 100;
      if (percent <= lmt) {
        soma = 0;
        if (k>0) {
          lmt -= (limites[k-1]['num'] * 100);
          percent -= (limites[k-1]['num'] * 100);
          if (categ=="mediações" || categ=="canceladas") {
            soma = 20;
          }
          else {
            soma = 20*(k+1);
          }
        }
        return (percent/lmt*20+soma);
      }
    }
  }

  function marginRightClaim (percent) {
    if (percent < 5){
      return percent / 5 * 20;
    } else if (percent < 8) {
      return (percent-5) / 3 * 20 + 40;
    } else if (percent < 11) {
      return (percent-8) / 3 * 20 + 60;
    } else {
      return (percent-11) / 89 * 20 + 80;
    }
  }
  function marginRightDelay (percent) {
    if (percent < 20) {
      return percent / 20 * 20;
    } else if (percent < 30) {
      return (percent-20) / 10 * 20 + 40;
    } else if (percent < 60) {
      return (percent-30) / 30 * 20 + 60;
    } else {
      return (percent-60) / 40 * 20 + 80;
    }
  }
  function marginRightDispute (percent) {
    if (percent < 2) {
      return percent / 2 * 20;
    } else {
      return (percent-2) / 98 * 20 + 20;
    }
  }
  function marginRightCanceled (percent) {
    if (percent < 5) {
      return percent / 5 * 20;
    } else {
      return (percent-5) / 95 * 20 + 20;
    }
  }

  function getProgress (limites, percent) {
    var lmt, soma;
    for (var k=0; k<limites.length; k++) {
      lmt = limites[k]['num']*100;
      if (percent <= lmt) {
        soma = 0;
        if (k>0) {
          soma = limites[k-1]['num'] * 100;
        }
        return ((percent-soma)/lmt*100);
      }
    }
  }

  function claimProgress (percent) {
    if (percent < 5){
      return percent/5 * 100;
    } else if (percent < 8) {
      return ((percent-5) / 8)*100;
    } else if (percent < 11) {
      return ((percent-8) / 11)*100;
    } else {
      return (percent-11);
    }
  }
  function delayProgress (percent) {
    if (percent < 20) {
      return percent/20 * 100;
    } else if (percent < 30) {
      return (percent-20) / 30 * 100;
    } else if (percent < 60) {
      return ((percent-30) / 60) * 100;
    } else {
      return percent-60;
    }
  }
  function disputeProgress (percent) {
    if (percent < 2) {
      return percent * 50;
    } else {
      return percent-2;
    }
  }
  function canceledProgress (percent) {
    if (percent < 5) {
      return percent * 20;
    } else {
      return percent-5;
    }
  }

  $scope.percentLimitClaim = function (percent) {
    if (percent < 5){
      return 0.05;
    } else if (percent < 8) {
      return 0.08;
    } else if (percent < 11) {
      return 0.11;
    } else {
      return 1;
    }
  };
  $scope.percentLimitDelay = function (percent) {
    if (percent < 20) {
      return 0.2;
    } else if (percent < 30) {
      return 0.3;
    } else if (percent < 60) {
      return 0.6;
    } else {
      return 1;
    }
  };
  $scope.percentLimitDispute = function (percent) {
    if (percent < 2) {
      return 0.02;
    } else {
      return 1;
    }
  };
  $scope.percentLimitCanceled = function (percent) {
    if (percent < 5) {
      return 0.05;
    } else {
      return 1;
    }
  };
}
])

;
