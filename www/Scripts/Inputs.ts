///<reference path='typings\jquery\jquery.d.ts'/>

(function ($) {
    $(document).ready(function () {

        $(".boxen label").click(function () {
            
            $(this).toggleClass("on");

        }).dblclick(function () {
            
            $(this).addClass("on").siblings("label").removeClass("on");

        });

        ///When a legend is clicked, turn on it's labels, unless they were all already on.
        $(".boxen legend").click(function () {

            var $boxes: JQuery = $(this).siblings("label");
            var $offBoxes: JQuery = $boxes.not(".on");

            if ($offBoxes.length == 0) {
                $boxes.removeClass("on");
            } else {
                $offBoxes.addClass("on");
            }
        });
    });
})(jQuery);

