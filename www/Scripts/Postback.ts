///<reference path='typings\jquery\jquery.d.ts'/>

module Postback {

    var $ = jQuery;

    class NameDefinitionPair {
        constructor(public name: string, public definition: string) { }
    }

    class Format {

        private static toReadableEnglish(value: string): string {

            var readableEnglish;

            function matchField(fieldName: string): bool {
                if (value == fieldName.toLowerCase()) {
                    readableEnglish = fieldName;
                    return false;
                }
                return true;
            }

            $(".Fields label").each(function () {
                return matchField($(this).text());
            });

            if (readableEnglish === undefined) {
                $(".Define input").each(function () {
                    return matchField($(this).val());
                });
            }
            
            if (readableEnglish === undefined) {
                if (value == "name") {
                    readableEnglish = "Name";
                }
            }
            
            if (readableEnglish === undefined) {
                readableEnglish = value;
            }

            return readableEnglish;
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

            var table: string = "<table><thead>" + headingRow + "</thead><tbody>" + rows.join("") + "</tbody></table>";
            return table;
        }
    }

    function callback(json: Array) {

        if (json && json.length > 0) {
            var table: string = Format.toHtmlTable(json);
            var $table: any = $("#result").html(table).find("table");
            $table.tablesorter();
        } else {
            $("#result").html("No results");
        }
    }

    function submit() {
        var query = QueryBuilder.build();
        $.getJSON(
            "Node/server.js",
            { code: query },
            callback
        );
        return false;
    }

    function init() {

        ["TotalPoints", "Cost", "TypeName", "TeamName", "Form", "EventPoints", "NextFixture", "News"].forEach(
            f => $(".Fields label:contains('" + f + "')").addClass("on")
        );
        
        $("form#statsForm").submit(submit);
        setTimeout(submit, 1);
    }

    class QueryBuilder {
        public static build(): string {
            var query = QueryBuilder.define() + QueryBuilder.select() + QueryBuilder.where();
            $("#code").val(query);
            return query;
        }

        private static select(): string {
            var select = "\r\nselect Name ";

            var $selectedFields = $(".Fields label.on");
            if ($selectedFields.length == 0) {
                $selectedFields = $(".Fields label");
            }

            var v = $selectedFields.each(function () {
                select += $(this).text() + " ";
            });
            
            var definitions: NameDefinitionPair[] = QueryBuilder.definitions();
            definitions.forEach(pair => select += pair.name + " ");

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
                appendClause("cost <= " + maxCost);
            }

            var teamFilter = QueryBuilder.filter($("fieldset.Teams"), "TeamName");
            if (teamFilter) {
                appendClause(teamFilter);
            }

            var positionFilter = QueryBuilder.filter($("fieldset.Positions"), "TypeName");
            if (positionFilter) {
                appendClause(positionFilter);
            }

            if (where != "") {
                where = "\r\nwhere " + where;
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

        private static define(): string {

            var definitions: NameDefinitionPair[] = QueryBuilder.definitions();
            
            var define = definitions
                .map(pair => "\r\ndefine (" + pair.definition + ") as " + pair.name)
                .join("");

            return define;
        }

        private static definitions(): NameDefinitionPair[] {

            var $fieldset = $("fieldset.Define");
            var $names = $fieldset.find("input");
            var $definitions = $fieldset.find("textarea.definition");

            var result: NameDefinitionPair[] = [];

            $names.each(function (index) {

                var name: string = $($names[index]).val();
                name = name.replace(/\W/g, "_");

                var editor = $($definitions[index]).data("editor");
                var definition: string = editor.getValue();

                if (name.length > 0 && definition.length > 0) {
                    result.push(new NameDefinitionPair(name, definition));
                }
            });

            return result;
        }
    }


    $(document).ready(init);
}
