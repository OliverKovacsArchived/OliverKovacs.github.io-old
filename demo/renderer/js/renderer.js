
// Oliver Kovacs 2020
// renderer.js

import VectorN from "./vectorN.js";

export default class Renderer {
    constructor(object) {

        this.c = object;
        this.canvas = [];
        this.ctx = [];

        object.dimensions.multiply(object.scale.scalar(object.pxs));
        object.style.dimensions.multiply(object.scale);

        if (object.style.border == undefined) object.style.border = `${object.style.borderWidth}px ${object.style.borderType} ${object.style.borderColor}`;
        let container = document.querySelector(`#${object.div}`);
        container.style.width = `${object.style.dimensions.x}px`;
        container.style.height = `${object.style.dimensions.y}px`;
        container.width = object.dimensions.x;
        container.height = object.dimensions.y;

        if (this.c.centerSystem = true) this.c.offset.add(object.style.dimensions.scalar(0.5))

        for (let i = 0; i < object.layers; i++) {
            let canvas = document.createElement("canvas");
            canvas.id = `canvas_layer${i}`;
            canvas.width = object.dimensions.x;
            canvas.height = object.dimensions.y;
            canvas.style.width = `${object.style.dimensions.x}px`;
            canvas.style.height = `${object.style.dimensions.y}px`;
            canvas.style.zIndex = i;
            canvas.style.position = object.style.position;
            canvas.style.border = object.style.border;
            this.canvas[i] = canvas;
            this.ctx[i] = canvas.getContext("2d");
            this.ctx[i].imageSmoothingEnabled = false;
            document.querySelector(`#${object.div}`).appendChild(canvas);
        }

        this.mousePosition = new VectorN(0, 0);
        this.deltaMousePosition = new VectorN(0, 0)

        this.canvas[this.canvas.length - 1].addEventListener("mousemove", event => this.updateMousePosition(event));

        this.div = document.createElement("div");
        this.div.style.position = "relative";
        this.div.style.zIndex = object.layer + 1;
        this.div.style.left = "2px";
        this.div.style.top = "0px";
        this.div.style.width = "300px";
        this.div.style.height = "100px";
        this.div.style.color = "white";
        this.div.style.fontSize = "15px"
        document.querySelector(`#${object.div}`).appendChild(this.div);
    }

    clearCanvas() {
        for (let i = 0; i < this.canvas.length; i++) {
            this.clearCanvasLayer(i)
        }
    }

    clearCanvasLayer(layer) {
        this.ctx[layer].clearRect(0, 0, this.c.dimensions.x, this.c.dimensions.y);
    }

    fillCanvasLayer(layer, color) {
        this.ctx[layer].beginPath();
        this.ctx[layer].rect(0, 0, this.c.dimensions.x, this.c.dimensions.y);
        this.ctx[layer].fillStyle = color;
        this.ctx[layer].fill();
    }

    draw(object) {
        this.ctx.fillStyle = "#000000";
        switch (object.type) {
            case "Rectangle": this.drawRectangle(object); break;
            case "Circle": this.drawCircle(object); break;
            case "Line": this.drawLine(object); break;
            case "Polygon": this.drawPolygon(object); break;
        }
    }

    drawRectangle(object) {
        this.ctx[object.layer].beginPath();
        this.ctx[object.layer].rect(object.position.x * this.c.scale.x, object.position.y * this.c.scale.y, object.dimensions.x * this.c.scale.x, object.dimensions.y * this.c.scale.y);
        this.ctx[object.layer].fillStyle = object.color;
        if (object.style == "fill") this.ctx[object.layer].fill();
        else this.ctx[object.layer].stroke();
    }

    drawCircle(object) {
        this.ctx[object.layer].fillStyle = object.color;
        this.ctx[object.layer].beginPath();
        this.ctx[object.layer].arc((object.position.x + this.c.offset.x) * this.c.scale.x, (object.position.y + this.c.offset.y) * this.c.scale.y, object.dimensions * this.c.scale.x, 0, 2 * Math.PI);
        if (object.style == "fill") this.ctx[object.layer].fill();
        else this.ctx[object.layer].stroke();
    }

    drawLine(object) {
        let position = object.position.copy().add(this.c.offset).multiply(this.c.scale);
        this.ctx[object.layer].strokeStyle = object.color;
        this.ctx[object.layer].beginPath();
        this.ctx[object.layer].moveTo(position.x, position.y);
        position.add(object.dimensions.copy().multiply(this.c.scale));
        this.ctx[object.layer].lineTo(position.x, position.y);
        this.ctx[object.layer].stroke();
    }

    drawPolygon(object) {
        let position = object.position.copy();
        this.ctx[object.layer].fillStyle = object.color;
        if (object.style == "fill") {
            let position = object.position.copy().multiply(this.c.scale);
            this.ctx[object.layer].beginPath();
            this.ctx[object.layer].moveTo(object.position.x * this.c.scale.x, object.position.y * this.c.scale.y);
            for (let i = 0; i < object.dimensions.length; i++) {
                position.add(object.dimensions[i].copy().multiply(this.c.scale));
                this.ctx[object.layer].lineTo(position.x, position.y);
            }
            this.ctx[object.layer].fill();
        }
        else {
            for (let i = 0; i < object.dimensions.length; i++) {
                this.drawLine({
                    position: position.copy(),
                    dimensions: object.dimensions[i].copy(),
                    color: object.color,
                    layer: object.layer
                });
                position.add(object.dimensions[i])
            }
            this.drawLine({
                position: position.copy(),
                dimensions: object.position.copy().subtract(position),
                color: object.color,
                layer: object.layer
            });
        }
    }

    drawImage(object) {
        let position = object.position.copy().multiply(this.c.scale);
        ctx[object.layer].drawImage(object.image, object.sPosition.x, object.sPosition.y, object.sDimensions.x, object.sDimensions.y,
            position.x, position.y, object.dimensions.x, object.dimensions.y);
    }

    updateMousePosition(event) {
        let rect = this.canvas[this.canvas.length - 1].getBoundingClientRect();
        let mousePosition = new VectorN(event.clientX - rect.left, event.clientY - rect.top);
        this.deltaMousePosition = this.mousePosition.subtract(mousePosition);
        this.mousePosition = mousePosition;
    }

    get unit_cube() {
        return [
            new VectorN(-0.5, -0.5, -0.5),
            new VectorN(0.5, -0.5, -0.5),
            new VectorN(0.5, 0.5, -0.5),
            new VectorN(-0.5, 0.5, -0.5),
            new VectorN(-0.5, -0.5, 0.5),
            new VectorN(0.5, -0.5, 0.5),
            new VectorN(0.5, 0.5, 0.5),
            new VectorN(-0.5, 0.5, 0.5),
        ];
    }

    get unit_tetrahedron() {
        return [
            new VectorN(0, 0, 0.425),
            new VectorN(0.577, 0, -0.33),
            new VectorN(-0.289, 0.5, -0.33),
            new VectorN(-0.289, -0.5, -0.33)
        ]
    }

    get cuboid_type_edges() {
        let out = [];
        Array.from({ length: 4 }, (element, index) => index).forEach(i => {
            out.push([i, (i + 1) % 4]);
            out.push([i + 4, ((i + 1) % 4) + 4]);
            out.push([i, i + 4]);
        });
        return out;
    }

    get tetrahedron_type_edges() {
        let out = [];
        Array.from({ length: 3 }, (element, index) => index).forEach(i => {
            out.push([ 0, i + 1 ] );
            out.push([ i + 1, ((i + 1) % 3) + 1 ]);
        });
        return out;
    }
}