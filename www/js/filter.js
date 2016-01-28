angular.module('truckFilters', [])

// .filter('startFrom', function() {
//     return function(input, start) {
//         if(!input) return input;
//         	start = +start;
//         return input.slice(start);
//     };
// });
.filter('flatten', function(){
    return function(trucklists) {
      var merged = [];
      return merged.concat.apply(merged, trucklists);
    }
  })


.filter("dateFilter", function() {
  return function(items, from, to) {

        function parseDate(input) {
          var parts = input.split('-');
          return new Date(parts[2], parts[1]-1, parts[0]); 
        }

        var df = parseDate("27-05-2012");
        var dt = parseDate("27-05-2017");
        var arrayToReturn = [];        
        for (var i=0; i<items.length; i++){
            var tf = new Date(items[i].date1 * 1000),
                tt = new Date(items[i].date2 * 1000);
            if ( tf > df &&  tt < dt )  {
                arrayToReturn.push(items[i]);
            }
        }
        
        return arrayToReturn;
  };
});