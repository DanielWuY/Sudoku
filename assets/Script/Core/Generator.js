import { Utils } from './Utils';

class Generator {
	generate() {
		while (!this.internalGenerate()) {
			console.log('retry generate');
		}

		return this.matrix;
	}ß

	internalGenerate() {
		this.matrix = Utils.matrix.make();
		this.orders = Array.from({ length: 9 }).map(() => Array.from({ length: 9 }, (value, index) => index)).map(row => Utils.matrix.shuffle(row));
		return Array.from({ length: 9 }).every((value, index) => this.fillNumber(index + 1));
	}

	fillNumber(num) {
		return this.fillRow(num, 0);
	}

	fillRow(num, rowIndex) {
		if (rowIndex >= 9) {
			return true;
		}

		let row = this.matrix[rowIndex];
		let order = this.orders[rowIndex];
		for (let i = 0; i < order.length; i++) {
			let colIndex = order[i];
			if (row[colIndex]) {
				continue;
			}

			if (!Utils.matrix.fillable(this.matrix, rowIndex, colIndex, num)) {
				continue;
			}

			row[colIndex] = num;

			if (!this.fillRow(num, rowIndex + 1)) {
				row[colIndex] = 0;
				return false;
			}

			return true;
		}
		return false;
	}
}

export { Generator };
