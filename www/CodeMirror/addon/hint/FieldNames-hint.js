///<reference path='..\..\..\Scripts\Postback.ts'/>
(function () {
    var CodeMirror = (window).CodeMirror;

    var keywords = ("Cost CurrentFixture EventCost EventPoints EventTotal FirstName Form InDreamteam LastSeasonPoints " + "MaxCost MinCost Name NextFixture OriginalCost PointsPerGame SecondName Selected SelectedBy Status " + "TeamName TotalPoints TransfersBalance TransfersIn TransfersInEvent TransfersOut TransfersOutEvent TypeName").split(" ");

    function hint(editor) {
        var cur = editor.getCursor();
        var token = editor.getTokenAt(cur);
        var word = token.string;

        var filteredKeywords;

        if (word.length > 0) {
            var regex = new RegExp(word, "i");
            filteredKeywords = keywords.filter(function (keyword) {
                return regex.test(keyword);
            });
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
//@ sourceMappingURL=FieldNames-hint.js.map
