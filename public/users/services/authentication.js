angular.module('userApp').service('Authentication', ['$localStorage', '$http', '$q', '$rootScope', '$state', 'flash',
  function($localStorage, $http, $q, $rootScope, $state, flash) {
  this.login = function(loginData) {
    var deferred = $q.defer();
    $http.post('/api/login', loginData).then(
      function(data, status, headers, config) {
        var user_id = data.data._id;
        $localStorage.user_id = user_id;
        deferred.resolve({user_id: user_id});
      }, function(errors) {
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
        flash.newFlashSet(['Successfully logged out'], 'success');
      },
      function(errors) {
        $state.go('home');
        deferred.reject(errors);
      })
    return deferred.promise;
  }


  this.signup= function(signupData) {
    var deferred = $q.defer();
    $http.post('/api/signup', signupData).then(
      function(data, status, headers, config) {
        var user_id = data.data.user;
        $localStorage.user_id = user_id;
        deferred.resolve({user_id: user_id});
      }, function(errors) {
        var errorsList = errors.data.error.errors;
        var errorMessages = []
        var password = errorsList.password,
            username = errorsList.username,
            email = errorsList.email;
        if(email) { errorMessages.push(email.message); }
        if(username) { errorMessages.push(username.message); }
        if(password) { errorMessages.push(password.message); }

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

