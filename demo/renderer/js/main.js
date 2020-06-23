
// Oliver Kovacs 2020
// renderer - main.js

import VectorN from "./vectorN.js";
import MatrixNxN from "./matrixNxN.js";
import Renderer from "./renderer.js";
import Keyboard from "./keyboard.js";
import exm from "./exm.js";

let renderer;
let keyboard;

let Vector2 = VectorN;

window.onload = () => {
    renderer = new Renderer({
        div: "canvas_container",
        dimensions: new Vector2(3600, 1800),
        pxs: 1,
        layers: 3,
        scale: new Vector2(1, 1),
        offset: new Vector2(0, 0),
        centerSystem: true,
        style: {
            dimensions: new Vector2(3600, 1800),
            border: "1px solid #000000",
            borderWidth: 1,
            borderType: "solid",
            borderColor: "#000000", 
            position: "absolute"
        }
    });

    renderer.fillCanvasLayer(0, "#000000");

    alert("Rendering Engine Demo\n" +
    "Use WASD and your mouse to control the main cube. Press F to spawn new Polygons.\n" + 
    "Running this on a potato might result in it not beeing smooth. If you have GPU turn on Hardware accaleration for the best results.")

    let engine = new Engine();
    engine.loop(Date.now());
};

class Engine {
    lastMs = Date.now();

    constructor() {
        this.orthographicProjectionMatrix = new MatrixNxN([
            [ 1, 0 ],
            [ 0, 1 ],
            [ 0, 0 ]
        ]);

        this.scene = [];

        this.scene.push(new Polygon(new VectorN(0, 0, 0), new VectorN(0, 0, 0), renderer.unit_cube, new VectorN(300, 300, 300), renderer.cuboid_type_edges, "#FF00FF"));
    }

    loop = ts => {
        window.requestAnimationFrame(ts => this.loop(ts));
        this.ts = ts;
        this.dt = (this.ts - this.lastMs);
        this.lastMs = this.ts;

        this.update(this.dt);
        this.render(this.dt);
    }

    update = dt => {
        renderer.div.innerHTML = `dt: ${Math.round(dt)} | fps: ${Math.round(1000 / dt)}<br>res: ${renderer.c.dimensions.x}x${renderer.c.dimensions.y}px<br>objects: ${this.scene.length}`;
        this.scene.forEach(polygon => polygon.rotation.add(new VectorN(0.0005, 0.001, 0.0005).multiplyScalar(dt)));

        this.scene[0].rotation.add(new VectorN(0, renderer.deltaMousePosition.x / 100, renderer.deltaMousePosition.y / 100));
        this.scene[0].color = this.color;

        if (Keyboard.isDown(Keyboard.key.w)) this.scene[0].position.add(new VectorN(0, -10, 0));
        if (Keyboard.isDown(Keyboard.key.a)) this.scene[0].position.add(new VectorN(-10, 0, 0));
        if (Keyboard.isDown(Keyboard.key.s)) this.scene[0].position.add(new VectorN(0, 10, 0));
        if (Keyboard.isDown(Keyboard.key.d)) this.scene[0].position.add(new VectorN(10, 0, 0));
        if (Keyboard.isDown(70)) {
            if (Math.random() > 0.5) {
                this.scene.push(new Polygon(
                        new VectorN().randomInt(-400, 400, 3),
                        new VectorN(0, 0, 0),
                        renderer.unit_cube,
                        new VectorN(100, 100, 100),
                        renderer.cuboid_type_edges,
                        exm.randomColor()
                    ));
            }
            else {
                this.scene.push(new Polygon(
                    new VectorN().randomInt(-400, 400, 3),
                    new VectorN(0, 0, 0),
                    renderer.unit_tetrahedron,
                    new VectorN(100, 100, 100),
                    renderer.tetrahedron_type_edges,
                    exm.randomColor()
                ));
            }
        }

        this.color = exm.rgb2hex({
            r: exm.sineCycle(Date.now(), 0.002, 0) * 127 + 128,
            g: exm.sineCycle(Date.now(), 0.002, 2 * Math.PI / 3) * 127 + 128,
            b: exm.sineCycle(Date.now(), 0.002, 4 * Math.PI / 3) * 127 + 128
        });
    }

    render = () => {
        renderer.clearCanvasLayer(1);

        this.scene.forEach(polygon => this.renderPolygon(polygon));
    }

    renderPolygon(polygon) {
        let points = this.projectPolygon(polygon)
        this.renderPoints(points, polygon.color);
        this.renderEdges(polygon.edges, points, polygon.color);
    }

    projectPolygon(polygon) {
        let rotation = polygon.rotation;

        let rotationMatrixX = new MatrixNxN([
            [ 1, 0, 0 ],
            [ 0, Math.cos(rotation.x), Math.sin(rotation.x) ],
            [ 0, -Math.sin(rotation.x), Math.cos(rotation.x) ],
        ]);

        let rotationMatrixY = new MatrixNxN([
            [ Math.cos(rotation.y), 0, -Math.sin(rotation.y) ],
            [ 0, 1, 0 ],
            [ Math.sin(rotation.y), 0, Math.cos(rotation.y) ]
        ]);

        let rotationMatrixZ = new MatrixNxN([
            [ Math.cos(rotation.z), Math.sin(rotation.z), 0 ],
            [ -Math.sin(rotation.z), Math.cos(rotation.z), 0 ],
            [ 0, 0, 1 ]
        ]);

        return polygon.vertices.map(vertex => {
            vertex = vertex.copy().multiply(polygon.scale).add(polygon.position);
            vertex = new VectorN(...rotationMatrixX.matmul(vertex).toArray()[0]);
            vertex = new VectorN(...rotationMatrixY.matmul(vertex).toArray()[0]);
            vertex = new VectorN(...rotationMatrixZ.matmul(vertex).toArray()[0]);
            vertex = new VectorN(...this.orthographicProjectionMatrix.matmul(vertex).toArray()[0]);
            return vertex;
        });
    }

    renderPoints(points, color) {
        points.forEach(vertex => {
            renderer.drawCircle({
                position: vertex,
                dimensions: 3,
                layer: 1,
                color: color,
                style: "fill",
            });
        });
    }

    renderEdges(edges, points, color) {
        edges.forEach(edge => {
            renderer.drawLine({
                position: points[edge[0]],
                dimensions: points[edge[1]].copy().subtract(points[edge[0]]),
                layer: 1,
                color: color
            });
        });
    }

    conntectPoints(i, j) {
        renderer.drawLine({
            position: this.points[i],
            dimensions: this.points[j].copy().subtract(this.points[i]),
            layer: 1,
            color: this.color
        });
    }
}

class Polygon {
    constructor(position = new VectorN(0, 0, 0), rotation = new VectorN(0, 0, 0), vertices = [], scale = new VectorN(1, 1, 1), edges = [], color = "#FFFFFF") { 
        this.position = position;
        this.rotation = rotation;
        this.vertices = vertices;
        this.scale = scale;
        this.edges = edges;
        this.color = color;
    }
}