angular.module('controlePresenca.controllers')

.controller('SobreCtrl',['$scope','$ionicPopup','$ionicSideMenuDelegate','Settings','Util',
    function ($scope,$ionicPopup,$ionicSideMenuDelegate,settings,util) {

    console.log('about screen');
    
    $scope.build = '0.6';
    $scope.dateRelease = '02/02/2018';
    $scope.emailContact = 'net.leandro@gmail.com';
    $scope.website = 'http://ssvsistemas.com.br';

    $scope.showSettings = function () {
        console.log('settings screen click');

        var settingsData = settings.all();        
        if (settingsData.length == 0) {
            $scope.setting = {
                codigo: util.guid(),
                reportEmail: ""
            };
        }
        else {
            $scope.setting = settingsData[0];
        }

        var reportEmailPopup = $ionicPopup.show({
            template: 'Email para envio do relatório: <label class="item item-input">' +
                      '<input type="email" data-ng-model="setting.reportEmail" required placeholder="Email"></label>',
            title: 'Configurações',            
            scope: $scope,
            buttons: [
              {
                  text: 'Cancelar',
                  onTap: function (e) {
                      return false;
                  }
              },
              {
                  text: '<b>Salvar</b>',
                  type: 'button-positive',
                  onTap: function (e) {
                      
                      if (!$scope.setting.reportEmail) {
                          var helpPopup = $ionicPopup.alert({
                              title: 'Aviso',
                              template: "Informe um email válido"
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
        reportEmailPopup.then(function (res) {

            if (res) {
                settings.set($scope.setting);
            }
        });


        $ionicSideMenuDelegate.toggleLeft();

    }

    $scope.showAbout = function () {
        console.log('about screen click');

        var aboutPopup = $ionicPopup.alert({
            title: 'Controle de Presença',
            scope: $scope,
            template: '<b>Versão:</b> {{build}} <br/>' +
                      '<b>Data:</b> {{dateRelease}} <br/>' +
                      '<b>Email:</b> <a href="mailto:{{emailContact}}?Subject=Controle de Presença" target="_blank">{{emailContact}}</a><br/>'// +
                      //'<b>Site:</b> <a href="{{website}}" target="_blank"> {{website}}</a> <br/>'
                        
        });
        aboutPopup.then(function (res) {
            console.log(res);
        });

        $ionicSideMenuDelegate.toggleLeft();

    }

}])
