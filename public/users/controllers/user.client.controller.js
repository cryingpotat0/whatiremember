angular.module('userApp').controller('UserController', ['$scope', '$http', '$state', '$localStorage', '$rootScope', 'UserAuth', 
  function($scope, $http, $state, $localStorage, $rootScope, UserAuth ) {

  //On page reload functions
  //Check for user
  if(UserAuth.userExists($localStorage)){
    $scope.user = true;
  } else {
    $scope.user = false;
  }
  
  //Signup
  $scope.signupData= { };
  $scope.processSignup = function() {
   $http.post('/api/signup', $scope.signupData).then(
     function(data, status, headers, config) {
       $scope.user = true;
       $localStorage.user_id = data.data._id;
       $state.go('notebooks.list');
     }, 
     function(data) {
       $scope.errors = data.data.error.errors;
     })
  }
  
  //Login
  $scope.loginData= { };
  $scope.processLogin= function() {
   $http.post('/api/login', $scope.loginData).then(
     function(data, status, headers, config) {
       $scope.user = true;
       $localStorage.user_id = data.data._id;
       $state.go('notebooks.list');
     }, function(data) {
       $scope.errors = data;
     })
  }

  //Logout
  $scope.logout = function() {
    $http.post('/api/logout').then(
      function() {
        $scope.user = false;
        $localStorage.$reset();
        $state.go('home');
      },
      function() {
        $localStorage.$reset();
        $scope.errors = "Error loggin out";
      })
  }

}]);
