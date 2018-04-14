cc.Class({
	extends: cc.Component,

	properties: {
		number: {
			type: cc.Button,
			default: null
		}
	},

	onLoad () {
		let clickEventHandler = new cc.Component.EventHandler();
		clickEventHandler.target = this.node;
		clickEventHandler.component = "Number";
		clickEventHandler.handler = "onClickNumber";
		clickEventHandler.customEventData = {
			'number': (parseInt(this.node.name.substr(6)) || 0) + 1,
		};

		let button = this.node.getComponent(cc.Button);
		button.clickEvents.push(clickEventHandler);
	},

	start () {},

	onClickNumber(event, customEventData) {
		globalEvent.emit('NUMBER_CLICKED', customEventData);
	}
});
