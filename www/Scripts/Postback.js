///<reference path='Definitions\jquery.d.ts'/>
$(document).ready(function () {
    function callback(json) {
        for (var j in json) {
            $("#result").append("<hr />" + JSON.stringify(json[j]));
        }
    }

    $("form#statsForm").submit(function () {
        $.getJSON("Node/server.js", { code: $("#code").val() }, callback);
        return false;
    });
});
//@ sourceMappingURL=Postback.js.map
