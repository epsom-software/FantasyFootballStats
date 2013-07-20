///<reference path='typings\jquery\jquery.d.ts'/>

module CodeEditor {

    var $ = jQuery;
    $(document).ready(function () {

        var CodeMirror = (<any>window).CodeMirror;

        var editor = CodeMirror.fromTextArea($("fieldset.Define textarea")[0], {
            onKeyEvent: function (e, s) {
                if (s.type == "keyup") {
                    CodeMirror.showHint(e);
                }
            }
        });
    });
}
