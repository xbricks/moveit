angular.module('mv.services', ['firebase','ionic', 'ui.router'])


    .factory("Auth", ["$firebaseAuth", "$rootScope",
    	function ($firebaseAuth, $rootScope) {
    		// create a reference to the database where we will call our data
            var ref = new Firebase(fb);
            return $firebaseAuth(ref);	
		}
	])

	//data getter factory, to retrieve data from database
	.factory("getDataFactory", ["$firebaseArray", "$firebaseObject", 
		function ($firebaseArray, $firebaseObject) {
			
			return {
				getUser: function(uid){
					return $firebaseObject(new Firebase(fb+'users/'+uid));
				},
				getTruck: function(tid){
					return $firebaseObject(new Firebase(fb+'fleet/'+tid));
				},
				getTrucks: function(){
					return $firebaseArray(new Firebase(fb+'fleet'));
				}

			}
		}
	])

    .factory("AccountFactory", ["$firebase", "$firebaseAuth", "$rootScope", "$ionicLoading", "$ionicPopup", "$timeout", "$ionicPopup", "$state", 
    	function ($firebase, $firebaseAuth, $rootScope, $ionicLoading, $ionicPopup, $timeout, $ionicPopup, $scope, $state, getDataFactory) {
    		// create a reference to the database where we will call our data
            var ref = new Firebase(fb);
            var auth = $firebaseAuth(ref);
            

            return {
            	signIn:function(user){
            		var isAuthenticated = null;
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
			                    //To Update AngularJS $scope using $timeout
			                    $timeout(function() {
			                        $rootScope.userID = authData.uid;
			                    	//$rootScope.userData = authData;
			                    });
			                });
			                $ionicLoading.hide();
			                isAuthenticated = true;
			                //$scope.modal1.hide();
			                //$state.go('app.trucklists');
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
			        });return isAuthenticated;
            	},
            	createUser:function(user){
            		console.log("Create User Function called");
			        if (user && user.email && user.password && user.displayname && user.phone && user.address) {
			            $ionicLoading.show({
			                template: 'Signing Up...'
			            });

			            auth.$createUser({
			                email: user.email,
			                password: user.password
			            }).then(function (userData) {
			            	//auth.$login('password', user);
			            	ref.child("users").child(userData.uid).set({
			                    email: user.email,
			                    displayName: user.displayname,
			                    phone: user.phone,
			                    address: user.address
			                });
			                var alertPopup = $ionicPopup.alert({
			                  title: 'Success',
			                  template: 'You have been successfully registered',
			                  buttons: [
			                    {
			                      text: '<b>Login Now</b>',
			                      type: 'button-stable',
			                      
			                    }
			                  ]
			                });
			               
			                $ionicLoading.hide();
			                
			            }).catch(function (error) {
			                //show error when login failed and error message
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
			            //show error when user did not fill all details
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
            	},
            	resetPass: function(user){
					ref.changePassword({
					  email: user.email,
					  oldPassword: user.oldPass,
					  newPassword: user.newPass
					}, function(error) {
					  if (error) {
					    switch (error.code) {
					      case "INVALID_PASSWORD":
					        console.log("The specified user account password is incorrect.");
					        var alertPopup = $ionicPopup.alert({
				              title: 'Error!',
				              template: 'The specified user account password is incorrect.',
				              buttons: [
				                {
				                  text: '<b>Ok</b>',
				                  type: 'button-assertive'
				                }
				              ] 
				            });
					        break;
					      case "INVALID_USER":
					        console.log("The specified user account does not exist.");
					        var alertPopup = $ionicPopup.alert({
				              title: 'Error!',
				              template: 'The specified user account does not exist.',
				              buttons: [
				                {
				                  text: '<b>Ok</b>',
				                  type: 'button-assertive'
				                }
				              ] 
				            });
					        break;
					      default:
					        console.log("Error changing password:", error);
					        var alertPopup = $ionicPopup.alert({
				              title: 'Error changing password:',
				              template: error,
				              buttons: [
				                {
				                  text: '<b>Ok</b>',
				                  type: 'button-assertive'
				                }
				              ] 
				            });
					    }
					  } else {
					    console.log("User password changed successfully!");
					    var alertPopup = $ionicPopup.alert({
				              title: 'Success!',
				              template: 'User password changed successfully! Please relog!',
				              buttons: [
				                {
				                  text: '<b>Ok</b>',
				                  type: 'button-stable'
				                }
				              ] 
				        });
					    $rootScope.logout();

					  }
					});
            	},
            	updateAccount: function(user){
            		var authDatas = ref.getAuth();
            		var uRef = new Firebase(fb+'users/'+authDatas.uid);
            		console.log('auth uid', authDatas.uid);
            		console.log('uref', uRef);
					$ionicLoading.show({
			            template: 'Updating Data'
			        });

			        
			        // Same as the previous example, except we will also display an alert
			        // message when the data has finished synchronizing.
			        var onComplete = function(error) {
			          if (error) {
			            console.log('update failed');
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
			            console.log('update succeeded');
			            var alertPopup = $ionicPopup.alert({
			                  title: 'Success!',
			                  template: 'Your Data Successfully Updated',
			                  buttons: [
			                    {
			                      text: '<b>Ok</b>',
			                      type: 'button-stable'
			                    }
			                  ]
			            });
			            $ionicLoading.hide();
			          }
			        };
			        // update user info
			        uRef.update({ displayName: user.displayName, address: user.address, phone: user.phone }, onComplete);
 
            	},
            	checkAuth:function(){
            		var isAuthenticated = null;
            		ref.onAuth(function(authData) {
				      if (authData) {
				        console.log("Authenticated with uid:", authData.uid);
				        //get user data when user authenticated
				        isAuthenticated = authData;
				        //console.log("display ",$scope.userData.displayName);
				      } else {
				        console.log("Client unauthenticated.");
				        //isAuthenticated = false;
				      }
				      
				    });return isAuthenticated;
            	}
            }
        }
	])

	//factory to handle updating and adding new trucks
	.factory("manageTrucksFactory", ["$firebaseArray", "$firebaseObject", "$ionicLoading", "$ionicHistory", "$log", "$ionicPopup", "$timeout",
		function ($firebaseArray, $firebaseObject, $ionicLoading, $ionicHistory, $log, $ionicPopup, $timeout) {
			// create a reference to the database where we will call our data
			var fbData = new Firebase(fb);
			var authData = fbData.getAuth();
			var fleetRef = fbData.child("fleet");

	
			return {
				updateTrucks: function(trucks){
					$ionicLoading.show({
			            template: 'Updating Data'
			        });

			        var tRef = new Firebase(fb+'fleet/'+trucks.ID);
			        console.log("tRef: ", trucks.$id)
			        // we will also display an alert 
			        // message when the data has finished synchronizing.
			        var onComplete = function(error) {
			          if (error) {
			          	//show error message when failed
			            console.log('update failed');
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
			          	//hide success loading message when data get updated
			            console.log('update succeeded');
			            $ionicLoading.hide(); 
			          }
			        };
			        // Modify the 'first' and 'last' children, but leave other data at fredNameRef unchanged
			        tRef.update({ 
			        	brands: trucks.Brand, 
			        	tripRate: trucks.tripRate, 
			        	porterRate: trucks.porterRate,
			        	hourRate : trucks.hourRate,
			            desc: trucks.Desc,
			            loc: trucks.Loc,
			            maxhour: trucks.maxHour,
			            trucksimg: trucks.selectedImage }, 
			        onComplete);
				},
				addTrucks: function(trucks){
					console.log("addTrucks Function called");
					//check missing forms item
			        if ( trucks.selectedImage && trucks.Brand && trucks.maxHour && trucks.tripRate && trucks.hourRate && trucks.Loc) {
			            $ionicLoading.show({
			                template: 'Adding Trucks'
			            });

			            //chain the two calls together
			            fleetRef.push({
			                owner: authData.uid,
			                brands: trucks.Brand,
			                tripRate: trucks.tripRate,
			                hourRate: trucks.hourRate,
			                porterRate: trucks.porterRate,
			                desc: trucks.Desc,
			                loc: trucks.Loc,
			                maxhour: trucks.maxHour,
			                trucksimg: trucks.selectedImage
			            },function(error) {
			            if (error) {
			            	//show error message when fail
			            	console.log("Failed Adding Trucks");
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
			           		//show success dialogue
			                $ionicLoading.hide();
			                console.log("success adding data");
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
			            	}
			        	});

			        } else {
			        	//show error when form is not completed
			        	console.log("Please fill all details");
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
				}
			}
		}
	])


	//local storage factory for saving favorite item
	.factory('favItemFactory', function ($localStorage) {


		var $storage = $localStorage.$default({
        	fav:[]
    	});

		this.getfav=$storage.fav;

    	return this;
	});


