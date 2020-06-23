
import VectorN from "./vectorN.js";

export default class MatrixNxN extends Array {
    constructor(matrix) {
        matrix = matrix ? matrix : [];
        super(...matrix);
    }

    fromArray(array) {
        array.forEach((column, x) => {
            this[x] = [];
            column.forEach((number, y) => {
                this[x][y] = number;
            });
        });
        return this;
    }

    toArray() {
        if (typeof this[0]) {
            return [ ...this ];
        }
        return this.map(column => [ ...column ]);
    }

    matmul(matrix) {
        //if (this.length != matrix[0].length) console.warn("WARN matricies not compatible");
        let out = new MatrixNxN();
        for (let x = 0; x < matrix.length; x++) {
            out[x] = [];
            for (let y = 0; y < this[0].length; y++) {
                out[x][y] = this.sliceY(y).dot(matrix.sliceX(x));
            }
        }
        return out;
    }

    sliceX(x) {
        if (typeof this[x] == "number") return new VectorN().fromArray([ this[x] ]);
        return new VectorN(...this[x]);
    }

    sliceY(y) {
        let out = new VectorN();
        this.forEach((element, index) => out[index] = element[y]);
        return out;
    }

    invertXY() {
        let out = new MatrixNxN();
        for (let y = 0; y < this[0].length; y++) {
            out[y] = [];
            for (let x = 0; x < this.length; x++) {
                out[y][x] = this[x][y];
            }
        }
        return out;
    }
}