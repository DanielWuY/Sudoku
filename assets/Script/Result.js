cc.Class({
	extends: cc.Component,

	properties: {},

	onLoad() {
		this.node.active = false;

		globalEvent.on('NEW', this._onNewGame, this);
		globalEvent.on('GAME_FINISH', this._onGameFinish, this);
	},

	onDestroy() {
		globalEvent.off('NEW', this._onNewGame, this);
		globalEvent.off('GAME_FINISH', this._onGameFinish, this);
	},

	start() { },

	_onNewGame() {
		this.node.active = false;
	},

	_onGameFinish() {
		this.node.active = true;
	}
});
