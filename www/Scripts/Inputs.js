///<reference path='Definitions\jquery.d.ts'/>
$(document).ready(function () {
    var $selectors = $("input[type=radio], input[type=checkbox]");

    //See if the radios and checkboxen are checked, and then toggle the cssClass accordingly.
    //Do this for all the inputs on the page, so that we can be sure they are all in sync.
    function syncLabelStyleToInputValue() {
        $selectors.each(function () {
            var id = $(this).attr("id");
            var $label = $("label[for=" + id + "]");
            $label.toggleClass("on", this.checked);
        });
    }

    $selectors.change(syncLabelStyleToInputValue);
    syncLabelStyleToInputValue();

    ///When a legend is clicked, turn on it's checkboxen, unless they were all already on.
    $("legend").click(function () {
        var $checkboxen = $(this).siblings("input[type=checkbox]");
        var numberNotChecked = $checkboxen.not(":checked").length;
        var turnOn = numberNotChecked > 0;
        $checkboxen.prop('checked', turnOn);
        syncLabelStyleToInputValue();
    });
});
//@ sourceMappingURL=Inputs.js.map
