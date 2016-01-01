angular.module('mv.services', ['firebase'])
    .factory("Auth", ["$firebaseAuth", "$rootScope",
    	function ($firebaseAuth, $rootScope) {
            var ref = new Firebase(fb);
            return $firebaseAuth(ref);
	
	}])


	/*.factory("userDataFactory", ["$firebaseArray", 
		function ($firebaseArray) {
			// create a reference to the database where we will store our data
			var ref = new Firebase(fb+'users');
			return $firebaseArray(ref.child('fleet'));
		}
	])*/

	// .factory("userDataFactory", ["$firebaseArray", 
	// 	function ($firebaseArray) {
	// 		// create a reference to the database where we will store our data
	// 		var ref = new Firebase(fb+'users');
	// 		return {
	// 			fleet: function(callback){
	// 				ref.orderByChild("fleet").on("child_added", callback);
	// 			}
	// 		}
	// 	}
	// ])
	
	.factory("getDataFactory", ["$firebaseArray", 
		function ($firebaseArray) {
			// create a reference to the database where we will store our data
			var refUSER = new Firebase(fb+'users');
			var refTRUCKS = new Firebase(fb+'fleet');
			return {
				getUser: function(){
					return $firebaseArray(refUSER);
				},
				getTrucks: function(){
					return $firebaseArray(refTRUCKS);
				},
				getPhone: function(uid){
					refUSER.orderByKey().equalTo(uid).on("child_added", function(snapshot) {
                    	console.log("data trucks", snapshot.val());
                    return snapshot.val();
                	})
				}	
			}
		}
	])

	.factory('favItemFactory', function ($localStorage) {

		// var o = {
		// 	favorites: []
		// }

		// o.addItemToFavorites = function(item, index) {
		// 	// make sure there's a item to add
		// 	if (!item) return false;
		// 	// add to favorites array
		// 	o.favorites.unshift(item);
		// }

		// o.removeItemFromFavorites = function(item, index) {
		//     // make sure there's a item to add
		//     if (!item) return false;
		//     // add to favorites array
		// 	o.favorites.splice(index, 1);
		// }

		// return o;


		var $storage = $localStorage.$default({
        	fav:[]
    	});

		this.getfav=$storage.fav;

    	return this;
	});


