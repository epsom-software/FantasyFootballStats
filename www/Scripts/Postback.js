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
        } else {
            $("#result").html("No results");
        }
    }

    function init() {
        $(".Fields label").each(function () {
            var field = $(this).text();
            field = Format.toReadableEnglish(field);
            $(this).text(field);
        });

        $("form#statsForm").submit(function () {
            $.getJSON("Node/server.js", { code: $("#code").val() }, callback);
            return false;
        });

        $("input").last().click().click(QueryBuilder.build);
    }

    var QueryBuilder = (function () {
        function QueryBuilder() {
        }
        QueryBuilder.build = function () {
            var query = QueryBuilder.select() + QueryBuilder.where();
            $("#code").val(query);
            return query;
        };

        QueryBuilder.select = function () {
            var select = "";

            var v = $(".Fields label.on").each(function () {
                select += $(this).data("field") + " ";
            });

            if (select == "") {
                select = " select * ";
            } else {
                select = " select " + select;
            }

            return select;
        };

        QueryBuilder.where = function () {
            var where = "";

            var maxCost = (function () {
                var maxCost = $("input[name=maxCost]").val();
                if (maxCost) {
                    return parseFloat(maxCost);
                } else {
                    return 0;
                }
            })();

            if (maxCost > 0) {
                //For some reason the backend values are 10 times higher than the display values.
                //Need to think about how we want to handle this.
                maxCost *= 10;
                where += "(now_cost <= " + maxCost + ") ";
            }

            var teams = [];

            $(".Teams label.on").each(function () {
                teams.push($(this).text());
            });

            if (teams.length > 0 && teams.length < 20) {
                if (where != "") {
                    where += " and ";
                }

                var teamFilter = teams.map(function (t) {
                    return " (team_name = '" + t + "') ";
                }).join(" or ");
                where += " ( " + teamFilter + " ) ";
            }

            if (where != "") {
                where = " where " + where;
            }

            return where;
        };
        return QueryBuilder;
    })();

    $(document).ready(init);
})(Postback || (Postback = {}));
//@ sourceMappingURL=Postback.js.map
