
var myApp = angular.module('userApp',['ui.router', 'ngStorage']);

myApp.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/home');
  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: 'users/views/home.partial.html',
      controller: 'UserController'
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
      },
      controller: 'UserController'
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
      },
      controller: 'UserController'
    })
  .state('notebooks', {
    url: '/notebooks',
    resolve: {
      security: ['$q', '$localStorage', function($q, $localStorage){
        if(!($localStorage.user_id)){
          return $q.reject("no user signed in");
        }
      }]
    },
    templateUrl: 'notebooks/views/notebook.html',
    controller: 'NotebookController'
  })
  .state('notebooks.list', {
    url: '/list',
    templateUrl: 'notebooks/views/notebook_list.html',
    controller: 'NotebookController'
  })
  .state('notebooks.new', {
    url: '/new',
    templateUrl: 'notebooks/views/notebook_new.html',
    controller: 'NotebookController'
  })
  .state('notebooks.edit', {
    url: '/edit?notebookId',
    templateUrl: 'notebooks/views/notebook_edit.html',
    controller: 'NotebookController'
  })
  .state('notebooks.show', {
    url: '/show?notebookId',
    templateUrl: 'notebooks/views/notebook_show.html',
    controller: 'NotebookController'
  });
}]);

myApp.run(function($rootScope, $state, Authentication) {
  //State Change
  $rootScope.logout = Authentication.logout;

  $rootScope.$on("$stateChangeStart", function (ev, to, toParams, from, fromParams, error) { 
    $rootScope.errors = undefined;
  });
  $rootScope.$on("$stateChangeError", function (ev, to, toParams, from, fromParams, error) { 
    $state.go('home');
    console.log(error);
    $rootScope.errors = error;
  });
});

