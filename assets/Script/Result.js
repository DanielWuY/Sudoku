cc.Class({
	extends: cc.Component,

	properties: {
		btnRestart: {
			type: cc.Button,
			default: null
		}
	},

	onLoad() {
		this.btnRestart.node.on('click', this._onClickRestart, this);
	},

	start() { },

	_onClickRestart(event) {
		console.log('restart');
		cc.director.loadScene('Main');
	}
});
