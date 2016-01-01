// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js

//var fb = new Firebase("https://vivid-fire-2745.firebaseio.com/");

var fb = "https://vivid-fire-2745.firebaseio.com/";
console.log("load firebase url : "+fb);
var mvMod = angular.module('mv', ['ionic','ngCordova','ngStorage','mv.services','truckFilters','mv.controllers','firebase','ui.router', 'ionic-datepicker'])

.run(function ($ionicPlatform, $rootScope, $location, Auth, $ionicLoading) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    console.log("platform ready");
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    // To Resolve Bug
    ionic.Platform.fullScreen();

    $rootScope.fb = fb;
    $rootScope.tdref = new Firebase(fb+'users');
    $rootScope.userID = null;

    console.log("rootScope fb : "+$rootScope.fb);

    Auth.$onAuth(function (authData) {
      if (authData) {
        console.log("Logged in as:", authData.uid);
      } else {
        console.log("Logged out");
        $ionicLoading.hide();
        $location.path('/login');
      }
    });

    $rootScope.logout = function () {
      console.log("Logging out from the app");
      $ionicLoading.show({
        template: 'Logging Out...'
      });
        Auth.$unauth();
    }


    $rootScope.$on("$stateChangeError", function (event, toState, toParams, fromState, fromParams, error) {
      // We can catch the error thrown when the $requireAuth promise is rejected
      // and redirect the user back to the home page
      if (error === "AUTH_REQUIRED") {
        $location.path("/login");
      }
    });    


  });
})

.config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

  //disable swipe to back
  $ionicConfigProvider.views.swipeBackEnabled(false);

  //tabs position at bottom as default
  $ionicConfigProvider.tabs.position('bottom');

  console.log("setting config");
  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // State to represent Login View
  .state('login', {
      url: "/login",
      templateUrl: "templates/frontpage.html",
      controller: 'LoginCtrl',
      resolve: {
        // controller will not be loaded until $waitForAuth resolves
        // Auth refers to our $firebaseAuth wrapper in the example above
        "currentAuth": ["Auth",
          function (Auth) {
            // $waitForAuth returns a promise so the resolve waits for it to complete
            return Auth.$waitForAuth();
        }]
      }
  })


  .state('app', {
      url: '/app',
      abstract: true,
      templateUrl: 'templates/menu.html',
      controller: 'AppCtrl',
      resolve: {
        // controller will not be loaded until $requireAuth resolves
        // Auth refers to our $firebaseAuth wrapper in the example above
        "currentAuth": ["Auth",
          function (Auth) {
            // $requireAuth returns a promise so the resolve waits for it to complete
            // If the promise is rejected, it will throw a $stateChangeError (see above)
            return Auth.$requireAuth();
        }]
      }
  })

  .state('app.trucklists', {
      url: '/trucklists',
      views: {
        'menuContent': {
          templateUrl: 'templates/trucklists.html',
          controller: 'TrucklistsCtrl'
        }
      }
  })

  .state('app.single', {
      url: '/trucklists/:trucklistID/:ownerID',
      views: {
        'menuContent': {
          templateUrl: 'templates/trucklist.html',
          controller: 'TrucklistCtrl'
        }
      }
  })

  .state('app.fav', {
      url: '/fav',
      views: {
        'menuContent': {
          templateUrl: 'templates/favorites.html',
          controller: 'FavItemCtrl'
        }
      }
  })

  .state('app.manage', {
      url: '/manage',
      views: {
        'menuContent': {
          templateUrl: 'templates/managelists.html',
          controller: 'ManageCtrl'
        }
      }
  })

  .state('app.fleet', {
      url: '/managelists/:trucklistId',
      views: {
        'menuContent': {
          templateUrl: 'templates/fleet.html'
        }
      }
  })

  .state('app.account', {
      url: '/account',
      views: {
        'menuContent': {
          templateUrl: 'templates/account.html',
          controller: 'AccountCtrl'
        }
      }
  });


  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

  
});
