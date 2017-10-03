angular.module('meuml.protected.html-editor')

.controller('HtmlEditorController', ['NotificationService', 'ImagePicker',
  'SellerTemplateSearchService',

  function(NotificationService, ImagePicker, SellerTemplateSearchService) {
    var self = this;

    self.loadingTemplates = true;

    function initEditor(templates) {
      var customTemplates = [];

      if (templates) {
        angular.forEach(templates, function(template) {
          var description = null;

          if (template.tags.length) {
            var tags = template.tags.map(function(templateTag) {
              return templateTag.tag;
            });

            description = 'Tags: ' + tags.join(', ');
          }

          customTemplates.push({
            content: template.html_text || '',
            description: description,
            title: template.name,
          });
        });
      }

      self.tinymceOptions = {
        branding: false,
        elementpath: false,
        file_picker_callback: function (callback, value, meta) {
          if (meta.filetype != 'image') {
            return;
          }

          ImagePicker.show().then(function (image) {
            var description = image.tags.map(function (imageTag) {
              return imageTag.tag;
            }).join(' ');

            callback(image.url, {alt: description});
          });
        },
        file_picker_types: 'image',
        height: 800,
        image_dimensions: false,
        language: 'pt_BR',
        language_url: '/assets/js/tinymce-language-pt_BR.js',
        menubar: 'edit insert view format table tools',
        plugins: [
          'advlist autolink save link image lists charmap preview hr anchor pagebreak',
          'searchreplace wordcount visualblocks visualchars code insertdatetime media nonbreaking',
          'table contextmenu directionality emoticons template paste textcolor',
        ],
        statusbar: false,
        templates: customTemplates,
        toolbar1: 'undo redo | bold italic strikethrough underline | fontsizeselect | forecolor ' +
          'backcolor | alignleft aligncenter alignright alignjustify | bullist numlist ' +
          'outdent indent',
        toolbar2: 'template | image | link | table | code',
      };
    }

    self.insertTemplate = function() {
      tinymce.activeEditor.buttons.template.onclick();
    };

    self.sourceCodeCopied = function() {
      NotificationService.success('Código-fonte copiado');
    };

    self.sourceCodeCopyError = function(error) {
      NotificationService.error('Não foi possível copiar o código-fonte', error);
    };

    // Busca todos os templates
    var templateSearchParameters = {
      q: {
        order_by: [{
          field: 'name',
          direction: 'asc',
        }],
      },
      results_per_page: 1000,
    };

    SellerTemplateSearchService.search(templateSearchParameters).then(function(response) {
      self.loadingTemplates = false;
      initEditor(response.result);
    }, function(error) {
      NotificationService.error('Não foi possível listar os templates', error);

      self.loadingTemplates = false;
      initEditor(response.result);
    });
  }
])

;
