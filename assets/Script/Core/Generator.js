import { Utils } from './Utils';

class Generator {
	constructor(){
		this._retry_time = 0;
	}
	generate() {
		while (!this.internalGenerate()) {
			this._retry_time += 1;
		}
		console.log(`retry generate ${this._retry_time} times`);
		this._retry_time = 0;
		return this.matrix;
	}

	internalGenerate() {
		this.matrix = Utils.matrix.make();
		this.orders = Utils.matrix.make().map(row => row.map((value, index) => index)).map(row => Utils.matrix.shuffle(row))
		return Utils.matrix.makeRow().every((value, index) => this.fillNumber(index + 1));
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
