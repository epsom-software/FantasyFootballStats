///<reference path='typings\jquery\jquery.d.ts'/>

module CodeEditor {

    var $ = jQuery;
    $(document).ready(function () {

        var CodeMirror = (<any>window).CodeMirror;

        $("fieldset.Define textarea").each(function () {
            var editor = CodeMirror.fromTextArea(this, {
                onKeyEvent: function (e, s) {

                    if (s.type == "keyup") {

                        var isLetter = s.keyCode >= 65 && s.keyCode <= 90;

                        if (isLetter
                            || s.keyCode == 32 //space
                            || s.keyCode == 8 //backspace
                            ) {
                            CodeMirror.showHint(e);
                        }
                    }
                },
                lineWrapping: true
            });

            $(this).data("editor", editor);
        });
    });
}
