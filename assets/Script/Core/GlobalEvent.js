cc.Class({
	extends: cc.Component,

	onLoad() {
		window.globalEvent = new cc.EventTarget();
		cc.director.preloadScene("Result", () => { });
	},

});