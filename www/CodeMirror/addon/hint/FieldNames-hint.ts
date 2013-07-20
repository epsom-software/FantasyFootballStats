///<reference path='..\..\..\Scripts\Postback.ts'/>

(function () {

    var CodeMirror = (<any>window).CodeMirror;

    var keywords = ("total_points type_name team_name transfers_out code event_total last_season_points transfers_balance " +
        "event_cost web_name in_dreamteam team_code id first_name transfers_out_event element_type_id max_cost selected " +
        "min_cost status form current_fixture now_cost points_per_game transfers_in original_cost event_points next_fixture " +
        "transfers_in_event selected_by team_id second_name")
        .split(" ")
        .map(Postback.Format.toReadableEnglish);

    function hint(editor) {

        var cur = editor.getCursor();
        var token = editor.getTokenAt(cur);
        var word = token.string;

        var filteredKeywords;

        if (word.length > 0) {
            var regex = new RegExp(word, "i");
            filteredKeywords = keywords.filter((keyword: string) => regex.test(keyword));
        } else {
            filteredKeywords = keywords;
        }

        return {
            list: filteredKeywords,
            from: CodeMirror.Pos(cur.line, token.start),
            to: CodeMirror.Pos(cur.line, token.end)
        };
    }

    CodeMirror.registerHelper("hint", "javascript", hint);

})();
