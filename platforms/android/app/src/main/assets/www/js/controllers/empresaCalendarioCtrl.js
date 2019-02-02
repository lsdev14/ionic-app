angular.module('controlePresenca.controllers')

.controller('EmpresaCalendarioCtrl',['$scope','$stateParams','$state','$ionicPopup','Empresas','Util',function (
    $scope,$stateParams,$state,$ionicPopup,empresas,util) {

    $scope.calendario = {
        data: new Date()
    };

    $scope.dataConcluida = false;

    Date.prototype.addDays = function (days) {
        var dat = new Date(this.valueOf());
        dat.setDate(dat.getDate() + days);
        return dat;
    }

    console.log('empresa calendario: ' + $stateParams.empresaCodigo);
    $scope.empresa = empresas.get($stateParams.empresaCodigo);

    $scope.salvar = function (voltar) {
        empresas.set($scope.empresa);

        if (voltar) {
            $state.go('tab.empresas');
        }
        //$state.go($state.current,{},{ reload: true });

        //$window.location.reload(true);
        //$location.path('/');
    }

    $scope.addCalendario = function () {

        if (!$scope.empresa.calendario) {
            $scope.empresa.calendario = [];
        }

        var date = moment($scope.calendario.data).format('YYYY-MM-DDT00:00:00Z');
        if (_.find($scope.empresa.calendario,{ data: date }) === undefined) {
            var evento = {
                data: date,                
                concluida: false,
                listaPresenca: []
            }

            if ($scope.empresa.funcionarios === undefined || $scope.empresa.funcionarios.lenght == 0) {

                var msg = 'Cadastre funcionários para empresa ' + $scope.empresa.nome + '!';
                var alertPopup = $ionicPopup.alert({
                    title: 'Aviso',
                    template: msg
                });
                alertPopup.then(function (res) {
                    console.log(msg);
                });

            }
            else {
                _.forEach($scope.empresa.funcionarios,function (funcionario) {
                    evento.listaPresenca.push({
                        funcionarioCodigo: funcionario.codigo,
                        funcionarioNome: funcionario.nome,
                        status: 'Presente'
                    });
                });

                $scope.empresa.calendario.push(evento);
                $scope.salvar(false);

                $scope.calendario.data = $scope.calendario.data.addDays(1);
            }
        }
        else {


            var msg = 'A data ' + moment($scope.calendario.data).format('DD-MM-YYYY') + ' já esta cadastrada para empresa ' + $scope.empresa.nome;
            var alertPopup = $ionicPopup.alert({
                title: 'Aviso',
                template: msg
            });
            alertPopup.then(function (res) {
                console.log(msg);
            });

            //alert("A data " + date + " já esta cadastrada para empresa " + $scope.empresa.nome);
        }
    }

    $scope.remover = function (evento) {

        var confirmPopup = $ionicPopup.confirm({
            title: 'Aviso',
            template: 'Deseja remover a data ' +  moment(evento.data).format('DD-MM-YYYY')  + '?'
        });
        confirmPopup.then(function (res) {
            if (res) {
                console.log('Removendo data ' + evento.data);
                _.remove($scope.empresa.calendario,{ data: evento.data });

                $scope.salvar(false);

            } else {
                console.log('Remover cancelado');
            }
        });        
    }

}]);
