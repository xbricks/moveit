angular.module('truckFilters', [])

.filter('startFrom', function() {
    return function(input, start) {
        if(!input) return input;
        	start = +start;
        return input.slice(start);
    };
});
