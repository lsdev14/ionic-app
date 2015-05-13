angular.module('controlePresenca.controllers')

.controller('EmpresaDetailCtrl',['$scope','$stateParams','$state','$ionicHistory','Empresas','Util',function ($scope,$stateParams,$state,$ionicHistory,empresas,util) {

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
    }

}]);
