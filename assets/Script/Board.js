import {Sudoku} from './Core/Sudoku'
import {Utils} from './Core/Utils'
import {Box} from './Box';

cc.Class({
	extends: cc.Component,

	properties: {
		boxes: {
			type: [Box],
			default: []
		},

		_puzzle: null,
		_lastSelected: null
	},

	onLoad () {
		this._puzzle = new Sudoku().make('hard');
		this._puzzle.forEach((rowValue, rowIndex) => {
			rowValue.forEach((cellValue, colIndex) => {
				let {boxIndex, cellIndex} = Utils.box.convertToBoxIndex(rowIndex, colIndex);
				let cell = this.boxes[boxIndex].getComponent(Box).getCell(cellIndex);
				cell.setIndex(boxIndex, cellIndex);
				cell.labelNum.string = cellValue ? cellValue : '';
				cell.labelNum.node.color = cellValue ? new cc.Color(0, 0, 0) : new cc.Color(3, 80, 165);
				cell.getComponent(cc.Button).interactable = cellValue === 0;
			})
		});

		globalEvent.on('CELL_SELECTED', this._onCellSelected, this);
		globalEvent.on('NUMBER_CLICKED', this._onNumberClicked, this);
	},

	start () {},

	onDestroy () {
		globalEvent.off('CELL_SELECTED', this._onCellSelected, this);
		globalEvent.off('NUMBER_CLICKED', this._onNumberClicked, this);
	},

	_onCellSelected (event) {
		if (this._lastSelected) {
			let cell = this.boxes[this._lastSelected.boxIndex].getComponent(Box).getCell(this._lastSelected.cellIndex);
		}
		this._lastSelected = event.detail;
	},

	_onNumberClicked (event) {
		if (!this._lastSelected) {
			return;
		}

		let cell = this.boxes[this._lastSelected.boxIndex].getComponent(Box).getCell(this._lastSelected.cellIndex);
		cell.labelNum.string = event.detail.number;
	}
});
