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
		panelResume: {
			type: cc.Layout,
			default: null
		},
		btnResume: {
			type: cc.Button,
			default: null
		},
		imageMark: {
			type: cc.Sprite,
			default: null
		},
		labelHint: {
			type: cc.Label,
			default: null
		},

		_sudoku: null,
		_lastSelected: null,
		_highlightCellIndexes: [],
		_steps: [],
		_isMarked: false
	},

	onLoad() {
		this._initBoard();

		globalEvent.on('CELL_SELECTED', this._onCellSelected, this);
		globalEvent.on('NUMBER_CLICKED', this._onNumberClicked, this);
		globalEvent.on('UNDO', this._onUndo, this);
		globalEvent.on('ERASE', this._onErase, this);
		globalEvent.on('MARK', this._onGameMark, this);
		globalEvent.on('HINT', this._onHint, this);
		globalEvent.on('NEW_GAME_DIFF', this._onNewGameByDiff, this);
		globalEvent.on('GAME_PAUSE', this._onGamePause, this);
		globalEvent.on('GAME_RESUME', this._onGameResume, this);
	},

	start() { },

	onDestroy() {
		globalEvent.off('CELL_SELECTED', this._onCellSelected, this);
		globalEvent.off('NUMBER_CLICKED', this._onNumberClicked, this);
		globalEvent.off('UNDO', this._onUndo, this);
		globalEvent.off('ERASE', this._onErase, this);
		globalEvent.off('MARK', this._onGameMark, this);
		globalEvent.off('HINT', this._onHint, this);
		globalEvent.off('NEW_GAME_DIFF', this._onNewGameByDiff, this);
		globalEvent.off('GAME_PAUSE', this._onGamePause, this);
		globalEvent.off('GAME_RESUME', this._onGameResume, this);
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
		this._isMarked = false;
		this._setImageMark();
		this.panelResume.node.active = false;
		this.labelHint.string = this._sudoku.hintNum;
		globalEvent.emit('GAME_START');
	},

	_onCellSelected(event) {
		this._unhighlightCells();
		this._lastSelected = event.detail;
		this._highlightCells();
	},

	_fillNumber(number) {
		let cell = this.boxes[this._lastSelected.boxIndex].getComponent(Box).getCell(this._lastSelected.cellIndex);
		cell.clearMarks();
		cell.labelNum.string = number;

		let { rowIndex, colIndex } = Utils.box.convertFromBoxIndex(this._lastSelected.boxIndex, this._lastSelected.cellIndex);
		this._steps.push([this._lastSelected, this._sudoku.puzzleMatrix[rowIndex][colIndex]]);
		this._sudoku.puzzleMatrix[rowIndex][colIndex] = number;

		let { correct, finish } = this._sudoku.check(this._lastSelected.boxIndex, this._lastSelected.cellIndex);
		cell.labelNum.node.color = correct ? new cc.Color(3, 80, 165) : new cc.Color(241, 26, 26);

		if (finish) {
			globalEvent.emit('GAME_FINISH');
		}
	},

	_fillMark(number) {
		let cell = this.boxes[this._lastSelected.boxIndex].getComponent(Box).getCell(this._lastSelected.cellIndex);
		cell.labelNum.string = '';
		cell.labelMarks[number - 1].node.active = !cell.labelMarks[number - 1].node.active;

		let { rowIndex, colIndex } = Utils.box.convertFromBoxIndex(this._lastSelected.boxIndex, this._lastSelected.cellIndex);
		this._sudoku.puzzleMatrix[rowIndex][colIndex] = 0;
	},

	_onNumberClicked(event) {
		if (!this._lastSelected) {
			return;
		}

		let number = parseInt(event.detail.number);

		if (this._isMarked) {
			this._fillMark(number);
		} else {
			this._fillNumber(number);
		}
	},

	_onUndo() {
		if (this._isMarked) {
			return;
		}

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
		if (this._isMarked) {
			return;
		}

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
	},

	_onGamePause() {
		this.panelResume.node.active = true;
	},

	_onGameResume() {
		this.panelResume.node.active = false;
	},

	_onGameMark() {
		this._isMarked = !this._isMarked;
		this._setImageMark();
	},

	_setImageMark() {
		if (this._isMarked) {
			this.imageMark.spriteFrame = new cc.SpriteFrame(cc.url.raw('resources/On.png'));
		} else {
			this.imageMark.spriteFrame = new cc.SpriteFrame(cc.url.raw('resources/Off.png'));
		}
	},

	_onHint() {
		if (this._sudoku.hintNum == 0) {
			return;
		}

		if (!this._lastSelected) {
			return;
		}

		this._sudoku.hintNum -= 1;
		this.labelHint.string = this._sudoku.hintNum;

		let { rowIndex, colIndex } = Utils.box.convertFromBoxIndex(this._lastSelected.boxIndex, this._lastSelected.cellIndex);
		this._fillNumber(this._sudoku.matrix[rowIndex][colIndex]);
	}
});
