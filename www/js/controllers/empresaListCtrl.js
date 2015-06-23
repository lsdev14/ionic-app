angular.module('controlePresenca.controllers')

.controller('EmpresaListCtrl',['$scope','$ionicPopup','$http','Empresas','$firebaseStorage','$ionicLoading','Settings', function (
    $scope,
    $ionicPopup,
    $http,
    empresas,    
    $firebaseStorage,
    $ionicLoading,
    settings
    ) {

    $scope.filter = {};
    $scope.filter.startDate = moment(new Date()).startOf('month').toDate();
    $scope.filter.endDate = moment(new Date()).endOf('month').toDate();

    $scope.empresas = empresas.all();  

    $scope.clearEmpresa = function () {

        var confirmPopup = $ionicPopup.confirm({
            title: 'Aviso',
            template: 'Deseja remover todas as empresas?'
        });
        confirmPopup.then(function (res) {
            if (res) {
                console.log('Removendo todas empresas');
                
                _.forEach($scope.empresas,function (empresa) {

                    empresas.remove(empresa);

                });
                
                $scope.empresas = empresas.all();

            } else {
                console.log('Remover cancelado');
            }
        });
    }

    $scope.backupData = function () {

        var confirmPopup = $ionicPopup.confirm({
            title: 'Aviso',
            template: 'Deseja fazer uma copia de segurança?'
        });
        confirmPopup.then(function (res) {
            if (res) {

                $ionicLoading.show({
                    template: 'Salvando...'
                });

                console.log('Salvando json no Firebase');

                var backup = {
                    backupDate: moment(new Date()).format('YYYY-MM-DDThh:mm:ss'),
                    data: $scope.empresas
                }
                $firebaseStorage.set(backup);
                $ionicLoading.hide();

            } else {
                console.log('Copia de segurança cancelada');
            }
        });
    }
    
    function filterPeriod(empresa, startDate, endDate) {

        var period = angular.copy(empresa);

        period.calendario = [];
        period.calendario = _.filter(empresa.calendario,function (calendario) {

            if (calendario.concluida) {
                var date = moment(calendario.data).toDate(); //convert string to dateTime
                return date >= $scope.filter.startDate && date <= $scope.filter.endDate
            }
            else {
                return false;
            }
        });

        _.forEach( period.calendario,function (calendario) {
            calendario.data = moment(calendario.data).format('YYYY-MM-DD');
        });

        return period;
    }

    $scope.relatModal = function (empresa) {

        var filterDatePopup = $ionicPopup.show({
            template: 'De: <label class="item item-input">' +
                      '<input type="date" data-ng-model="filter.startDate" placeholder="Data"></label>' + 
                      'Até: <label class="item item-input">' + 
                      '<input type="date" data-ng-model="filter.endDate" placeholder="Data"></label>',
            title: 'Relatório de presença',            
            scope: $scope,
            buttons: [
              {
                  text: 'Cancelar',
                  onTap: function (e) {
                      return false;
                  }
              },
              {
                  text: '<b>Ok</b>',
                  type: 'button-positive',
                  onTap: function (e) {
                      
                      if ($scope.filter.endDate < $scope.filter.startDate) {
                          var helpPopup = $ionicPopup.alert({
                              title: 'Aviso',
                              template: "Data final deve ser maior que inicial"
                          });
                          helpPopup.then(function (res) {
                              console.log(res);
                          });
                          e.preventDefault();

                      } else {
                          return true;
                      }
                  }
              },
            ]
        });
        filterDatePopup.then(function(res) {

            if (res) {
                console.log($scope.filter.startDate);
                console.log($scope.filter.endDate);

                settingsData = settings.all();
                if (settingsData.length == 0 || !settingsData[0].reportEmail) {

                    var helpPopup = $ionicPopup.alert({
                        title: 'Aviso',
                        template: 'Configure o email para envio do relatório'
                    });
                    helpPopup.then(function (res) {
                        console.log(res);
                    });

                    return false;
                }
                

                $ionicLoading.show({
                    template: 'Gerando relatório...'
                });

                var period = filterPeriod(empresa);
                period.emailPDF = settingsData[0].reportEmail;
                period.De = moment($scope.filter.startDate).format('YYYY-MM-DD');
                period.Ate = moment($scope.filter.endDate).format('YYYY-MM-DD');

                console.log(JSON.stringify(period));

                if (period.calendario.length == 0) {

                    $ionicLoading.hide();
                    var helpPopup = $ionicPopup.alert({
                        title: 'Aviso',
                        template: 'Não existe presença no período informado'                                  
                    });
                    helpPopup.then(function (res) {
                        console.log(res);                        
                    });

                    return false;
                }


                $http.post(
                    'http://apirelatorio.ssvsistemas.com.br/api/relatoriopresenca/post',
                    JSON.stringify(period),
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                ).success(function (data) {
                    $ionicLoading.hide();
                    var helpPopup = $ionicPopup.alert({
                        title: 'Aviso',
                        template: data ? 'Email enviado com sucesso para ' + settingsData[0].reportEmail : 'Não foi possível enviar o email para ' + settingsData[0].reportEmail
                    });
                    helpPopup.then(function (res) {
                        console.log(res);
                    });
                }).error(function (data,status,headers,config) {
                    $ionicLoading.hide();
                    var helpPopup = $ionicPopup.alert({
                        title: 'Aviso',
                        template: "Não foi possível gerar o relatório<br/>Verifique a conexão com a internet <br/>Erro: " + data
                    });
                    helpPopup.then(function (res) {
                        console.log(res);
                    });
                });
            }
        });       
    };

    //#region Envio de pdf através do email do celular - não finalizada
    //$scope.relatModal = function (empresa) {
    //    var confirmPopup = $ionicPopup.confirm({
    //        title: 'Relatório de presença',
    //        template: 'De: <label class="item item-input"><input type="date" placeholder="Data"></label> Até: <label class="item item-input"><input type="date" placeholder="Data"></label>'
    //    });
    //    confirmPopup.then(function (res) {
    //        if (res) {
                
    //            $ionicLoading.show({
    //                template: 'Gerando relatório...'
    //            });

    //            console.log(JSON.stringify(empresa));
    //            $http.post(
    //                'http://apirelatorio.ssvsistemas.com.br/api/relatoriopresenca/post',
    //                JSON.stringify(empresa),
    //                {
    //                    headers: {
    //                        'Content-Type': 'application/json'
    //                    },
    //                    responseType:'arraybuffer'
    //                }
    //            ).success(function (data) {

    //                var blob = null;
    //                var type = "";

    //                //data = "base64:relatorio.pdf//" + data;

    //                try {
    //                    blob = new Blob([data],{ type: "application/pdf" });
    //                    type ="case 1";
    //                }
    //                catch (e) {
    //                    window.BlobBuilder = window.BlobBuilder ||
    //                                                         window.WebKitBlobBuilder ||
    //                                                         window.MozBlobBuilder ||
    //                                                         window.MSBlobBuilder;
    //                    if (e.name == 'TypeError' && window.BlobBuilder) {
    //                        var bb = new BlobBuilder();
    //                        bb.append(data);
    //                        blob = bb.getBlob("application/pdf");
    //                        type = "case 2";
    //                    }
    //                    else if (e.name == "InvalidStateError") {
    //                        // InvalidStateError (tested on FF13 WinXP)
    //                        blob = new Blob([data],{ type: "application/pdf" });
    //                        type ="case 3";
    //                    }
    //                    else {
    //                        // We're screwed, blob constructor unsupported entirely
    //                        type ="Errore";
    //                    }
    //                }

    //                var helpPopup = $ionicPopup.alert({
    //                        title: 'Ajuda',
    //                        template: type
    //                    });
    //                helpPopup.then(function (res) {
    //                    console.log(res);
    //                });

    //                var url = null;


    //                try {

    //                    //console.log(data);
    //                    console.log(true);
    //                    $ionicLoading.hide();

    //                    //var file = new Blob([data],{ type: 'application/pdf' });
                        
    //                    if ( window.webkitURL ) {
    //                        url = window.webkitURL.createObjectURL(blob);
    //                    } else if (window.URL && window.URL.createObjectURL) {
    //                        url = window.URL.createObjectURL(blob);
    //                    }

    //                    //url = url.replace('blob:','');

    //                    var helpPopup = $ionicPopup.alert({
    //                        title: 'Ajuda',
    //                        template: url
    //                    });
    //                    helpPopup.then(function (res) {
    //                        console.log(res);
    //                    });


    //                    //var fileURL = windows.URL.createObjectURL(blob);
    //                    //$scope.content = $sce.trustAsResourceUrl(fileURL);
    //                    window.open(url);

    //                    cordova.plugins.email.open({
    //                        to: empresa.email,
    //                        subject: 'Relatório de presença - De: Até:',
    //                        body: 'Em anexo segue arquivo com a lista de presença',
    //                        attachments: url
    //                    });
    //                }
    //                catch (ex) {

    //                    helpPopup = $ionicPopup.alert({
    //                        title: 'Ajuda',
    //                        template: ex
    //                    });
    //                    helpPopup.then(function (res) {
    //                        console.log(res);
    //                    });

    //                }
    //            });
    //        }
    //    });
    //};
    //#endregion

}])
