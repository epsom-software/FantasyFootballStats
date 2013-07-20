var model;
(function (model) {
    var player = (function () {
        function player() {
        }
        player.prototype.toString = function () {
            return this.name;
        };
        return player;
    })();
    model.player = player;
})(model || (model = {}));
//@ sourceMappingURL=model.js.map
