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

    function showAlert(message){
        console.log(message);
        $ionicLoading.hide();
        var helpPopup = $ionicPopup.alert({
            title: 'Aviso',
            template: message
        });
        helpPopup.then(function (res) {
            console.log(res);                        
        });
    }

    $scope.removeEmpresa = function (empresa) {

        var confirmPopup = $ionicPopup.confirm({
            title: 'Aviso',
            template: 'Deseja remover empresa ' + empresa.nome + '?'
        });
        confirmPopup.then(function (res) {
            if (res) {

                confirmPopup = $ionicPopup.confirm({
                    title: 'Aviso',
                    template: 'Todos os funcionarios e presenças da empresa ' + empresa.nome + ' serão removidos, confirma?'
                });
                confirmPopup.then(function (res2) {
                    if (res2) {
                        console.log('Removendo empresa ' + empresa.nome);
                        empresas.remove(empresa);
                        $scope.empresas = empresas.all();
                    }
                });
            } else {
                console.log('Remover cancelado');
            }
        });
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

                $ionicLoading.show({
                    template: 'Gerando relatório...'
                });

                var period = filterPeriod(empresa);                
                period.De = moment($scope.filter.startDate).format('YYYY-MM-DD');
                period.Ate = moment($scope.filter.endDate).format('YYYY-MM-DD');

                console.log(JSON.stringify(period));

                if (period.calendario.length == 0) {
                    showAlert('Não existe presença no período informado');
                    return false;
                }

                $http.post(
                    'http://controlepresenca.herokuapp.com/relatorio',
                    JSON.stringify(period),
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        responseType: 'blob'
                    }
                ).success(function (data) {
                    //console.log(data);

                    try {
                        var blob = new Blob([data], {
                            type: 'application/pdf'
                        });
                        var folderpath = window.cordova.file.externalRootDirectory;
                        var fileName = empresa.nome.replace(/\s/g, '').toLowerCase() + '-' + moment($scope.filter.startDate).format('MMMM-YYYY').toLowerCase() + '.pdf';
                        var finalPath = folderpath + fileName;

                        window.resolveLocalFileSystemURL(folderpath, function (dir) {
                            dir.getFile(fileName, {
                                create: true
                            }, function (file) {
                                file.createWriter(function (fileWriter) {
                                    fileWriter.write(blob);
                                    window.cordova.plugins.fileOpener2.open(finalPath,'application/pdf', {
                                        error: function (e) {                                                
                                            showAlert('Não foi possível gerar o relatório<br/>.' + 'Error status: ' + e.status + ' - Error message: ' + e.message);
                                        },
                                        success: function () {
                                            console.log('file opened successfully');
                                            $ionicLoading.hide();
                                        }
                                    });
                                }, function () {
                                    showAlert('Não foi possível gerar o relatório<br/>. Permissão negada para salvar o arquivo ' + finalPath);
                                });
                            });
                        });

                    } catch (error) {
                        showAlert('Não foi possível gerar o relatório<br/>. Error status: ' + e.status + ' - Error message: ' + e.message);
                    }
                }).error(function (data,status,headers,config) {
                    showAlert('Não foi possível gerar o relatório<br/>Verifique a conexão com a internet <br/>Erro: ' + status + ' - ' + data);
                });
            }
        });       
    };  

}])
