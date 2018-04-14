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

}

export { Sudoku };
