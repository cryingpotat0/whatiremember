angular.module('userApp').service('flash', ['$rootScope',
  function($rootScope) {
    
    this.newFlashSet = function(messages, style) {
      $rootScope.$emit('newFlashSet', {
        messages: messages,
        style: style
      });
    }

    this.listenForFlash = function($scope) {
      $rootScope.$on('newFlashSet', function(event, args) {
        $scope.flashMessages = args.messages;
        //console.log('starting');
        $scope.flashStyle = args.style;
      });
      $rootScope.$on("$stateChangeStart", function () {
        $scope.flashStyle = undefined;
        //console.log('stopping');
        $scope.flashMessages = undefined;
      });
    }

  }]);
