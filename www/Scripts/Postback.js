///<reference path='Definitions\jquery.d.ts'/>
var Postback;
(function (Postback) {
    var Format = (function () {
        function Format() {
        }
        Format.toReadableEnglish = function (value) {
            return value.split("_").map(function (word) {
                return word.charAt(0).toUpperCase() + word.slice(1);
            }).join(" ");
        };

        Format.toHtmlRow = function (values, dataElementName) {
            var tableDatas = values.join("</" + dataElementName + "><" + dataElementName + ">");
            var row = "<tr><" + dataElementName + ">" + tableDatas + "</" + dataElementName + "></tr>";
            return row;
        };

        Format.toHtmlTable = function (values) {
            var keys = Object.keys(values[0]);

            var headingRow = Format.toHtmlRow(keys.map(Format.toReadableEnglish), "th");

            var rows = values.map(function (player) {
                var values = keys.map(function (k) {
                    return player[k];
                });
                var row = Format.toHtmlRow(values, "td");
                return row;
            });

            var table = "<table>" + headingRow + rows.join("") + "</table>";
            return table;
        };
        return Format;
    })();

    function callback(json) {
        if (json && json.length > 0) {
            var table = Format.toHtmlTable(json);
            $("#result").html(table);
        }
    }

    function init() {
        $("form#statsForm").submit(function () {
            $.getJSON("Node/server.js", { code: $("#code").val() }, callback);
            return false;
        });

        $("input").last().click();
    }

    $(document).ready(init);
})(Postback || (Postback = {}));
//@ sourceMappingURL=Postback.js.map
