///<reference path='typings\jquery\jquery.d.ts'/>

module CodeEditor{

    var $ = jQuery;
    var CodeMirror = (<any>window).CodeMirror;

    CodeMirror.commands.autocomplete = function (cm) {
        CodeMirror.showHint(cm, CodeMirror.hint.javascript);
    }
    var editor = CodeMirror.fromTextArea($("fieldset.Define textarea")[0], {
        onKeyEvent: function (e, s) {
            if (s.type == "keyup") {
                console.log(CodeMirror.showHint(e));
            }
        }
    });
}
