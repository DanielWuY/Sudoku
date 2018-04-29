cc.Class({
	extends: cc.Component,

	properties: {
		number: {
			type: cc.Button,
			default: null
		},

		_isMark: false
	},

	onLoad() {
		let clickEventHandler = new cc.Component.EventHandler();
		clickEventHandler.target = this.node;
		clickEventHandler.component = "Number";
		clickEventHandler.handler = "onClickNumber";
		clickEventHandler.customEventData = {
			'number': (parseInt(this.node.name.substr(6)) || 0) + 1,
		};

		let button = this.node.getComponent(cc.Button);
		button.clickEvents.push(clickEventHandler);

		this._isMark = false;
		this._setColor();

		globalEvent.on('MARK', this._onMarked, this);
	},

	onDestroy() {
		globalEvent.off('MARK', this._onMarked, this);
	},

	start() { },

	onClickNumber(event, customEventData) {
		globalEvent.emit('NUMBER_CLICKED', customEventData);
	},

	_onMarked() {
		this._isMark = !this._isMark;
		this._setColor();
	},

	_setColor() {
		let label = this.number.node.getChildByName('Label');
		if (this._isMark) {
			label.color = new cc.Color(187, 187, 187);
		} else {
			label.color = new cc.Color(3, 80, 165);
		}
	}
});
