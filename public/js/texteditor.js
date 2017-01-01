var TextEditor = function(containerName) {
  //PROTOTYPE FUNCTIONS
  TextEditor.prototype.generateN = function(n, options) {
    var current_elem = jQuery(this.name);
    var current_parent = current_elem.parent();
    this.count = n;
    current_elem.remove();
    for (var i=0; i<n; i++) {
      newClass = this.name.replace(/\./g,'') + i.toString(); 
      current_parent.append('<div class=' + newClass + '></div>');
      var textEditor = new TextEditor('.' + newClass);
      textEditor.init(options);
      textEditor.show();
    }
  }

  TextEditor.prototype.singleToolbar = function() {
    var fixed_toolbar = jQuery(this.name + '0 .toolbar');
    fixed_toolbar.addClass('fixed-toolbar');
    for (var i=1; i < this.count; i++) {
      jQuery(this.name + i.toString() + ' .toolbar').hide();
    }
  }

  TextEditor.prototype.persistData = function(data) {
    jQuery(this.name + ' #editor')['0'].innerHTML = data;
    var _this = this;
    var parsed = jQuery.parseHTML(data);
    var codeflask_objects = { }
    for (var elem of parsed) {
      if (elem.className === 'CodeFlask') {
        var curr_lang = _this.getFlaskLanguage(elem)
        if (curr_lang === 'STOP') { break; }
        if (curr_lang === 'javascript') { curr_lang = 'js'; }
        codeflask_objects[elem.id] = curr_lang;
      }
    }
    for (var codeflask in codeflask_objects) {
      var flask = new CodeFlask;
      flask.run('#' + codeflask, {language: codeflask_objects[codeflask]});
    }
  }

  TextEditor.prototype.getFlaskLanguage = function(elem) {
    try {
      for (var child of elem.children) {
        if (child.classList.contains('CodeFlask__pre')) {
          for (className of child.classList) {
            if(className.indexOf('language') !== -1) {
              return className.slice(9);
            }
          }
        }
      }
    } 
    catch(e) { return 'STOP' }
  }

  TextEditor.prototype.addCodelinkListeners = function() {
    var _this = this;
    jQuery(this.name + ' .toolbar .code-wrapper').hover(function(){
      try { _this.correct_range = window.getSelection().getRangeAt(0); }
      catch(e) { }
    })
    jQuery(this.name + ' .toolbar .code-wrapper .code-palette .language-link').click(function() {
      _this.addCodeBlock(_this.languageMap[jQuery(this).text()], _this.correct_range);
    })
  }

  TextEditor.prototype.createCodeSelector = function() {
    var codePalette = jQuery(this.name + ' .toolbar .code-wrapper .code-palette')
    for(var language in this.languageMap) {
      codePalette.append('<div class = "language-link" >'+language+'</div>');
    }
  }

  TextEditor.prototype.addCodeBlock = function(language, range) {
    var codeLanguage = language || 'markup';
    //console.log(range);
    try {
      var strippedName = this.name.replace(/\#/g,'').replace(/\./g,'');
      var id = strippedName +  this.codeblock.count;

      this.codeblock.ids.push(id);
      this.codeblock.count = this.codeblock.count + 1;

      var newElement = document.createElement('div');
      newElement.id = id;
      my_parent = range.startContainer.parentNode.parentNode.id;
      if(my_parent === "editor" || my_parent === strippedName) {
        range.deleteContents();
        range.insertNode(newElement);
        var code_block = jQuery('#'+id);
        code_block.height(100);
        code_block.css('border', '1px solid red');
        code_block.css('border-radius', '20px');
        code_block.css('margin', '5px');

        var flask = new CodeFlask;
        flask.run('#'+ id, {language: language});
        flask.update('/* Your Code Here */');
      } else {
        throw "Not in right box"
      }
    } catch(e) {
      window.alert('Please place the cursor inside the textbox');
    }
  }
  TextEditor.prototype.toolbarElements = {
    undo: '<a href="javascript:" data-command="undo"><i class="fa fa-undo"></i></a>',
    redo: '<a href="javascript:" data-command="redo"><i class="fa fa-repeat"></i></a>',
    forecolor: '<div class="fore-wrapper"><i class="fa fa-font" style="color:#C96;"></i>'
      +'<div class="fore-palette">'
      +  '</div>'
      +'</div>',

    backcolor:  '<div class="back-wrapper"><i class="fa fa-font" style="background:#C96;"></i>'
      +'<div class="back-palette">'
      +  '</div>'
      +'</div>',
    bold: '<a href="javascript:" data-command="bold"><i class="fa fa-bold"></i></a>',
    italic: '<a href="javascript:" data-command="italic"><i class="fa fa-italic"></i></a>',
    underline: '<a href="javascript:" data-command="underline"><i class="fa fa-underline"></i></a>',
    strikeThrough: '<a href="javascript:" data-command="strikeThrough"><i class="fa fa-strikethrough"></i></a>',
    justifyLeft: '<a href="javascript:" data-command="justifyLeft"><i class="fa fa-align-left"></i></a>',
    justifyCenter: '<a href="javascript:" data-command="justifyCenter"><i class="fa fa-align-center"></i></a>',
    justifyRight: '<a href="javascript:" data-command="justifyRight"><i class="fa fa-align-right"></i></a>',
    justifyFull: '<a href="javascript:" data-command="justifyFull"><i class="fa fa-align-justify"></i></a>',
    indent: '<a href="javascript:" data-command="indent"><i class="fa fa-indent"></i></a>',
    outdent: '<a href="javascript:" data-command="outdent"><i class="fa fa-outdent"></i></a>',
    insertUnorderedList: '<a href="javascript:" data-command="insertUnorderedList"><i class="fa fa-list-ul"></i></a>',
    insertOrderedList: '<a href="javascript:" data-command="insertOrderedList"><i class="fa fa-list-ol"></i></a>',
    h1: '<a href="javascript:" data-command="h1">H1</a>',
    h2: '<a href="javascript:" data-command="h2">H2</a>',
    createlink: '<a href="javascript:" data-command="createlink"><i class="fa fa-link"></i></a>',
    unlink: '<a href="javascript:" data-command="unlink"><i class="fa fa-unlink"></i></a>',
    insertimage: '<a href="javascript:" data-command="insertimage"><i class="fa fa-image"></i></a>',
    p: '<a href="javascript:" data-command="p">P</a>',
    subscript: '<a href="javascript:" data-command="subscript"><i class="fa fa-subscript"></i></a>',
    superscript: '<a href="javascript:" data-command="superscript"><i class="fa fa-superscript"></i></a>',
    code: '<div class="code-wrapper"><i class="fa fa-code" style="color:#C96;"></i>'
      +'<div class="code-palette">'
      +  '</div>'
      +'</div>'

  }

  TextEditor.prototype.buildFramework = function() {
    jQuery(this.name).append(
      '<div class="toolbar">'
        + '</div>'
        + '<div id="editor" contenteditable>'
        +   '<p>Try making some changes here. Add your own text or maybe an image.</p>'
        + '</div>'
    );
    return this;
  }

  //LOCAL FUNCTIONS
  this.name = containerName;
  this.codeblock = { }
  this.codeblock.count = 0;
  this.codeblock.ids = []
  this.languageMap = {
    'Javascript': 'js',
    'HTML/ Markup': 'markup',
    'CSS' : 'css',
    'Other': ''
  }

  this.init = function(toolbarOptions) {
    this.buildFramework().buildToolbar(toolbarOptions);
    return this;
  }


  this.buildToolbar = function(toolbarOptions) {

    this.colorPalette = ['000000', 'FF9966', '6699FF', '99FF66', 'CC0000', '00CC00', '0000CC', '333333', '0066FF', 'FFFFFF'];
    this.toolbarOptions = toolbarOptions || ["code", "undo", "redo", "bold", "forecolor", "insertimage"];

    var appendString = '';
    if(this.toolbarOptions === "all") {
      for (var element in this.toolbarElements) {
        appendString += this.toolbarElements[element];
      }
    } else {
      for(var option of this.toolbarOptions) {
        appendString += this.toolbarElements[option];
      };
    }
    jQuery(this.name + ' .toolbar').append(appendString);
    return this;
  }

  this.show = function() {


    if(this.toolbarOptions.indexOf("forecolor") != -1 || this.toolbarOptions === 'all') {
      this.forePalette = jQuery(this.name + ' .fore-palette');
      for (var i = 0; i < this.colorPalette.length; i++) {
        this.forePalette.append('<a href="javascript:" data-command="forecolor" data-value="' + '#' + this.colorPalette[i] + '" style="background-color:' + '#' + this.colorPalette[i] + ';" class="palette-item"></a>');
      }
    }

    if(this.toolbarOptions.indexOf("backcolor") != -1 || this.toolbarOptions === 'all') {
      this.forePalette = jQuery(this.name + ' .fore-palette');

      this.backPalette = jQuery(this.name + ' .back-palette');
      for (var i = 0; i < this.colorPalette.length; i++) {
        this.backPalette.append('<a href="javascript:" data-command="backcolor" data-value="' + '#' + this.colorPalette[i] + '" style="background-color:' + '#' + this.colorPalette[i] + ';" class="palette-item"></a>');
      }
    }

    if(this.toolbarOptions.indexOf("code") != -1 || this.toolbarOptions === 'all') {
      this.createCodeSelector();
      this.addCodelinkListeners()
    }

    var _this = this;

    jQuery(this.name + ' .toolbar a').click(function(e) {
      var command = jQuery(this).data('command');
      if (command == 'h1' || command == 'h2' || command == 'p') {
        document.execCommand('formatBlock', false, command);
      }
      if (command == 'forecolor' || command == 'backcolor') {
        document.execCommand(jQuery(this).data('command'), false, jQuery(this).data('value'));
      }
      if (command == 'createlink' || command == 'insertimage') {
        url = prompt('Enter the link here: ', 'http:\/\/');
        document.execCommand(jQuery(this).data('command'), false, url);
      } else {
        document.execCommand(jQuery(this).data('command'), false, null);
      }
    });

    return this;
  }

}

