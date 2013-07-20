///<reference path='..\..\..\Scripts\Postback.ts'/>

(function () {

    var CodeMirror = (<any>window).CodeMirror;

    var keywords = (
        "TotalPoints TypeName TeamName TransfersOut Code EventTotal LastSeasonPoints TransfersBalance EventCost WebName InDreamteam " +
        "TeamCode Id FirstName TransfersOutEvent ElementTypeId MaxCost Selected MinCost Status Form CurrentFixture NowCost PointsPerGame " +
        "TransfersIn OriginalCost EventPoints NextFixture TransfersInEvent SelectedBy TeamId SecondName")
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
