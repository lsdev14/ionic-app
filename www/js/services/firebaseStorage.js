angular.module('controlePresenca.services')

.factory('$firebaseStorage', ['$firebaseArray','$firebaseUtils', function($firebaseArray,$firebaseUtils) {
  return {
      set: function (value) {

          var ref = new Firebase("https://controlepresenca.firebaseio.com");
          var list = $firebaseArray(ref);
          list.$add(value).then(function (ref) {
              var id = ref.key();
              console.log("added record with id " + id);
              return list.$indexFor(id); // returns location in the array
          })
          .catch(function (error) {
              console.log(error)
          });

      }
    //get: function(key, defaultValue) {
    //  return $window.localStorage[key] || defaultValue;
    //},
    //setObject: function(key, value) {
    //  $window.localStorage[key] = JSON.stringify(value);
    //},
    //getObject: function(key) {
    //  return JSON.parse($window.localStorage[key] || '[]');
    //}
  }
}]);