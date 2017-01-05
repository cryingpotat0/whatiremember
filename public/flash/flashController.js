angular.module('userApp').controller('flashController', ['$scope', 'flash',
  function($scope, flash) {
    flash.listenForFlash($scope);
  }]);
