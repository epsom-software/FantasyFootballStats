///<reference path='typings\jquery\jquery.d.ts'/>
var CodeEditor;
(function (CodeEditor) {
    var $ = jQuery;
    $(document).ready(function () {
        var CodeMirror = (window).CodeMirror;

        var editor = CodeMirror.fromTextArea($("fieldset.Define textarea")[0], {
            onKeyEvent: function (e, s) {
                if (s.type == "keyup") {
                    CodeMirror.showHint(e);
                }
            }
        });
    });
})(CodeEditor || (CodeEditor = {}));
//@ sourceMappingURL=CodeEditor.js.map
