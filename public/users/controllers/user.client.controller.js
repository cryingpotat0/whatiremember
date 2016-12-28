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
      resolve: {
        security: ['$q', '$localStorage', function($q, $localStorage){
          if($localStorage.user_id){
            return $q.reject("already signed in");
          }
        }]
      }

    })
    .state('render-login', {
      url: '/login',
      templateUrl: 'users/views/login.partial.html',
      resolve: {
        security: ['$q', '$localStorage', function($q, $localStorage){
          if($localStorage.user_id){
            return $q.reject("already signed in");
          }
        }]
      }
    });
});

angular.module('userApp').controller('UserController', ['$scope', '$http', '$state', '$localStorage', '$rootScope',
  function($scope, $http, $state, $localStorage, $rootScope) {
  $scope.errors = undefined;
  //Check for user
  if($localStorage.user_id){
    console.log($localStorage.user_id)
    //console.log("user");
    $scope.user = true;
  } else {
    //console.log("no user");
    $scope.user = false;
  }
  
  //Signup
  $scope.signupData= { };
  $scope.processSignup = function() {
   $http.post('/api/signup', $scope.signupData).then(
     function(data, status, headers, config) {
       $scope.user = true;
       $localStorage.user_id = data.data._id;
       $state.go('home');
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
       $state.go('home');
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

  //State Change
  $rootScope.$on("$stateChangeStart", function (ev, to, toParams, from, fromParams) { 
     $scope.errors = undefined;
  });
  $rootScope.$on("$stateChangeError", function (ev, to, toParams, from, fromParams) { 
     $scope.errors = ev;
  });
}]);
