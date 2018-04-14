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
		return this.puzzleMatrix;
	}

	check(boxIndex, cellIndex, num) {
		let { rowIndex, colIndex } = Utils.box.convertFromBoxIndex(boxIndex, cellIndex);
		let correct = this.matrix[rowIndex][colIndex] === num;
		if (!correct) {
			return { correct, finish: false };
		}

		let finish = true;
		for (let i = 0; i < 9; i++) {
			for (let j = 0; j < 9; j++) {
				if (this.matrix[i][j] !== this.puzzleMatrix[i][j]) {
					finish = false;
					break;
				}
			}
			if (!finish) {
				break;
			}
		}

		return { correct, finish };
	}
}

export { Sudoku };
