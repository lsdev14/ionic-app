angular.module('controlePresenca.controllers')

.controller('EmpresaListCtrl',['$scope','$ionicPopup','$http','$cordovaEmailComposer', '$ionicPlatform', 'Empresas',
    function ($scope,$ionicPopup,$http, $cordovaEmailComposer, $ionicPlatform, empresas) {

        //$ionicPlatform.ready(function () {

        //    $cordovaEmailComposer.isAvailable().then(function () {
        //        alert('isAvailable');
        //    },function () {
        //        alert('not available');
        //    });
        //});

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


    $scope.shouldShowOption = true;
    $scope.edit = function (empresa) {
        console.log(empresa);
    };
    
    $scope.relatModal = function () {

        try {

            $cordovaEmailComposer.isAvailable().then(function () {
                alert('isAvailable');
            },function () {
                alert('not available');
            });


            cordova.plugins.email.open({
                to: 'teste@teste.com',
                cc: 'teste@teste.com',
                bcc: ['teste@teste.com','teste@teste.com'],
                subject: 'Assunto de teste',
                body: 'Teste email no device'
            });
        }
        catch (e) {    

            var alertPopup = $ionicPopup.alert({
                title: 'Aviso',
                template: e
            });
            alertPopup.then(function (res) {
                console.log(msg);
            });

        }

        return;

        var confirmPopup = $ionicPopup.confirm({
            title: 'Relatório de presença',
            template: 'De: <label class="item item-input"><input type="date" placeholder="Data" autofocus></label> Até: <label class="item item-input"><input type="date" placeholder="Data" autofocus></label>'
        });
        confirmPopup.then(function (res) {
            if (res) {
                var data = {
                    "codigo": 1,
                    "nome": "Empresa S/A",
                    "telefone": "9999",
                    "email": "contato@empresa.com.br",
                    "endereco": "Rua da empresa, nº 4566",
                    "funcionarios": [
                        {
                            "codigo": 1,
                            "nome": "Leandro"
                        },
                        {
                            "codigo": 2,
                            "nome": "Daniel"
                        }
                    ],
                    "calendario": [
                        {
                            "data": "2015-03-29 10:30:00",
                            "listaPresenca": [
                                {
                                    "funcionarioCodigo": 1,
                                    "status": "Presente"
                                },
                                {
                                    "funcionarioCodigo": 2,
                                    "status": "Ferias"
                                }
                            ]

                        },
                        {
                            "data": "2015-03-31 10:30:00",
                            "listaPresenca": [
                                {
                                    "funcionarioCodigo": 1,
                                    "status": "Presente"
                                },
                                {
                                    "funcionarioCodigo": 2,
                                    "status": "Presente"
                                }
                            ]

                        }
                    ]
                };
                $http.post(
                    'http://apirelatorio.ssvsistemas.com.br/api/relatoriopresenca',
                    JSON.stringify(data),
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                ).success(function (data) {
                    $scope.person = data;
                    console.log(data);

                    cordova.plugins.email.open({
                        to: 'teste@teste.com',
                        cc: 'teste@teste.com',
                        bcc: ['teste@teste.com','teste@teste.com'],
                        subject: 'Assunto de teste',
                        body: 'Teste email no device'
                    });
                });
            }
        });
    };

}])
