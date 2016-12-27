var myApp = angular.module('userApp',['ui.router', 'ngStorage']);

myApp.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/home');
  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: 'users/views/home.partial.html'
    })
    .state('render-signup', {
      url: '/signup',
      templateUrl: 'users/views/signup.partial.html',

    })
    .state('render-login', {
      url: '/login',
      templateUrl: 'users/views/login.partial.html'
    });
});

angular.module('userApp').controller('UserController', ['$scope', '$http', '$state', '$localStorage', function($scope, $http, $state, $localStorage) {
 
  //Check for user
  if($localStorage.user_id){
    console.log($localStorage.user_id)
    console.log("user");
    $scope.user = true;
  } else {
    console.log("no user");
    $scope.user = false;
  }
  
  //Signup
  $scope.signupData= {};
  $scope.processSignup = function() {
   $http.post('/api/signup', $scope.signupData).then(
     function(data) {console.log(data)}, function(data) {console.log("nay", data) })
  }
  
  //Login
  $scope.loginData= {};
  $scope.processLogin= function() {
   $http.post('/api/login', $scope.loginData).then(
     function(data, status, headers, config) {
       $scope.user = true;
       $localStorage.user_id = data.data._id;
       $state.go('home');
     }, function(data) {console.log("nay", data) })
  }

  //Logout
  $scope.logout = function() {
    $http.post('/api/logout').then(
      function() {
        $scope.user = false;
        localStorage.clear();
        $state.go('home');
      },
      function() {})
  }

}]);
