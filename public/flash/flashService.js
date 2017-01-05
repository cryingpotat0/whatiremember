angular.module('userApp').service('flash', ['$rootScope', '$state',
  function($rootScope, $state) {
    
    this.newFlashSet = function(messages, style) {
      $rootScope.$emit('newFlashSet', {
        messages: messages,
        style: style
      });
    }

    this.listenForFlash = function($scope) {
      $rootScope.$on('newFlashSet', function(event, args) {
        $scope.flashMessages = args.messages;
        $scope.flashStyle = args.style;
      });
      $rootScope.$on("$stateChangeStart", function () {
        $scope.flashStyle = undefined;
        $scope.flashMessages = undefined;
      });
    }

  }]);
