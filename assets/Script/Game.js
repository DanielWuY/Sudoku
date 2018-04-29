cc.Class({
	extends: cc.Component,

	properties: {
		usedTime: {
			type: cc.Label,
			default: null
		},
		_usedTime: 0,
		_isPaused: false
	},

	onLoad() {
		window.globalEvent = new cc.EventTarget();
		globalEvent.on('GAME_START', this._onGameStart, this);
		globalEvent.on('GAME_PAUSE', this._onGamePause, this);
		globalEvent.on('GAME_RESUME', this._onGameResume, this);
	},

	update(dt) {
		if (this._isPaused) {
			return;
		}

		this._usedTime += dt;
		this.usedTime.string = this._formatTimeString();
	},

	onDestroy() {
		globalEvent.off('GAME_START', this._onGameStart, this);
		globalEvent.off('GAME_PAUSE', this._onGamePause, this);
		globalEvent.off('GAME_RESUME', this._onGameResume, this);
	},

	_onGameStart() {
		this._usedTime = 0;
	},

	_onGamePause() {
		this._isPaused = true;
	},

	_onGameResume() {
		this._isPaused = false;
	},

	_formatTimeString() {
		let seconds = Math.ceil(this._usedTime);
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
