///<reference path='Definitions\jquery.d.ts'/>
$(document).ready(function () {
    function toReadableEnglish(value) {
        return value.split("_").map(function (word) {
            return word.charAt(0).toUpperCase() + word.slice(1);
        }).join(" ");
    }

    function toHtmlRow(values, dataElementName) {
        var tableDatas = values.join("</" + dataElementName + "><" + dataElementName + ">");
        var row = "<tr><" + dataElementName + ">" + tableDatas + "</" + dataElementName + "></tr>";
        return row;
    }

    function callback(json) {
        if (json && json.length > 0) {
            var keys = Object.keys(json[0]);

            var headingRow = toHtmlRow(keys.map(toReadableEnglish), "th");

            var rows = json.map(function (player) {
                var values = keys.map(function (k) {
                    return player[k];
                });
                var row = toHtmlRow(values, "td");
                return row;
            });

            var table = "<table>" + headingRow + rows.join("") + "</table>";

            $("#result").html(table);
        }
    }

    $("form#statsForm").submit(function () {
        $.getJSON("Node/server.js", { code: $("#code").val() }, callback);
        return false;
    });

    $("input").last().click();
});
//@ sourceMappingURL=Postback.js.map
