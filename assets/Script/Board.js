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
		_lastSelected: null,
		_highlightCellIndexes: []
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
		this._unhighlightCells();
		this._highlightCells();
		this._lastSelected = event.detail;
	},

	_onNumberClicked (event) {
		if (!this._lastSelected) {
			return;
		}

		let cell = this.boxes[this._lastSelected.boxIndex].getComponent(Box).getCell(this._lastSelected.cellIndex);
		cell.labelNum.string = event.detail.number;
	}

	_unhighlightCells () {
		if(!this._lastSelected) {
			return;
		}

		this._highlightCellIndexes.forEach(([boxIndex, cellIndex]) => {
			let cell = this.boxes[boxIndex].getComponent(Box).getCell(cellIndex);
			// TODO unhighlight
		});

		this._highlightCellIndexes = [];
	}

	_highlightCells () {
		if (!this._lastSelected) {
			return;
		}

		let {rowIndex, colIndex} = Utils.box.convertFromBoxIndex(this._lastSelected.boxIndex, this._lastSelected.cellIndex);
		for (let i = 0; i < 9; i++) {
			// highlight row
			let {boxIndex, cellIndex} = Utils.box.convertToBoxIndex(rowIndex, i);
			let cell = this.boxes[boxIndex].getComponent(Box).getCell(cellIndex);
			// TODO highlight
			this._highlightCellIndexes.push([boxIndex, cellIndex]);

			// highlight col
			{boxIndex, cellIndex} = Utils.box.convertToBoxIndex(i, colIndex);
			cell = this.boxes[boxIndex].getComponent(Box).getCell(cellIndex);
			// TODO highlight
			this._highlightCellIndexes.push([boxIndex, cellIndex]);

			// highlight box
			cell = this.boxes[this._lastSelected.boxIndex].getComponent(Box).getCell(i);
			// TODO highlight
			this._highlightCellIndexes.push([this._lastSelected.boxIndex, i]);

		}
	}
});
