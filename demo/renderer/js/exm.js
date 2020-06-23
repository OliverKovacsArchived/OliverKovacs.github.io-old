
class EXM {
    constructor() {
        this.hex = "0123456789ABCDEF";

        Number.prototype.round = function(p) {
            return +(Math.round(this + "e+" + p)  + "e-" + p);
        }
    }

    randomFloat(min, max) {
        return Math.random() * (max - min) + min;
    }
    
    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    randomHex(min, max) {
        return this.byte2hex(this.randomInt(min, max));
    }

    randomColor() {
        return this.rgb2hex({
            r: this.randomInt(0, 255),
            g: this.randomInt(0, 255),
            b: this.randomInt(0, 255)
        });
    }
    
    randomBool() {
        return Math.random() >= 0.5;
    }

    sineCycle(index, frequency, phase) {
        return Math.sin(index * frequency + phase);
    }

    rgb2hex(color) {
        return `#${this.byte2hex(color.r)}${this.byte2hex(color.g)}${this.byte2hex(color.b)}`;
    }

    byte2hex(n) {
        return String(this.hex.substr((n >> 4) & 0x0F, 1)) + this.hex.substr(n & 0x0F, 1);
    }

    cot(x) {
        return 1 / Math.tan(x);
    }
    
    arccot(x) {
        return Math.PI / 2 - Math.atan(x);
    };

    serialize(object, typeKey, removeKey) {
        if (object === undefined) return;
        if (!typeKey) typeKey = "__CLASSNAME__";
        switch (object.constructor.name) {
            case "String": break;
            case "Number": break;
            case "Boolean": break;
            case "Array": {
                object = object.slice();
                for (let i = 0; i < object.length; i++) {
                    object[i] = this.serialize(object[i], typeKey, removeKey);
                } break;
            } 
            case "Object": {
                object = Object.assign({}, object);
                let entries = Object.entries(object);
                for (let i = 0; i < entries.length; i++) {
                    removeKey.forEach(key => {
                        if (entries[i][0] == key) entries[i][1] = undefined;
                    });
                    object[entries[i][0]] = this.serialize(entries[i][1], typeKey, removeKey);
                } break;
            } 
            default: {
                object[typeKey] = object.constructor.name;
                object = Object.assign({}, object);
                let entries = Object.entries(object);
                for (let i = 0; i < entries.length; i++) {
                    removeKey.forEach(key => {
                        if (entries[i][0] == key) entries[i][1] = undefined;
                    });
                    object[entries[i][0]] = this.serialize(entries[i][1], typeKey, removeKey);
                }
            }
        }
        return object;
    }

    deserialize(object, typeKey) {
        if (!typeKey) typeKey = "__CLASSNAME__";
        switch (object.constructor.name) {
            case "String": break;
            case "Number": ; break;
            case "Boolean": ; break;
            case "Array": {
                for (let i = 0; i < object.length; i++) {
                    object[i] = this.deserialize(object[i], typeKey)
                } break;
            } 
            case "Object": {
                if (object[typeKey] != undefined) object = eval(`new ${object[typeKey]}(${JSON.stringify(object)});`);
                let entries = Object.entries(object);
                for (let i = 0; i < entries.length; i++) {
                    object[entries[i][0]] = this.deserialize(entries[i][1], typeKey);
                } break;
            }
        }
        return object;
    }

    /*callEach(object, ignoreKeys, f, args) {
        switch (typeof object) {
            case "string": break;
            case "number": ; break;
            case "boolean": ; break;
            case "array": {
                for (let i = 0; i < object.length; i++) {
                    this.callEach(object[i], ignoreKeys, removeKey, f, args)
                } break;
            } 
            case "object": {
                let entries = Object.entries(object);
                for (let i = 0; i < entries.length; i++) {
                    let execute = true;
                    for (let j = 0; j < ignoreKeys.length; j++) {
                        if (entries[i][0] == ignoreKeys[j]) execute = false;
                    }
                    if (typeof entries[i][1][f] == "function") entries[i][1][f](eval(args));
                    if (execute) this.callEach(entries[i][1], ignoreKeys, f, args);
                } break;
            }
        }
    }*/
}

export default new EXM();