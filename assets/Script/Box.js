import { Cell } from './Cell';

const Box = cc.Class({
	extends: cc.Component,

	properties: {
		cells: {
			type: [Cell],
			default: [],
		},
	},

	onLoad() { },

	start() { },

	getCell(cellIndex) {
		return this.cells[cellIndex].getComponent(Cell);
	}
});

export { Box };
