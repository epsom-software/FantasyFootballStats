///<reference path='typings\jquery\jquery.d.ts'/>
var CodeEditor;
(function (CodeEditor) {
    var $ = jQuery;
    $(document).ready(function () {
        var CodeMirror = (window).CodeMirror;

        $("fieldset.Define textarea").each(function () {
            CodeMirror.fromTextArea(this, {
                onKeyEvent: function (e, s) {
                    if (s.type == "keyup") {
                        var isLetter = s.keyCode >= 65 && s.keyCode <= 90;

                        if (isLetter || s.keyCode == 32 || s.keyCode == 8) {
                            CodeMirror.showHint(e);
                        }
                    }
                },
                lineWrapping: true
            });
        });
    });
})(CodeEditor || (CodeEditor = {}));
//@ sourceMappingURL=CodeEditor.js.map
