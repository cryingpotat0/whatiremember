angular.module('userApp').service('NotebookAPI', 
  ['$http', '$stateParams', '$q',
  function($http, $stateParams, $q) {

    this.getNotebookList = function() {
      var deferred = $q.defer();
      $http.get('/api/notebook').then(
        function(data, status, headers, config) {

          var notebook_list = data.data;
          var styles = ["success", "info", "warning", "danger"];
          for(var notebook of notebook_list) {
            style_number = Math.floor(Math.random()*(4));
            notebook.style = styles[style_number];
            notebook.display = true;
          }
          deferred.resolve(notebook_list);
        },
        function(errors){
          deferred.reject(errors);
        });
      return deferred.promise;
    }

    this.showNotebook = function(notebookId) {
      var deferred = $q.defer();
      $http.get('/api/notebook/'+notebookId).then(
        function(data, status, headers, config) {
          var notebookData = data.data.notebook;
          deferred.resolve(notebookData);
        },
        function(errors) {
          deferred.reject(errors);
        });
      return deferred.promise;
    }

    this.editNotebook = function(notebookId, notebookData) {
      var deferred = $q.defer();
      $http.patch('/api/notebook/' + notebookId, notebookData).then(
        function(data, status, headers, config) {
          deferred.resolve(data);
        }, 
        function(errors) {
          deferred.reject(errors);
        });
        return deferred.promise;
      }

    this.submitNotebook = function(notebookData) {
      var deferred = $q.defer();
      $http.post('/api/notebook', notebookData).then(
        function(data, status, headers, config) {
          deferred.resolve(data);
        },
        function(errors) {
          deferred.reject(errors);
        });
        return deferred.promise;
      }

    this.deleteNotebook = function(notebookId) {
      var deferred = $q.defer();
      $http.delete('/api/notebook/' + notebookId).then(
        function(data, status, headers, config) {
          deferred.resolve(data);
        },
        function(errors) {
          deferred.reject(errors);
        });
        return deferred.promise;
      }

  }]);


