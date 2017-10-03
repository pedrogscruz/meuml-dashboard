angular.module('meuml.protected.html-editor', [
  'ui.router',
  'ui.tinymce',
])

.config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider.state('protected.html-editor', {
      url: '/html-editor',
      controller: 'HtmlEditorController as htmlEditorCtrl',
      templateUrl: 'custom/protected/html-editor/html-editor.tpl.html',
      data: {
        pageTitle: 'Editor HTML',
      },
    });
  }
])

;
