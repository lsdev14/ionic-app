angular.module('controlePresenca.controllers')

.controller('SobreCtrl', ['$scope','$ionicPopup', '$ionicSideMenuDelegate',  function ($scope, $ionicPopup,$ionicSideMenuDelegate) {

    console.log('about screen');
    
    $scope.build = '1.0';
    $scope.dateRelease = '31/05/2015';
    $scope.emailContact = 'contato@ssvsistemas.com.br';
    $scope.website = 'http://ssvsistemas.com.br';

    $scope.showAbout = function () {
        console.log('about screen click');

        var aboutPopup = $ionicPopup.alert({
            title: 'Controle de Presença',
            scope: $scope,
            template: '<b>Versão:</b> {{build}} <br/>' +
                      '<b>Data:</b> {{dateRelease}} <br/>' +
                      '<b>Email:</b> <a href="mailto:{{emailContact}}?Subject=Controle de Presença" target="_blank">{{emailContact}}</a><br/>' +
                      '<b>Site:</b> <a href="{{website}}" target="_blank"> {{website}}</a> <br/>'
                        
        });
        aboutPopup.then(function (res) {
            console.log(res);
        });

        $ionicSideMenuDelegate.toggleLeft();

    }

}])
