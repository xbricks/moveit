angular.module('mv.controllers', [])



 /*****************************************************************
  ***********************Login Controller**************************
  *****************************************************************/
.controller('LoginCtrl', function ($scope, $ionicModal, $state, $firebaseAuth, $ionicLoading, $rootScope, $ionicPopup, $timeout) {
    //console.log('Login Controller Initialized');
    console.log("load controller firebase url : "+fb);
    var ref = new Firebase(fb);
    var auth = $firebaseAuth(ref);


    // Create the login modal that we will use later
  

    $ionicModal.fromTemplateUrl('templates/signup.html', {
        id:'2',
        scope: $scope
    }).then(function(modal) {
        $scope.modal2 = modal;
    });


    $scope.createUser = function (user) {
        console.log("Create User Function called");
        if (user && user.email && user.password && user.displayname && user.phone && user.address && user.role) {
            $ionicLoading.show({
                template: 'Signing Up...'
            });

            auth.$createUser({
                email: user.email,
                password: user.password
            }).then(function (userData) {
                var alertPopup = $ionicPopup.alert({
                  title: 'Success',
                  template: 'You have been successfully registered',
                  buttons: [
                    {
                      text: '<b>Login Now</b>',
                      type: 'button-stable',
                      onTap: function(e) {
                        $scope.modal2.hide();
                        $scope.modal1.show();
                      }
                    }
                  ]
                });
                ref.child("users").child(userData.uid).set({
                    email: user.email,
                    displayName: user.displayname,
                    phone: user.phone,
                    address: user.address,
                    role: user.role
                });
                $ionicLoading.hide();
                $scope.modal2.hide();
            }).catch(function (error) {
                //alert("Error: " + error);
                var alertPopup = $ionicPopup.alert({
                  title: 'Login Failed!',
                  template: error,
                  buttons: [
                    {
                      text: '<b>Ok</b>',
                      type: 'button-assertive'
                    }
                  ]
                });
                $ionicLoading.hide();
            });
        } else
            //alert("Please fill all details");
            var alertPopup = $ionicPopup.alert({
              title: 'Error!',
              template: 'Please fill all details',
              buttons: [
                {
                  text: '<b>Ok</b>',
                  type: 'button-assertive'
                }
              ] 
            });
    }


    $ionicModal.fromTemplateUrl('templates/login.html', {
        id:'1',
        scope: $scope
    }).then(function(modal) {
        $scope.modal1 = modal;
    });

    $scope.signIn = function (user) {

        if (user && user.email && user.password) {
            $ionicLoading.show({
                template: 'Signing In...'
            });
            auth.$authWithPassword({
                email: user.email,
                password: user.password
            }).then(function (authData) {
                console.log("Logged in as:" + authData.uid);
                ref.child("users").child(authData.uid).on('value', function (snapshot) {
                    var val = snapshot.val();
                    //To Update AngularJS $scope either use $apply or $timeout
                    // $scope.$apply(function () {
                    //     $rootScope.userData = val;
                    // });
                    $timeout(function() {
                        $rootScope.userData = val;
                        $rootScope.userID = authData.uid;
                    });
                });
                $ionicLoading.hide();
                $scope.modal1.hide();
                $state.go('app.trucklists');
            }).catch(function (error) {
                //alert("Authentication failed:" + error.message);
                var alertPopup = $ionicPopup.alert({
                  title: 'Login Failed!',
                  template: error,
                  buttons: [
                    {
                      text: '<b>Ok</b>',
                      type: 'button-assertive'
                    }
                  ]
                });
                $ionicLoading.hide();
            });
        } else
            //alert("Please enter email and password both");
            var alertPopup = $ionicPopup.alert({
                title: 'Login Failed!',
                template: 'Please enter email and password both',
                buttons: [
                {
                  text: '<b>Ok</b>',
                  type: 'button-assertive'
                }
              ]
            });
    }

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
.controller('AppCtrl', function($scope,$state) {

    // Callback Function
    var ref = new Firebase(fb);
    ref.onAuth(function(authData) {
      if (authData) {
        console.log("Authenticated with uid:", authData.uid);
      } else {
        console.log("Client unauthenticated.")
      }
    });
})


 /*****************************************************************
  ********************Accounts Controller**************************
  *****************************************************************/

.controller('AccountCtrl', function ($firebase, $scope, $ionicModal, $ionicLoading) {
    var fbData = new Firebase(fb);
    var authData = fbData.getAuth();

    $scope.update = function(user){

        $ionicLoading.show({
            template: 'Updating Data'
        });

        var uRef = new Firebase(fb+'users/'+authData.uid);
        // Same as the previous example, except we will also display an alert
        // message when the data has finished synchronizing.
        var onComplete = function(error) {
          if (error) {
            console.log('Synchronization failed');
            var alertPopup = $ionicPopup.alert({
                  title: 'Failed Updating!',
                  template: Error,
                  buttons: [
                    {
                      text: '<b>Ok</b>',
                      type: 'button-assertive'
                    }
                  ]
            });
          } else {
            console.log('Synchronization succeeded');
            $ionicLoading.hide();
          }
        };
        // Modify the 'first' and 'last' children, but leave other data at fredNameRef unchanged
        uRef.update({ displayName: user.displayName, address: user.address, phone: user.phone, role: user.role }, onComplete);
    };

})


 /*****************************************************************
  ********************Manage Trucks Controller*********************
  *****************************************************************/

.controller('ManageCtrl', function ($ionicLoading, $firebase, $rootScope, $scope, $timeout, $ionicModal, $cordovaImagePicker, $ionicPlatform, $ionicPopup, getTrucksFactory) {
 
    var fbData = new Firebase(fb);

    console.log("truck authData", $rootScope.userID);

    $scope.userTrucks = getTrucksFactory;
    console.log("user trukcs", $scope.userTrucks);

    $scope.listCanSwipe = true  

    // Display modal for adding trucks
    $ionicModal.fromTemplateUrl('templates/addtrucks.html', {

        scope: $scope
    }).then(function (modal) {
        $scope.modal = modal;
        console.log("modal clicked");
    });



    //Image Picker
    $scope.collection = {
        selectedImage : ''
    };
 
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
                    $scope.collection.selectedImage = results[i];   // We loading only one image so we can use it like this
 
                    window.plugins.Base64.encodeFile($scope.collection.selectedImage, function(base64){  // Encode URI to Base64 needed for contacts plugin
                        $scope.collection.selectedImage = base64;
                        console.log("base64:",base64);
                        //$scope.addContact();    // Save contact
                    });
                }
            }, function(error) {
                console.log('Error: ' + JSON.stringify(error));    // In case of error
            });
        };  
 
    }); 


    //Date Picker
    $scope.currentDate = new Date();
    $scope.currentDate2 = $scope.currentDate;

    $scope.datePickerCallback = function (val) {
      if(typeof(val)==='undefined'){    
          console.log('Date not selected');

      }else{
          console.log('Selected date is : ', val);
          $scope.currentDate = new Date(val).getTime();
      }
    };

    $scope.datePickerCallback2 = function (val) {
      if(typeof(val)==='undefined'){    
          console.log('Date not selected');

      }else{
          console.log('Selected date is : ', val.getTime());
          $scope.currentDate2 = new Date(val).getTime();
      }
    };


    $scope.datepickerObject = {
      titleLabel: 'Select Date',
      inputDate: $scope.currentDate,  //Optional
      templateType: 'popup', //Optional
      showTodayButton: 'true', //Optional
      modalHeaderColor: 'bar-positive', //Optional
      modalFooterColor: 'bar-positive', //Optional
      from: $scope.currentDate, //Optional
      to: new Date(2017, 1, 1),  //Optional
      callback: function (val) {  //Mandatory
         $scope.datePickerCallback(val);
      },
      dateFormat: 'dd-MM-yyyy', //Optional
      closeOnSelect: false, //Optional
    };   

    $scope.datepickerObject2 = {
      titleLabel: 'Select Date',
      inputDate: $scope.currentDate,  //Optional
      templateType: 'popup', //Optional
      showTodayButton: 'true', //Optional
      modalHeaderColor: 'bar-positive', //Optional
      modalFooterColor: 'bar-positive', //Optional
      from: $scope.currentDate, //Optional
      to: new Date(2017, 1, 1),  //Optional
      callback: function (val) {  //Mandatory
         $scope.datePickerCallback2(val);
      },
      dateFormat: 'dd-MM-yyyy', //Optional
      closeOnSelect: false, //Optional
    };  

    

    $scope.addTrucks = function (trucks) {
        console.log("addTrucks Function called");
        if (  trucks.Brand && trucks.Daily && trucks.Mile && trucks.Desc) {
            $ionicLoading.show({
                template: 'Adding Trucks'
            });

            var fbData = new Firebase(fb);
            var authData = fbData.getAuth();
            var postsRef = fbData.child("fleet");

              // we can also chain the two calls together
            postsRef.push().set({
                owner: authData.uid,
                brands: trucks.Brand,
                drate: trucks.Daily,
                dmile: trucks.Mile,
                desc: trucks.Desc,
                avafrom: $scope.currentDate,
                avauntil: $scope.currentDate2,
                trucksimg:$scope.collection.selectedImage
            },function(error) {
              if (error) {
                var alertPopup = $ionicPopup.alert({
                  title: 'Failed Adding Trucks !',
                  template: Error,
                  buttons: [
                    {
                      text: '<b>Ok</b>',
                      type: 'button-assertive'
                    }
                  ]
                });
                $ionicLoading.hide();
              } else {
                var alertPopup = $ionicPopup.alert({
                  title: 'Success Adding Trucks !',
                  template: 'Success',
                  buttons: [
                    {
                      text: '<b>Ok</b>',
                      type: 'button-royal'
                    }
                  ]
                });
                $scope.modal.hide();
                $ionicLoading.hide();
            }});

        } else
            //alert("Please fill all details");
            var alertPopup = $ionicPopup.alert({
              title: 'Error!',
              template: 'Please fill all details',
              buttons: [
                {
                  text: '<b>Ok</b>',
                  type: 'button-assertive'
                }
              ] 
            });
    }



})





 /*****************************************************************
  ***********************Lists Controller**************************
  *****************************************************************/

.controller('TrucklistsCtrl', function ($scope, getTrucksFactory) {

    $scope.trucklists = getTrucksFactory;
    console.log("trucklists", $scope.trucklists)

})

.controller('TrucklistCtrl', function ($scope, $stateParams, getTrucksFactory, userDataFactory) {

    $scope.trucklists = getTrucksFactory;
    $scope.ownerDatas = userDataFactory;

    console.log("ownerData", $scope.ownerDatas);
    $scope.tid = $stateParams.trucklistID;

});
