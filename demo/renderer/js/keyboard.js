

export default new (class Keyboard {
    constructor(mode) {
        this.type = "Keyboard";
        this.name = "";
        this.keys = [];
        this.key = {
            w: 87,
            a: 65,
            s: 83,
            d: 68,
            space: 32,
            shift: 16,
            ctrl: 17,
            esc: 27,
            arrow_up: 38,
            arrow_down: 40,
            arrow_left: 37,
            arrow_right: 39
        };

        for (let i = 0; i < 222; i++) {
            this.keys[i] = mode || "up";
        }

        document.addEventListener("keyup", event => this.keyUp(event));
        document.addEventListener("keydown", event => this.keyDown(event));
    }

    keyUp(event) {
        this.keys[event.keyCode] = "up";
    }

    keyDown(event) {
        this.keys[event.keyCode] = "down";
    }

    isUp(keyCode) {
        if (this.keys[keyCode] == "down") {
            return false;
        }
        return true;
    }

    isDown(keyCode) {
        if (this.keys[keyCode] == "up") {
            return false;
        }
        return true;
    }

    getKeyState(keyCode) {
        return this.keys[keyCode];
    }
})();