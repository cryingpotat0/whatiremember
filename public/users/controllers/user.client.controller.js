angular.module('userApp').controller('UserController', ['$scope', '$state', 'Authentication',
  function($scope, $state, Authentication) {

  //On page reload check for user
  if(Authentication.userExists()){
    $scope.user = true;
  } else {
    $scope.user = false;
  }
  
  //Signup
  $scope.signupData= { };
  $scope.processSignup = function() {
    Authentication.signup($scope.signupData).then(
     function() {
       $scope.user = true;
       $state.go('notebooks.list');
     }, function(errors) { 
        $scope.errors = errors;
     });
  }
  
  //Login
  $scope.loginData= { };
  $scope.processLogin= function() {
    Authentication.login($scope.loginData).then(
     function() {
       $scope.user = true;
       $state.go('notebooks.list');
     });
  }

  //Logout
  $scope.logout = function() {
    Authentication.logout().then(
      function() {
        $scope.user = false;
        $state.go('home');
      });
  }

}]);
