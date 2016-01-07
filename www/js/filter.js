angular.module('truckFilters', [])

// .filter('startFrom', function() {
//     return function(input, start) {
//         if(!input) return input;
//         	start = +start;
//         return input.slice(start);
//     };
// });

.filter("dateFilter", function() {
  return function(items, from, to) {
        var df = parseDate(from);
        var dt = parseDate(to);
        var arrayToReturn = [];        
        for (var i=0; i<items.length; i++){
            var tf = new Date(items[i].date1 * 1000),
                tt = new Date(items[i].date2 * 1000);
            if (df > tf && dt < tt)  {
                arrayToReturn.push(items[i]);
            }
        }
        
        return arrayToReturn;
  };
});