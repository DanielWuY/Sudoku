cc.Class({
	extends: cc.Component,

	properties: {
		usedTime: {
			type: cc.Label,
			default: null
		},
		_startTime:  0
	},

	onLoad() {
		window.globalEvent = new cc.EventTarget();
		globalEvent.on('GAME_START', this._onGameStart, this);
	},

	update () {
		this.usedTime.string = this._formatTimeString();
	},

	onDestroy () {
		globalEvent.off('GAME_START', this._onGameStart, this);
	},

	_onGameStart() {
		this._startTime = Date.now();
	},

	_formatTimeString() {
		if (this._startTime === 0) {
			return '00:00:00';
		}

		let seconds = Math.ceil((Date.now() - this._startTime) / 1000);
		let hours = Math.floor(seconds / 3600);
		seconds %= 3600;
		let minutes = Math.floor(seconds / 60);
		seconds %= 60;

		if (hours < 10) {
			hours = '0' + hours;
		}
		if (minutes < 10) {
			minutes = '0' + minutes;
		}
		if (seconds < 10) {
			seconds = '0' + seconds;
		}

		return `${hours}:${minutes}:${seconds}`;
	},
});
