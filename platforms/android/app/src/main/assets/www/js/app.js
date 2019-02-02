// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'controlePresenca' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'controlePresenca.services' is found in services.js
// 'controlePresenca.controllers' is found in controllers.js
angular.module('controlePresenca.controllers',[]);
angular.module('controlePresenca.services',[]);
angular.module('controlePresenca.directives',[]);

angular.module('controlePresenca',[
    'ionic',
    'ionic.utils',
    'controlePresenca.controllers',
    'controlePresenca.services',
    'controlePresenca.directives',
    'xeditable',
    'firebase'
])
.run(function($ionicPlatform,$rootScope, $ionicHistory, editableOptions) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });

  //$ionicHistory.nextViewOptions({
  //    disableAnimate: true,
  //    disableBack: true
  //});

  $rootScope.$on('$stateChangeStart',function (event,toState,toParams,fromState,fromParams) {
      $ionicHistory.clearCache();
      //$ionicHistory.clearHistory();
  });

    //editableOptions.theme = 'bs2'; // bootstrap3 theme. Can be also 'bs2', 'default'
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
    $stateProvider

    // setup an abstract state for the tabs directive
  .state('tab',{
      url: "/tab",
      abstract: true,
      templateUrl: "templates/tabs.html"
  })

    // Each tab has its own nav history stack:

  .state('tab.empresas',{
      url: '/empresas',
      views: {
          'tab-empresa-list': {
              templateUrl: 'templates/tab-empresa-list.html',
              controller: 'EmpresaListCtrl'
          }
      }
  })
  .state('tab.empresa-detail',{
      url: '/detail/:empresaCodigo',
      views: {
          'tab-empresa-list': {
              templateUrl: 'templates/empresa-detail.html',
              controller: 'EmpresaDetailCtrl'
          }
      }
  })
  .state('tab.empresa-calendario',{
      url: '/calendario/:empresaCodigo',
      views: {
          'tab-empresa-list': {
              templateUrl: 'templates/empresa-calendario.html',
              controller: 'EmpresaCalendarioCtrl'
          }
      }
  })
  .state('tab.empresa-presenca',{
      url: '/presenca/:empresaCodigo/:data',
      views: {
          'tab-empresa-list': {
              templateUrl: 'templates/empresa-presenca.html',
              controller: 'EmpresaPresencaCtrl'
          }
      }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/empresas');

});
