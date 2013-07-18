///<reference path='Definitions\jquery.d.ts'/>

module Postback {

    class Format {

        static toReadableEnglish(value: string): string {
            return value.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
        }

        static toHtmlRow(values: string[], dataElementName: string): string {
            var tableDatas: string = values.join("</" + dataElementName + "><" + dataElementName + ">");
            var row: string = "<tr><" + dataElementName + ">" + tableDatas + "</" + dataElementName + "></tr>";
            return row;
        }

        public static toHtmlTable(values: Array): string {

            var keys: Array = Object.keys(values[0]);

            var headingRow = Format.toHtmlRow(keys.map(Format.toReadableEnglish), "th");

            var rows: string[] = values.map(player => {
                var values: Array = keys.map(k => player[k]);
                var row = Format.toHtmlRow(values, "td");
                return row
            })

            var table: string = "<table>" + headingRow + rows.join("") + "</table>";
            return table;
        }
    }

    function callback(json: Array) {

        if (json && json.length > 0) {
            var table: string = Format.toHtmlTable(json);
            $("#result").html(table);
        }
    }

    function init() {
        $("form#statsForm").submit(function () {
            $.getJSON(
                "Node/server.js",
                { code: $("#code").val() },
                callback
                );
            return false;
        });

        $("input").last().click();
    }

    $(document).ready(init);
}