angular.module('mv.services', ['firebase'])
    .factory("Auth", ["$firebaseAuth", "$rootScope",
    	function ($firebaseAuth, $rootScope) {
            var ref = new Firebase(fb);
            return $firebaseAuth(ref);
	
	}])


	.factory("userDataFactory", ["$firebaseArray", 
		function ($firebaseArray) {
			// create a reference to the database where we will store our data
			var ref = new Firebase(fb+'users');
			return $firebaseArray(ref);
		}
	])

	.factory("getTrucksFactory", ["$firebaseArray", 
		function ($firebaseArray) {
    		// create a reference to the database where we will store our data
    		var ref = new Firebase(fb+'fleet');

    		return $firebaseArray(ref);
  		}
	]);

