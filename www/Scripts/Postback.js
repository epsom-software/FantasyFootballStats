///<reference path='typings\jquery\jquery.d.ts'/>
var Postback;
(function (Postback) {
    var $ = jQuery;

    var NameDefinitionPair = (function () {
        function NameDefinitionPair(name, definition) {
            this.name = name;
            this.definition = definition;
        }
        return NameDefinitionPair;
    })();

    var Format = (function () {
        function Format() {
        }
        Format.toReadableEnglish = function (value) {
            var readableEnglish;

            function matchField(fieldName) {
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

            var table = "<table><thead>" + headingRow + "</thead><tbody>" + rows.join("") + "</tbody></table>";
            return table;
        };
        return Format;
    })();

    function callback(json) {
        if (json && json.length > 0) {
            var table = Format.toHtmlTable(json);
            var $table = $("#result").html(table).find("table");
            $table.tablesorter();
        } else {
            $("#result").html("No results");
        }
    }

    function init() {
        $("form#statsForm").submit(function () {
            $.getJSON("Node/server.js", { code: $("#code").val() }, callback);
            return false;
        }).find("input").last().click().click(QueryBuilder.build);
    }

    var QueryBuilder = (function () {
        function QueryBuilder() {
        }
        QueryBuilder.build = function () {
            var query = QueryBuilder.define() + QueryBuilder.select() + QueryBuilder.where();
            $("#code").val(query);
            return query;
        };

        QueryBuilder.select = function () {
            var select = "\r\nselect Name ";

            var $selectedFields = $(".Fields label.on");
            if ($selectedFields.length == 0) {
                $selectedFields = $(".Fields label");
            }

            var v = $selectedFields.each(function () {
                select += $(this).text() + " ";
            });

            var definitions = QueryBuilder.definitions();
            definitions.forEach(function (pair) {
                return select += pair.name + " ";
            });

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

        QueryBuilder.define = function () {
            var definitions = QueryBuilder.definitions();

            var define = definitions.map(function (pair) {
                return "\r\ndefine (" + pair.definition + ") as " + pair.name;
            }).join("");

            return define;
        };

        QueryBuilder.definitions = function () {
            var $fieldset = $("fieldset.Define");
            var $names = $fieldset.find("input");
            var $definitions = $fieldset.find("textarea.definition");

            var result = [];

            $names.each(function (index) {
                var name = $($names[index]).val();
                name = name.replace(/\W/g, "_");

                var editor = $($definitions[index]).data("editor");
                var definition = editor.getValue();

                if (name.length > 0 && definition.length > 0) {
                    result.push(new NameDefinitionPair(name, definition));
                }
            });

            return result;
        };
        return QueryBuilder;
    })();

    $(document).ready(init);
})(Postback || (Postback = {}));
//@ sourceMappingURL=Postback.js.map
