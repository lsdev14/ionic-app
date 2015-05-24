angular.module('controlePresenca.controllers')

.controller('EmpresaListCtrl',['$scope','$ionicPopup','$http','Empresas','$firebaseStorage',function (
    $scope,
    $ionicPopup,
    $http,
    empresas,    
    $firebaseStorage) {

    $scope.empresas = empresas.all();  
    
    
    //if ($scope.empresas.length == 0) {
    //    //quando vazio adiciona empresa teste        
    //    var empresa =
    //        {
    //            "codigo": 1,
    //            "nome": "Empresa S/A",
    //            "telefone": "9999",
    //            "email": "contato@empresa.com.br",
    //            "endereco": "Rua da empresa, nº 4566",
    //            "funcionarios": [
    //                {
    //                    "codigo": 1,
    //                    "nome": "Leandro"
    //                },
    //                {
    //                    "codigo": 2,
    //                    "nome": "Daniel"
    //                }
    //            ],
    //            "calendario": [
    //                {
    //                    "data": "2015-03-29 10:30:00",
    //                    "listaPresenca": [
    //                        {
    //                            "funcionarioCodigo": 1,
    //                            "status": "Presente"
    //                        },
    //                        {
    //                            "funcionarioCodigo": 2,
    //                            "status": "Ferias"
    //                        }
    //                    ]

    //                },
    //                {
    //                    "data": "2015-03-31 10:30:00",
    //                    "listaPresenca": [
    //                        {
    //                            "funcionarioCodigo": 1,
    //                            "status": "Presente"
    //                        },
    //                        {
    //                            "funcionarioCodigo": 2,
    //                            "status": "Presente"
    //                        }
    //                    ]

    //                }
    //            ]
    //        };

    //    for (var i = 1;i <= 2;i++) {

    //        empresa.codigo = i;
    //        empresa.nome = "Empresa " + i + " S/A";

    //        empresas.set(empresa);
    //        $scope.empresas.push(angular.copy(empresa));
    //    }
    //}

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
                
                console.log(JSON.stringify(empresa));
                $http.post(
                    'http://apirelatorio.ssvsistemas.com.br/api/relatoriopresenca/post',
                    JSON.stringify(empresa),
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                ).success(function (data) {
                    
                    //console.log(data);
                    console.log(data);

                    cordova.plugins.email.open({
                        to: empresa.email,
                        subject: 'Relatório de presença - De: Até:',
                        body: 'Em anexo segue arquivo com a lista de presença',
                        attachments:"base64:pdf//" + data
                    });
                });
            }
        });
    };

}])
