import { Generator } from './Generator';
import { Utils } from './Utils';

const DIFFICULTY = {
	"easy": 62,
	"medium": 53,
	"hard": 44,
	"very-hard": 35,
	"insane": 26,
	"inhuman": 17,
};

const HINT_NUM = {
	"easy": 1,
	"medium": 1,
	"hard": 2,
	"very-hard": 2,
	"insane": 3,
	"inhuman": 3,
};

class Sudoku {
	constructor() {
		this.matrix = new Generator().generate();
	}

	make(level = 'easy') {
		let keepCellIndexes = Utils.matrix.shuffle(Array.from({ length: 81 }, (value, index) => index)).slice(0, DIFFICULTY[level]);
		this.puzzleMatrix = this.matrix.map((row, rowIndex) => {
			return row.map((cell, colIndex) => {
				let index = rowIndex * 9 + colIndex;
				return keepCellIndexes.indexOf(index) !== -1 ? cell : 0;
			})
		})
		this.hintNum = HINT_NUM[level];
		return this.puzzleMatrix;
	}

	check(boxIndex, cellIndex) {
		let { rowIndex, colIndex } = Utils.box.convertFromBoxIndex(boxIndex, cellIndex);
		let correct = this.matrix[rowIndex][colIndex] === this.puzzleMatrix[rowIndex][colIndex];
		if (!correct) {
			return { correct, finish: false };
		}

		let finish = this.puzzleMatrix.every((rowValue, rowIndex) => {
			return rowValue.every((cellValue, colIndex) => {
				return cellValue === this.matrix[rowIndex][colIndex];
			})
		});

		return { correct, finish };
	}
}

export { Sudoku };
