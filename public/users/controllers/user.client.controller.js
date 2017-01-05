angular.module('userApp').controller('UserController', ['$scope', '$state', 'Authentication', 'flash',
  function($scope, $state, Authentication, flash) {

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
       flash.newFlashSet(['Successfully signed up'], 'success');
     }, function(errors) { 
       flash.newFlashSet(errors, 'danger');
     });
  }

    //Login
    $scope.loginData= { };
    $scope.processLogin= function() {
      Authentication.login($scope.loginData).then(
        function() {
          $scope.user = true;
          $state.go('notebooks.list');
          flash.newFlashSet(['Successfully logged in'], 'success');
        },
        function() {
          flash.newFlashSet(['Unsuccessful login, please check username and password'], 'danger');
        }
      );
    }

    //Logout
    $scope.logout = function() {
      Authentication.logout().then(
        function() {
          $scope.user = false;
        },
        function() {
        });
    }

  }]);
