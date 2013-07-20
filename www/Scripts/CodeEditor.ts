///<reference path='typings\jquery\jquery.d.ts'/>

module CodeEditor {

    var $ = jQuery;
    $(document).ready(function () {

        var CodeMirror = (<any>window).CodeMirror;

        $("fieldset.Define textarea").each(function () {
            CodeMirror.fromTextArea(this, {
                onKeyEvent: function (e, s) {
                    if (s.type == "keyup") {
                        CodeMirror.showHint(e);
                    }
                },
                lineWrapping: true
            });
        });
    });
}
