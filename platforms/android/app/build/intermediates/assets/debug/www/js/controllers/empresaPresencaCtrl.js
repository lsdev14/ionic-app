angular.module('controlePresenca.controllers')

.controller('EmpresaPresencaCtrl',['$scope','$stateParams','$state','$ionicPopup','Empresas','Util','$ionicHistory',function (
    $scope,$stateParams,$state,$ionicPopup,empresas,util,$ionicHistory) {

    console.log('empresa presenca: ' + $stateParams.empresaCodigo + ' - ' + $stateParams.data );
    $scope.empresa = empresas.get($stateParams.empresaCodigo);
    $scope.data = $stateParams.data;

    $scope.evento = _.find($scope.empresa.calendario,{ data: $stateParams.data });


    $scope.salvar = function () {
        $scope.evento.concluida = true;
        empresas.set($scope.empresa);        
        $ionicHistory.goBack();
    }

    $scope.status = function (functionario,status) {
        functionario.status = status;
    }

    $scope.help = function () {

        var helpPopup = $ionicPopup.alert({
            title: 'Ajuda',
            template: '<img src="./img/presenca-help.jpg" style="padding-left: 13px;"/>'
        });
        helpPopup.then(function (res) {
            console.log(res);
        });
    }

}]);
