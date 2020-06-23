
// Oliver Kovacs 2019
// vectorN.js

export default class VectorN extends Array {
    constructor(...args) {
        super(...args);
    }

    get x() {
        return this[0];
    }

    get y() {
        return this[1];
    }

    get z() {
        return this[2];
    }

    addGetter(key, index) {
        Object.defineProperty(VectorN.prototype, key, {
            get: () => this[index]
        });
        return this;
    }



    fromString(string) {
        return this.fromArray(JSON.parse(string));
    }

    fromArray(array) {
        return this.returnSplice(0, this.length).merge(array);
    }

    toString() {
        return JSON.stringify(this);
    }

    toArray() {
        return new Array(...this);
    }



    copy() {
        return new VectorN().fromArray([ ...this ]);
    }

    clone() {
        return this;
    }

    merge(vector) {
        vector.forEach((element, index) => this[index] = element);
        return this;
    }



    magnitude() {
        return Math.sqrt(this.magnitudeSq());
    }

    magnitudeSq() {
        let magnitude = 0;
        this.forEach(element => magnitude += Math.pow(element, 2));
        return magnitude;
    }

    dimension() {
        return this.length;
    }

    setDimension(dimension, fill = 0) {
        for (let i = 0; i < dimension; i++) {
            this[i] = this[i] || fill;
        }
        return this.returnSplice(dimension);
    }

    fill(x, n) {
        return this.merge(Array.from({ length: n }, element => x));
    }

    zeros(n) {
        return this.fill(0, n);
    }

    ones(n) {
        return this.fill(1, n);
    }



    equate(v1, v2) {
        let length = Math.max(v1.length, v2.length);
        v1.setDimension(length);
        v2.setDimension(length);
    }

    add(vector) {
        if (this.length != vector.length) {
            vector = vector.copy();
            this.equate(this, vector);
        }
        vector.forEach((element, index) => this[index] += element);
        return this;
    }

    subtract(vector) {
        if (this.length != vector.length) {
            vector = vector.copy();
            this.equate(this, vector);
        }
        vector.forEach((element, index) => this[index] -= element);
        return this;
    }

    multiply(vector) {
        if (this.length != vector.length) {
            vector = vector.copy();
            this.equate(this, vector);
        }
        vector.forEach((element, index) => this[index] *= element);
        return this;
    }

    cross(vector) {

    }

    dot(vector) {
        if (this.length != vector.length) {
            vector = vector.copy();
            this.equate(this, vector);
        }
        let dot = 0;
        this.forEach((element, index) => dot += element * vector[index]);
        return dot;
    }

    addScalar(scalar) {
        this.forEach((element, index) => this[index] += scalar);
        return this;
    }

    multiplyScalar(scalar) {
        this.forEach((element, index) => this[index] *= scalar);
        return this;
    }
    
    scalar(scalar) {
        return this.multiplyScalar(scalar);
    }
    

    // this won't work in higher dimensions in most cases
    toNSphere() {
        switch (this.length) {
            case 0:
            case 1: {                                           //line
                return this;                                    //r
            }       
            case 2: {                                           //polar
                return this.merge([     
                    this.magnitude(),                           //r
                    Math.atan2(this[1], this[0])                //theta
                ]);     
            }       
            case 3: {                                           //sphere
                return this.merge([
                    this.magnitude(),                           //r
                    Math.atan2(this[1], this[0]),               //phi
                    Math.acos(this[2] / this.magnitude())       //theta
                ]);     
            }                                                   
            default: {                                          //n-sphere
                let nSphere = [ this.magnitude() ];             //r
                for (let i = 1; i < this.length - 1; i++) {
                    let denominatorSq = 0;
                    for (let j = i; j < this.length; j++) {
                        console.log(i, j, Math.pow(this[j], 2))
                        denominatorSq += Math.pow(this[j], 2);
                    }
                    nSphere[i] = Math.arccot(this[i - 1] / Math.sqrt(denominatorSq));   //phi[1] - phi[n-1]
                }
                let xM = this[this.length - 1];                 //x[n-1]
                let xN = this[this.length];                     //x[n]
                nSphere[this.length - 1] = 2 * Math.arccot((xM + Math.sqrt(Math.pow(xN, 2) + Math.pow(xM, 2))) / xN);   //phi[n]
                return this.merge(nSphere);
            }
        }
    }

    // this works, but outputs the axes in a wrong order
    toCartesian() {
        let cartesian = [];
        for (let i = 0; i < this.length; i++) {
            let coordinate = this[0];
            for (let j = 0; j <= i; j++) {
                if (j == i && i + 1 != this.length) {
                    coordinate *= Math.cos(this[this.length - j - 1]);
                }
                else if (i + 1 != this.length || j + 1 != this.length) {
                    coordinate *= Math.sin(this[this.length - j - 1]);
                }
            }
            cartesian[i] = coordinate;
        }
        console.log(this)
        return this.merge(cartesian);
    }



    mapVector(vector, funct) {
        this.map((element, index) => funct(element, vector[index], index));
        return this;
    }


    round(accuracy = 2) {
        this.forEach((element, index) => this[index] = JSON.parse(element.toFixed(accuracy)));
        return this;
    }


    returnSplice(...args) {
        this.splice(...args);
        return this;
    };

    returnForEach(...args) {
        this.forEach(...args);
        return this;
    }
    
    returnShift() {
        this.shift();
        return this;
    }
    
    returnPop() {
        this.pop();
        return this; 
    }

    sliceX() {
        return new VectorN().fromArray([ ...this ]);
    }

    sliceY(y) {
        return new VectorN().fromArray([ this[y] ]);
    }

    randomInt(min, max, n = 1) {
        for (let i = 0; i < n; i++) {
            this[i] = Math.floor(Math.random() * (max - min + 1) + min);
        }
        return this;
    }

    randomFloat(min, max, n = 1) {
        for (let i = 0; i < n; i++) {
            this[i] =  Math.random() * (max - min) + min;
        }
        return this;
    }
}

Math.cot = x => {
    return 1 / Math.tan(x);
}

Math.arccot = x => {
    return Math.PI / 2 - Math.atan(x);
};