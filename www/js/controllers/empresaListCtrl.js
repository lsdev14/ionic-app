angular.module('controlePresenca.controllers')

.controller('EmpresaListCtrl',['$scope','$ionicPopup','$http','Empresas','$firebaseStorage','$ionicLoading', function (
    $scope,
    $ionicPopup,
    $http,
    empresas,    
    $firebaseStorage,
    $ionicLoading
    ) {

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
                console.log('Salvando json no Firebase');

                var backup = {
                    backupDate: moment(new Date()).format('YYYY-MM-DDThh:mm:ss'),
                    data: $scope.empresas
                }
                $firebaseStorage.set(backup);

            } else {
                console.log('Copia de segurança cancelada');
            }
        });
    }
    
    $scope.relatModal = function (empresa) {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Relatório de presença',
            template: 'De: <label class="item item-input"><input type="date" placeholder="Data"></label> Até: <label class="item item-input"><input type="date" placeholder="Data"></label>'
        });
        confirmPopup.then(function (res) {
            if (res) {
                
                $ionicLoading.show({
                    template: 'Gerando relatório...'
                });

                console.log(JSON.stringify(empresa));
                $http.post(
                    'http://apirelatorio.ssvsistemas.com.br/api/relatoriopresenca/post',
                    JSON.stringify(empresa),
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        responseType:'arraybuffer'
                    }
                ).success(function (data) {

                    var blob = null;
                    var type = "";

                    try {
                        blob = new Blob([data],{ type: "application/pdf" });
                        type ="case 1";
                    }
                    catch (e) {
                        window.BlobBuilder = window.BlobBuilder ||
                                                             window.WebKitBlobBuilder ||
                                                             window.MozBlobBuilder ||
                                                             window.MSBlobBuilder;
                        if (e.name == 'TypeError' && window.BlobBuilder) {
                            var bb = new BlobBuilder();
                            bb.append(data);
                            blob = bb.getBlob("application/pdf");
                            type = "case 2";
                        }
                        else if (e.name == "InvalidStateError") {
                            // InvalidStateError (tested on FF13 WinXP)
                            blob = new Blob([data],{ type: "application/pdf" });
                            type ="case 3";
                        }
                        else {
                            // We're screwed, blob constructor unsupported entirely
                            type ="Errore";
                        }
                    }

                    var helpPopup = $ionicPopup.alert({
                            title: 'Ajuda',
                            template: type
                        });
                    helpPopup.then(function (res) {
                        console.log(res);
                    });

                    var url;


                    try {

                        //console.log(data);
                        console.log(true);
                        $ionicLoading.hide();

                        //var file = new Blob([data],{ type: 'application/pdf' });
                        
                        if ( window.webkitURL ) {
                            url = window.webkitURL.createObjectURL(blob);
                        } else if (window.URL && window.URL.createObjectURL) {
                            url = window.URL.createObjectURL(blob);
                        }

                        helpPopup = $ionicPopup.alert({
                            title: 'Ajuda',
                            template: url
                        });
                        helpPopup.then(function (res) {
                            console.log(res);
                        });


                        //var fileURL = windows.URL.createObjectURL(blob);

                        //$scope.content = $sce.trustAsResourceUrl(fileURL);

                        cordova.plugins.email.open({
                            to: empresa.email,
                            subject: 'Relatório de presença - De: Até:',
                            body: 'Em anexo segue arquivo com a lista de presença',
                            attachments: url
                        });
                    }
                    catch (ex) {

                        helpPopup = $ionicPopup.alert({
                            title: 'Ajuda',
                            template: ex
                        });
                        helpPopup.then(function (res) {
                            console.log(res);
                        });

                    }
                });
            }
        });
    };

}])
