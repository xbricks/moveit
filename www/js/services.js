angular.module('mv.services', ['firebase'])
    .factory("Auth", ["$firebaseAuth", "$rootScope",
    	function ($firebaseAuth, $rootScope) {
            var ref = new Firebase(fb);
            return $firebaseAuth(ref);
	
	}])


	
	.factory("getDataFactory", ["$firebaseArray", "$firebaseObject", 
		function ($firebaseArray, $firebaseObject) {
			// create a reference to the database where we will call our data
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

	.factory("manageTrucksFactory", ["$firebaseArray", "$firebaseObject", 
		function ($firebaseArray, $firebaseObject) {
			// create a reference to the database where we will call our data
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

	.factory('favItemFactory', function ($localStorage) {


		var $storage = $localStorage.$default({
        	fav:[]
    	});

		this.getfav=$storage.fav;

    	return this;
	});


