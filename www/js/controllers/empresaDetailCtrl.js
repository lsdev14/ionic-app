angular.module('controlePresenca.controllers')

.controller('EmpresaDetailCtrl',['$scope','$ionicPopup','$stateParams','$state','$window','$timeout','$ionicHistory','Empresas','Util',function ($scope,$ionicPopup,$stateParams,$state,$window,$timeout,$ionicHistory,empresas,util) {

    $scope.form = {};
    $scope.edit = true;
    $scope.funcionario = {
        nome: ''
    };

    if ($stateParams.empresaCodigo === 'new') {
        $scope.edit = false;
        $scope.empresa = {
            codigo: util.guid(),
            nome: ""
        }
    }

    if ($scope.edit) {
        console.log('empresa detail: ' + $stateParams.empresaCodigo);
        $scope.empresa = empresas.get($stateParams.empresaCodigo);
    }

    $scope.salvar = function () {
        empresas.set($scope.empresa);
        $state.go('tab.empresas');        
        //$state.go($state.current,{},{ reload: true });

        //$window.location.reload(true);
        //$location.path('/');
    }

    $scope.addFuncionario = function () {

        if (!$scope.empresa.funcionarios) {
            $scope.empresa.funcionarios = [];
        }

        var funcionario = {
            codigo: util.guid(),
            nome: $scope.funcionario.nome
        }

        $scope.empresa.funcionarios.push(funcionario);
        $scope.funcionario.nome = "";
        
        $timeout(function() {
            var element = $window.document.getElementById('funcionarioNome');
            if (element)
                element.focus();
        }, 100)
        
    }

    $scope.removeFuncionario = function (funcionario){
        var confirmPopup = $ionicPopup.confirm({
            title: 'Aviso',
            template: 'Deseja remover o funcionário ' + funcionario.nome  + '?'
        });
        confirmPopup.then(function (res) {
            if (res) {
                console.log('Removendo funcionario:' + funcionario.nome);
                $scope.empresa.funcionarios.splice($scope.empresa.funcionarios.indexOf(funcionario), 1);

            } else {
                console.log('Remover cancelado');
            }
        });
    }

}]);
