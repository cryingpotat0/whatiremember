angular.module('userApp').service('Authentication', ['$localStorage', '$http', '$q', '$rootScope', '$state', function($localStorage, $http, $q, $rootScope, $state) {
  this.login = function(loginData) {
    var deferred = $q.defer();
    $http.post('/api/login', loginData).then(
      function(data, status, headers, config) {
        var user_id = data.data._id;
        $localStorage.user_id = user_id;
        deferred.resolve({user_id: user_id});
      }, function(errors) {
        $rootScope.data.errorMessage = "Unsuccessful login";
        $rootScope.data.errors = errors;
        deferred.reject(errors);
      });

    return deferred.promise;
  }

  this.logout = function() {
    var deferred = $q.defer();
    $localStorage.$reset();
    $http.post('/api/logout').then(
      function(data) {
        var user_id = data.data._id;
        $state.go('home');
        deferred.resolve({user_id: user_id});
      },
      function(errors) {
        //$rootScope.data.errorMessage = "Unsuccessful logout";
        //$rootScope.data.errors = errors;
        deferred.reject(errors);
      })
    return deferred.promise;
  }


  this.signup= function(signupData) {
    var deferred = $q.defer();
    $http.post('/api/signup', signupData).then(
      function(data, status, headers, config) {
        var user_id = data.data._id;
        $localStorage.user_id = user_id;
        deferred.resolve({user_id: user_id});
      }, function(errors) {
        var errorsList = errors.data.error.errors;
        var errorMessages = [
          errorsList.password.message,
          errorsList.username.message,
          errorsList.email.message
        ]
        //$rootScope.errors = errors;
        deferred.reject(errorMessages);
      });

    return deferred.promise;
  }


  this.userExists = function() {
    if($localStorage.user_id){
      return true;
    } else {
      return false;
    }
  };

}]);

