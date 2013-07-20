///<reference path='Definitions\jquery.d.ts'/>

module Postback {

    class Format {

        public static toReadableEnglish(value: string): string {
            return value.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
        }

        private static toHtmlRow(values: string[], dataElementName: string): string {
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
            $.getJSON(
                "Node/server.js",
                { code: $("#code").val() },
                callback
                );
            return false;
        });

        $("input").last().click().click(QueryBuilder.build);
    }

    class QueryBuilder {
        public static build(): string {
            var query = QueryBuilder.select() + QueryBuilder.where();
            $("#code").val(query);
            return query;
        }

        private static select(): string {
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
        }

        private static where(): string {

            var where = "";

            function appendClause(clause: string) {
                if (where == "") {
                    where = " (" + clause + ") ";
                } else {
                    where += " and (" + clause + ") ";
                }
            }

            var maxCost: number = (function () {
                var maxCost: any = $("input[name=maxCost]").val();
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
                appendClause("now_cost <= " + maxCost);
            }
            
            var teamFilter = QueryBuilder.filter($(".Teams"), "team_name");
            if (teamFilter) {
                appendClause(teamFilter);
            }

            var positionFilter = QueryBuilder.filter($(".Positions"), "type_name");
            if (positionFilter) {
                appendClause(positionFilter);
            }

            if (where != "") {
                where = " where " + where;
            }

            return where;
        }

        private static filter($fieldset: JQuery, field: string): string {
            
            var values: string[] = [];

            var totalNumberOfLabels = $fieldset.find("label").length;

            $fieldset.find("label.on").each(function () {
                values.push($(this).text());
            });

            if (values.length > 0 && values.length < totalNumberOfLabels) {

                var filter = values.map(v => " (" + field + " = '" + v + "') ").join(" or ");
                return filter;
            } else {
                return null;
            }
        }
    }


    $(document).ready(init);
}