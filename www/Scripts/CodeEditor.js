///<reference path='typings\jquery\jquery.d.ts'/>
var CodeEditor;
(function (CodeEditor) {
    var $ = jQuery;
    var CodeMirror = (window).CodeMirror;

    CodeMirror.commands.autocomplete = function (cm) {
        CodeMirror.showHint(cm, CodeMirror.hint.javascript);
    };
    var editor = CodeMirror.fromTextArea($("fieldset.Define textarea")[0], {
        onKeyEvent: function (e, s) {
            if (s.type == "keyup") {
                console.log(CodeMirror.showHint(e));
            }
        }
    });
})(CodeEditor || (CodeEditor = {}));
//@ sourceMappingURL=CodeEditor.js.map
