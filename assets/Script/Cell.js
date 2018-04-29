const Cell = cc.Class({
	extends: cc.Component,

	properties: {
		labelNum: {
			type: cc.Label,
			default: null
		},

		labelMarks: {
			type: [cc.Label],
			default: []
		},

		_boxIndex: null,
		_cellIndex: null
	},

	onLoad() {
		this.clearMarks();

		let clickEventHandler = new cc.Component.EventHandler();
		clickEventHandler.target = this.node;
		clickEventHandler.component = "Cell";
		clickEventHandler.handler = "onClickCell";
		clickEventHandler.customEventData = { boxIndex: this._boxIndex, cellIndex: this._cellIndex };

		let button = this.node.getComponent(cc.Button);
		button.clickEvents.push(clickEventHandler);
	},

	start() { },

	onClickCell(event, customEventData) {
		globalEvent.emit('CELL_SELECTED', customEventData);
	},

	setIndex(boxIndex, cellIndex) {
		this._boxIndex = boxIndex;
		this._cellIndex = cellIndex;
	},

	clearMarks() {
		for (let labelMark of this.labelMarks) {
			labelMark.node.active = false;
		}
	}
});

export { Cell };
