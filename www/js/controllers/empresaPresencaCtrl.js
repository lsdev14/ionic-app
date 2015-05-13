angular.module('controlePresenca.controllers')

.controller('EmpresaPresencaCtrl',['$scope','$stateParams','$state','$ionicPopup','Empresas','Util',function (
    $scope,$stateParams,$state,$ionicPopup,empresas,util) {

    console.log('empresa presenca: ' + $stateParams.empresaCodigo + ' - ' + $stateParams.data );
    $scope.empresa = empresas.get($stateParams.empresaCodigo);
    $scope.data = $stateParams.data;

    $scope.evento = _.find($scope.empresa.calendario,{ data: $stateParams.data });


    $scope.salvar = function () {
        empresas.set($scope.empresa);
        $state.go('tab.empresas');
        //$state.go($state.current,{},{ reload: true });

        //$window.location.reload(true);
        //$location.path('/');
    }

    $scope.status = function (functionario,status) {

        functionario.status = status;
        $scope.evento.concluida = true;

    }

}]);
