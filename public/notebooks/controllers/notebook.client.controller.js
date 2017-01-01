angular.module('userApp').controller('NotebookController', ['$scope', '$http', '$state', '$stateParams',
  function($scope, $http, $state, $stateParams) {
    $scope.getNotebookList = function() {
      $http.get('/api/notebook').then(
        function(data, status, headers, config) {
          $scope.notebooks = addParametersToNotebooks(data.data);
        },
        function(data, status, headers, config) {
          //console.log(data)
          $scope.errors = data;
        }
      )}

    $scope.showNotebook = function() {
      var notebookId = $stateParams.notebookId;
      $http.get('/api/notebook/'+notebookId).then(
        function(data, status, headers, config) {
          $scope.notebookData.title = data.data.notebook.title;
          var lines = data.data.notebook.lines;
          //console.log(lines);
          jQuery('.toolbar').hide();
          for (var i=0; i < $scope.max_lines; i++) {
            var className = '.' + $scope.textEditorName + i.toString();
            jQuery(className + ' #editor').removeAttr('contenteditable');
            var textEditor = new TextEditor(className);
            textEditor.persistData(lines[i]);
          }
          console.log(data);
        },
        function(data, status, headers, config) {
          console.log(data);
        });
    }

    $scope.makeEditable = function() {
      var notebookId = $stateParams.notebookId;
      $http.get('/api/notebook/'+notebookId).then(
        function(data, status, headers, config) {
          $scope.notebookData.title = data.data.notebook.title;
          var lines = data.data.notebook.lines;
          for (var i=0; i < $scope.max_lines; i++) {
            var className = '.' + $scope.textEditorName + i.toString();
            var textEditor = new TextEditor(className);
            textEditor.persistData(lines[i]);
          }
          console.log(data);
        },
        function(data, status, headers, config) {
          console.log(data);
        });
    }
    $scope.editNotebook = function() {
      var lines = { }
      for (var i=0; i < $scope.max_lines; i++) {
        lines[i.toString()] = jQuery('.' + $scope.textEditorName + i.toString() + ' #editor')['0'].innerHTML;
      }
      //console.log(lines)
      $scope.notebookData.lines = lines;
      var notebookId = $stateParams.notebookId;
      //console.log($scope.notebookData);
      $http.patch('/api/notebook/' + notebookId, $scope.notebookData).then(
        function(data, status, headers, config) {
          $state.go('notebooks.list');
          console.log(data);
        },
        function(data, status, headers, config) {
          console.log(data);
        });
    }

    $scope.submitNotebook = function() {
      var lines = { }
      for (var i=0; i < $scope.max_lines; i++) {
        lines[i.toString()] = jQuery('.' + $scope.textEditorName + i.toString() + ' #editor')['0'].innerHTML;
      }
      //console.log(lines)
      $scope.notebookData.lines = lines,
        //console.log($scope.notebookData);
        $http.post('/api/notebook', $scope.notebookData).then(
          function(data, status, headers, config) {
            $state.go('notebooks.list');
            console.log(data);
          },
          function(data, status, headers, config) {
            console.log(data);
          });
    }

    $scope.createTextEditors = function() {
      $scope.notebookData = { }
      $scope.textEditorName = 'text-editor-input';
      var textEditor = new TextEditor('.' + $scope.textEditorName);
      $scope.max_lines = 10;
      textEditor.generateN($scope.max_lines,['bold', 'forecolor','insertOrderedList','insertUnorderedList', 'insertimage', 'createlink', 'unlink', 'code']);
      textEditor.singleToolbar();
    }

    $scope.deleteNotebook = function(id) {
      $http.delete('api/notebook/' + id).then(
        function(data, status, headers, config) {
          current_notebooks = $scope.notebooks;
          for(var notebook of current_notebooks){
            if(notebook._id == data.data.notebook._id) {
              notebook.display = false;
              $scope.notebooks = current_notebooks;
              return
            }
          }
        },
        function(data, status, headers, config) {
          $scope.errors = data;
        }
      )
    }
  }]
);

function addParametersToNotebooks(notebook_list){
  var styles = ["success", "info", "warning", "danger"];
  for(var notebook of notebook_list) {
    style_number = Math.floor(Math.random()*(4));
    notebook.style = styles[style_number];
    notebook.display = true;
  }
  return notebook_list
}

angular.module('userApp').directive('notebookBlock', function() {
  return {
    templateUrl: 'notebooks/views/notebook-block.html',
    replace: true,
    scope: {
      style: '@',
      title: '@',
      displayLine: '@',
      id: '@',
      deleteNotebook: '&',
      renderEdit: '&'
    }
  }
});
