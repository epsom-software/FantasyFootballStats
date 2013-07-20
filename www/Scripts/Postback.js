///<reference path='Definitions\jquery.d.ts'/>
var Postback;
(function (Postback) {
    var Format = (function () {
        function Format() {
        }
        Format.toReadableEnglish = function (value) {
            return value.charAt(0).toUpperCase() + value.slice(1);
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

            function appendClause(clause) {
                if (where == "") {
                    where = " (" + clause + ") ";
                } else {
                    where += " and (" + clause + ") ";
                }
            }

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
                appendClause("cost <= " + maxCost);
            }

            var teamFilter = QueryBuilder.filter($(".Teams"), "TeamName");
            if (teamFilter) {
                appendClause(teamFilter);
            }

            var positionFilter = QueryBuilder.filter($(".Positions"), "TypeName");
            if (positionFilter) {
                appendClause(positionFilter);
            }

            if (where != "") {
                where = " where " + where;
            }

            return where;
        };

        QueryBuilder.filter = function ($fieldset, field) {
            var values = [];

            var totalNumberOfLabels = $fieldset.find("label").length;

            $fieldset.find("label.on").each(function () {
                values.push($(this).text());
            });

            if (values.length > 0 && values.length < totalNumberOfLabels) {
                var filter = values.map(function (v) {
                    return " (" + field + " = '" + v + "') ";
                }).join(" or ");
                return filter;
            } else {
                return null;
            }
        };
        return QueryBuilder;
    })();

    $(document).ready(init);
})(Postback || (Postback = {}));
//@ sourceMappingURL=Postback.js.map
