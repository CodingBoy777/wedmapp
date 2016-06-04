angular.module('ionicApp', ['ionicApp.mainCtrl', 'ionicApp.HomeTabCtrl', 'ionicApp.prepareCtrl','ionicApp.processCtrl',
  'ionicApp.filesCtrl', 'ionicApp.fileModalCtrl','ionicApp.ipSettingCtrl','ionicApp.speedSettingCtrl',
  'ionicApp.testCtrl','ionicApp.checkCtrl', 'ionic', 'ngCordova', 'ng-mfb', 'ionicApp.services', 'ionicApp.directives'])
  .run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
    });
  })

  .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

    $ionicConfigProvider.tabs.style('standard'); // Tab风格
    $ionicConfigProvider.tabs.position('bottom'); // Tab位置
    $ionicConfigProvider.navBar.alignTitle('center'); // 标题位置
    $ionicConfigProvider.navBar.positionPrimaryButtons('left'); // 主要操作按钮位置
    $ionicConfigProvider.navBar.positionSecondaryButtons('right'); //次要操作按钮位置

    $stateProvider
      .state('app', {
        url: "/app",
        abstract: true,
        templateUrl: "templates/menu.html"
      })
      .state('app.tabs', {
        url: "/tabs",
        views: {
          'menuContent': {
            templateUrl: "templates/tabs.html"
            //controller: 'HomeTabCtrl'
          }
        }
      })
      .state('app.ipSetting', {
        url: "/ipSetting",
        views: {
          'menuContent': {
            templateUrl: "templates/ipSetting.html",
            controller: 'ipSettingCtrl'
          }
        }
      })
      .state('app.speedSetting', {
        url: "/speedSetting",
        views: {
          'menuContent': {
            templateUrl: "templates/speedSetting.html",
            controller: 'speedSettingCtrl'
          }
        }
      })

      .state('app.tabs.home', {
        url: "/home",
        views: {
          'home-tab': {
            templateUrl: "templates/home.html",
            controller: 'HomeTabCtrl'
          }
        }
      })
      .state('app.tabs.prepare', {
        url: "/prepare",
        views: {
          'prepare-tab': {
            templateUrl: "templates/prepare.html",
            controller: 'prepareCtrl'
          }
        }
      })



      .state('app.tabs.files', {
        url: "/files",
        views: {
          'files-tab': {
            templateUrl: "templates/files.html",
            controller: 'filesCtrl'
          }
        }
      })

      .state('app.tabs.process', {
        url: "/process",
        views: {
          'process-tab': {
            templateUrl: "templates/process.html",
            controller: 'processCtrl'
          }
        }
      })




      .state('app.events', {
        url: "/event",
        abstract: true,
        templateUrl: "templates/events.html"
      })




      .state('app.events.fileModal', {
        cache: false,
        url: "/fileModal",
        views: {
          'fileModal-event': {
            templateUrl: "templates/fileModal.html",
            controller: 'fileModalCtrl'
          }
        }
      });

    $urlRouterProvider.otherwise("/app/tabs/home");

  });
