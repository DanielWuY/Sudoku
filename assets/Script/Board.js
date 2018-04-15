import { Sudoku } from './Core/Sudoku'
import { Utils } from './Core/Utils'
import { Box } from './Box';

cc.Class({
	extends: cc.Component,

	properties: {
		boxes: {
			type: [Box],
			default: []
		},

		_sudoku: null,
		_lastSelected: null,
		_highlightCellIndexes: [],
		_steps: []
	},

	onLoad() {
		this._initBoard();

		globalEvent.on('CELL_SELECTED', this._onCellSelected, this);
		globalEvent.on('NUMBER_CLICKED', this._onNumberClicked, this);
		globalEvent.on('UNDO', this._onUndo, this);
		globalEvent.on('ERASE', this._onErase, this);
		globalEvent.on('NEW_GAME_DIFF', this._onNewGameByDiff, this);
	},

	start() { },

	onDestroy() {
		globalEvent.off('CELL_SELECTED', this._onCellSelected, this);
		globalEvent.off('NUMBER_CLICKED', this._onNumberClicked, this);
		globalEvent.off('UNDO', this._onUndo, this);
		globalEvent.off('ERASE', this._onErase, this);
		globalEvent.off('NEW_GAME_DIFF', this._onNewGameByDiff, this);
	},

	_initBoard(diff = 'easy') {
		this._sudoku = new Sudoku();
		this._sudoku.make(diff);
		this._sudoku.puzzleMatrix.forEach((rowValue, rowIndex) => {
			rowValue.forEach((cellValue, colIndex) => {
				let { boxIndex, cellIndex } = Utils.box.convertToBoxIndex(rowIndex, colIndex);
				let cell = this.boxes[boxIndex].getComponent(Box).getCell(cellIndex);
				cell.setIndex(boxIndex, cellIndex);
				cell.labelNum.string = cellValue ? cellValue : '';
				cell.labelNum.node.color = cellValue ? new cc.Color(0, 0, 0) : new cc.Color(3, 80, 165);
				cell.getComponent(cc.Button).interactable = cellValue === 0;
			})
		});

		this._steps = [];
		this._unhighlightCells();
		this._lastSelected = null;
		this._highlightCellIndexes = [];
	},

	_onCellSelected(event) {
		this._unhighlightCells();
		this._lastSelected = event.detail;
		this._highlightCells();
	},

	_onNumberClicked(event) {
		if (!this._lastSelected) {
			return;
		}

		let cell = this.boxes[this._lastSelected.boxIndex].getComponent(Box).getCell(this._lastSelected.cellIndex);
		cell.labelNum.string = event.detail.number;

		let { rowIndex, colIndex } = Utils.box.convertFromBoxIndex(this._lastSelected.boxIndex, this._lastSelected.cellIndex);
		this._steps.push([this._lastSelected, this._sudoku.puzzleMatrix[rowIndex][colIndex]]);
		this._sudoku.puzzleMatrix[rowIndex][colIndex] = parseInt(event.detail.number);

		let { correct, finish } = this._sudoku.check(this._lastSelected.boxIndex, this._lastSelected.cellIndex);
		cell.labelNum.node.color = correct ? new cc.Color(3, 80, 165) : new cc.Color(241, 26, 26);

		if (finish) {
			cc.director.loadScene("Result");
		}
	},

	_onUndo() {
		if (this._steps.length == 0) {
			return;
		}
		let [{ boxIndex, cellIndex }, oldValue] = this._steps.pop();
		let { rowIndex, colIndex } = Utils.box.convertFromBoxIndex(boxIndex, cellIndex);
		this._sudoku.puzzleMatrix[rowIndex][colIndex] = parseInt(oldValue);

		let cell = this.boxes[boxIndex].getComponent(Box).getCell(cellIndex);
		cell.labelNum.string = oldValue || '';
		let { correct, finish } = this._sudoku.check(boxIndex, cellIndex);
		cell.labelNum.node.color = correct ? new cc.Color(3, 80, 165) : new cc.Color(241, 26, 26);
	},

	_onErase() {
		if (!this._lastSelected) {
			return;
		}

		let cell = this.boxes[this._lastSelected.boxIndex].getComponent(Box).getCell(this._lastSelected.cellIndex);
		cell.labelNum.string = '';

		let { rowIndex, colIndex } = Utils.box.convertFromBoxIndex(this._lastSelected.boxIndex, this._lastSelected.cellIndex);
		this._steps.push([this._lastSelected, this._sudoku.puzzleMatrix[rowIndex][colIndex]]);
		this._sudoku.puzzleMatrix[rowIndex][colIndex] = 0;
	},

	_onNewGameByDiff(event) {
		this._initBoard(event.detail);
	},

	_unhighlightCells() {
		if (!this._lastSelected) {
			return;
		}

		this._highlightCellIndexes.forEach(([boxIndex, cellIndex]) => {
			let cell = this.boxes[boxIndex].getComponent(Box).getCell(cellIndex);
			cell.node.color = new cc.Color(255, 255, 255);
		});

		this._highlightCellIndexes = [];
	},

	_highlightCells() {
		if (!this._lastSelected) {
			return;
		}

		let { rowIndex, colIndex } = Utils.box.convertFromBoxIndex(this._lastSelected.boxIndex, this._lastSelected.cellIndex);
		for (let i = 0; i < 9; i++) {
			let boxIndex, cellIndex;
			// highlight row
			({ boxIndex, cellIndex } = Utils.box.convertToBoxIndex(rowIndex, i));
			let cell = this.boxes[boxIndex].getComponent(Box).getCell(cellIndex);
			cell.node.color = new cc.Color(192, 192, 192);
			this._highlightCellIndexes.push([boxIndex, cellIndex]);

			// highlight col
			({ boxIndex, cellIndex } = Utils.box.convertToBoxIndex(i, colIndex));
			cell = this.boxes[boxIndex].getComponent(Box).getCell(cellIndex);
			cell.node.color = new cc.Color(192, 192, 192);
			this._highlightCellIndexes.push([boxIndex, cellIndex]);

			// highlight box
			cell = this.boxes[this._lastSelected.boxIndex].getComponent(Box).getCell(i);
			cell.node.color = new cc.Color(192, 192, 192);
			this._highlightCellIndexes.push([this._lastSelected.boxIndex, i]);
		}
		let cell = this.boxes[this._lastSelected.boxIndex].getComponent(Box).getCell(this._lastSelected.cellIndex);
		cell.node.color = new cc.Color(160, 160, 160);
	}
});
