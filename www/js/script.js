angular.module('ionicApp', ['ionic',  'ionicApp.controllers','ionicApp.services'])

  .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

    $ionicConfigProvider.tabs.style('standard'); // Tab风格
    $ionicConfigProvider.tabs.position('bottom'); // Tab位置
    $ionicConfigProvider.navBar.alignTitle('center'); // 标题位置
    $ionicConfigProvider.navBar.positionPrimaryButtons('left'); // 主要操作按钮位置
    $ionicConfigProvider.navBar.positionSecondaryButtons('right'); //次要操作按钮位置

    $stateProvider
      .state('tabs', {
        url: "/tab",
        abstract: true,
        templateUrl: "templates/tabs.html"
      })

      .state('tabs.home', {
        url: "/home",
        views: {
          'home-tab': {
            templateUrl: "templates/home.html",
            controller: 'HomeTabCtrl'
          }
        }
      })

      .state('tabs.facts', {
        url: "/facts",
        views: {
          'home-tab': {
            templateUrl: "templates/facts.html"
          }
        }
      })



      .state('tabs.prepare', {
        url: "/prepare",
        views: {
          'prepare-tab': {
            templateUrl: "templates/prepare.html",
            controller: 'prepareCtrl'
          }
        }
      })

      .state('tabs.settings', {
        url: "/settings",
        views: {
          'settings-tab': {
            templateUrl: "templates/settings.html",
            controller: 'settingsCtrl'
          }
        }
      })
      .state('tabs.files', {
        url: "/files",
        views: {
          'files-tab': {
            templateUrl: "templates/files.html",
            controller: 'filesCtrl'
          }
        }
      })

      .state('tabs.test', {
        url: "/test",
        views: {
          'test-tab': {
            templateUrl: "templates/test.html",
            controller: 'testCtrl'
          }
        }
      })

      .state('event', {
        url: "/event",
        abstract: true,
        templateUrl: "templates/event.html"
      })

      .state('event.check', {
        url: "/check",
        views: {
          'menuContent': {
            templateUrl: "templates/check.html",
            controller: 'checkCtrl'
          }
        }
      });

    $urlRouterProvider.otherwise("/tab/home");

  });
