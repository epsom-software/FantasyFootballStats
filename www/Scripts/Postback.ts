///<reference path='Definitions\jquery.d.ts'/>

$(document).ready(function () {
    
    function toHtmlRow(values: string[], dataElementName: string) {
        var tableDatas: string = values.join("</" + dataElementName + "><" + dataElementName + ">");
        var row: string = "<tr><" + dataElementName + ">" + tableDatas + "</" + dataElementName + "></tr>";
        return row;
    }
    
    function callback(json: Array) {

        if (json && json.length > 0) {

            var keys: Array = Object.keys(json[0]);

            var headingRow = toHtmlRow(keys, "th");

            var rows: string[] = json.map(player => {
                var values: Array = keys.map(k => player[k]);
                var row = toHtmlRow(values, "td");
                return row
            })

            var table: string = "<table>" + headingRow + rows.join("") + "</table>";

            $("#result").html(table);
        }
    }

    $("form#statsForm").submit(function () {
        $.getJSON(
            "Node/server.js",
            { code: $("#code").val() },
            callback
            );
        return false;
    });

    $("input").last().click();
});
