angular.module('mv.controllers', [])

 /*****************************************************************
  ***********************Login Controller**************************
  *****************************************************************/
.controller('LoginCtrl', function ($scope, $ionicModal, $state, $firebaseAuth, $ionicLoading, $rootScope, $ionicPopup, $timeout, AccountFactory) {

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/signup.html', {
        id:'2',
        scope: $scope
    }).then(function(modal) {
        $scope.modal2 = modal;
    });


    $scope.createUser = function (user) {
      AccountFactory.createUser(user);
      $timeout(function() {
        $scope.modal2.hide();
        $scope.modal1.show();
      }
      ,3000);

    }

    //modal for login page template
    $ionicModal.fromTemplateUrl('templates/login.html', {
        id:'1',
        scope: $scope
    }).then(function(modal) {
        $scope.modal1 = modal;
    });

    $scope.signIn = function (user) {
        AccountFactory.signIn(user);
 
        $timeout(function() {
          var isAuthenticated = AccountFactory.checkAuth();
          console.log("valid val:", isAuthenticated);
          if (isAuthenticated) {
            console.log("valid user");
            $state.go('app.trucklists');
            //$rootScope.userData = isAuthenticated;
          }

          $scope.modal1.hide();
        }
        ,3000);
        
    }


    //method for closing and opening modal window
    $scope.openModal = function(index) {
        if (index == 1) $scope.modal1.show();
        else $scope.modal2.show();
    };
    $scope.closeModal = function(index) {
        if (index == 1) $scope.modal1.hide();
        else $scope.modal2.hide();
    };

    $scope.$on('$destroy', function() {
        console.log('Destroying modals...');
        $scope.oModal1.remove();
        $scope.oModal2.remove();
    });

})



 /*****************************************************************
  ***********************App Controller****************************
  *****************************************************************/
.controller('AppCtrl', function ($rootScope, $scope, $state, $timeout, getDataFactory, AccountFactory) {


    $timeout(function() {
      //var isAuthenticated = AccountFactory.checkAuth();
      //$scope.userData = getDataFactory.getUser(isAuthenticated.uid);
      $rootScope.userData = getDataFactory.getUser($rootScope.userID);
    },3000);

   

})


 /*****************************************************************
  ********************Accounts Controller**************************
  *****************************************************************/

.controller('AccountCtrl', function ($firebase, $scope, $timeout, $ionicModal, AccountFactory) {

    //initialize modal windows
    $ionicModal.fromTemplateUrl('templates/changePassModal.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.modal = modal;
        console.log("modal clicked");
    });

    //call changePass function from services factory
    $scope.changePass = function(user){
        AccountFactory.resetPass(user);
        $timeout(function() {
          $scope.modal.hide();
        }
        ,3000);
          
    };

    //call updateAccount function from services factory
    $scope.update = function(user){
        AccountFactory.updateAccount(user);
    };

})


 /*****************************************************************
  ********************Manage Trucks Controller*********************
  *****************************************************************/

.controller('ManageCtrl', function ($ionicLoading, $firebase, $scope, $timeout, $ionicModal, $cordovaImagePicker, $ionicPlatform, $ionicPopup, getDataFactory, manageTrucksFactory, $ionicHistory, $log ) {

    //get truck data from factory
    $scope.userTrucks = getDataFactory.getTrucks();

    //enable swipe to show menu
    $scope.listCanSwipe = true  

 
    //modal for adding trucks
    $ionicModal.fromTemplateUrl('templates/addtrucks.html', {
        id:'1',
        scope: $scope
    }).then(function(modal) {
        $scope.modal1 = modal;
    });

    // modal for edit trucks
    $ionicModal.fromTemplateUrl('templates/updateTruckModal.html', {

        id:'2',
        scope: $scope
    }).then(function(modal) {
        console.log("edit modal called");
        $scope.modal2 = modal;
    });

    //modal switch function to open and close between 2 modal window  
    $scope.openModal = function(index) {
        if (index == 1) $scope.modal1.show();
        else $scope.modal2.show();
    };
    $scope.closeModal = function(index) {
        if (index == 1) $scope.modal1.hide();
        else $scope.modal2.hide();
    };

    $scope.$on('$destroy', function() {
        console.log('Destroying modals...');
        $scope.oModal1.remove();
        $scope.oModal2.remove();
    });

    //Initial data for Image Picker
    $scope.trucks = {
        selectedImage : ''
    };
 

    //Trigger a callback function to get image once the device is ready,
    //or immediately if the device is already ready.
    $ionicPlatform.ready(function() {

        $scope.getImage = function() {
            console.log("getimage trigered");       
            // Image picker will load images according to these settings
            var options = {
                maximumImagesCount: 1, // Max number of selected images, I'm using only one for this example
                width: 800,
                height: 800,
                quality: 80            // Higher is better
            };
 
            $cordovaImagePicker.getPictures(options).then(function (results) {
                // Loop through acquired images
                for (var i = 0; i < results.length; i++) {
                    $scope.trucks.selectedImage = results[i];   // We loading only one image so we can use it like this
 
                    window.plugins.Base64.encodeFile($scope.trucks.selectedImage, function(base64){  // Encode URI to Base64 needed for contacts plugin
                        $scope.trucks.selectedImage = base64;
                        console.log("base64:",base64);
                    });
                }
            }, function(error) {
                console.log('Error: ' + JSON.stringify(error));    // In case of error
            });
        };  
    }); 

    //edit function will save temporary data selected trucks and pass them to updateTruckModal 
    $scope.editTrucks = function(trucks){
      $scope.trucks = {
        Brand:trucks.brands,
        tripRate:trucks.tripRate,
        hourRate:trucks.hourRate,
        porterRate:trucks.porterRate,
        Desc:trucks.desc,
        Loc:trucks.loc,
        maxHour:trucks.maxhour,
        selectedImage :trucks.trucksimg,
        ID: trucks.$id
      };
      console.log("edit called");
      $scope.openModal(2);
    }

    //call update function from services factory
    $scope.updateTrucks = function(trucks){
        manageTrucksFactory.updateTrucks(trucks);
        $timeout(function() {
          $scope.closeModal(2);
        }
        ,3000);
    }
    
    //call add trucks function from services factory 
    $scope.addTrucks = function (trucks) {
        manageTrucksFactory.addTrucks(trucks);
        $timeout(function() {
          $scope.closeModal(1);
        }
        ,3000);
        
    }



})


 /*****************************************************************
  ****************Trucks Lists Controller**************************
  *****************************************************************/

.controller('TrucklistsCtrl', function ($scope, $ionicModal, getDataFactory) { 
    $scope.trucklists = getDataFactory.getTrucks();
})


/*****************************************************************
  ****************Single Trucks Controller************************
  *****************************************************************/
.controller('TrucklistCtrl', function ($scope, $stateParams, $ionicPopup, getDataFactory, favItemFactory) {

    $scope.tid = $stateParams.trucklistID; //get truck id from list
    $scope.oid = $stateParams.ownerID; // get owner/user id from list

    console.log("oid : ", $scope.oid);
    $scope.trucklist = getDataFactory.getTruck($scope.tid);
    $scope.user = getDataFactory.getUser($scope.oid);
   
    console.log("scope user : ", $scope.user);

    $scope.addFav = function (item){
      var alertPopup = $ionicPopup.alert({
          title: 'Success!',
          template: 'Added to Favorites',
          buttons: [
            {
              text: '<b>Ok</b>',
              type: 'button-royal'
            }
          ]
      });
      
      favItemFactory.getfav.push(item);
    } 

})


.controller('FavItemCtrl', function ($scope, $localStorage, favItemFactory) {
    
    $scope.$storage = $localStorage;

    $scope.removeItem = function (index){
        $scope.$storage.fav.splice(index, 1);
    }

});
