const matrixUtil = {
	make(value = 0) {
		return Array.from({ length: 9 }).map(() => this.makeRow(value));
	},

	makeRow(value = 0) {
		return Array.from({ length: 9 }).fill(value);
	},

	shuffle(array) {
		for (let i = 0; i < array.length - 1; i++) {
			let randomIndex = (i + 1) + Math.floor(Math.random() * (array.length - 1 - i));
			[array[i], array[randomIndex]] = [array[randomIndex], array[i]];
		}
		return array;
	},

	fillable(matrix, rowIndex, colIndex, num) {
		let { boxIndex } = boxUtil.convertToBoxIndex(rowIndex, colIndex);
		let boxCells = boxUtil.getBoxCells(matrix, boxIndex);
		for (let i = 0; i < 9; i++) {
			if (matrix[rowIndex][i] === num || matrix[i][colIndex] === num || boxCells[i] === num) {
				return false;
			}
		}
		return true;
	}
};

const boxUtil = {
	convertToBoxIndex(rowIndex, colIndex) {
		let boxIndex = Math.floor(rowIndex / 3) * 3 + Math.floor(colIndex / 3);
		let cellIndex = rowIndex % 3 * 3 + colIndex % 3;
		return { boxIndex, cellIndex };
	},

	convertFromBoxIndex(boxIndex, cellIndex) {
		let rowIndex = Math.floor(boxIndex / 3) * 3 + Math.floor(cellIndex / 3);
		let colIndex = boxIndex % 3 * 3 + cellIndex % 3;
		return { rowIndex, colIndex };
	},

	getBoxCells(matrix, boxIndex) {
		let ret = [];
		let { rowIndex: startRowIndex, colIndex: startColIndex } = this.convertFromBoxIndex(boxIndex, 0);
		for (let i = 0; i < 9; i++) {
			let row = startRowIndex + Math.floor(i / 3);
			let col = startColIndex + i % 3;
			ret.push(matrix[row][col]);
		}
		return ret;
	}
}

export class Utils {
	static get matrix() {
		return matrixUtil;
	}

	static get box() {
		return boxUtil;
	}
}
