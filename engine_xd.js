import Engine from "./demo/xd/engine-xd/src/engine.js";

const N = (x, n) => Array(n).fill(x);

export default async res => {
    const display = new Engine.Displays.Canvas("engine-xd");
    display.resize(res);

    const scene = [];
    const engine = new Engine(scene, [ display ]);

    await engine.addEntity(new Engine.Entity({
        camera: {
            isometric: false,
            displays: [ { index: 0, clear: true, color: "#212121"} ],
        },
    }));

    let scale = 80;
    let dimensions = 4;
    let axes = (dimensions * (dimensions - 1)) / 2;

    await engine.addEntity(new Engine.Entity({
        transform: {
            position: [ 0, 0, - (scale * (dimensions - 2)), 0, 0, 0, 0, 0, 0, 0 ],
            // position: [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
            scale: N(scale, dimensions),
        },
        renderer: {
            renderVertices: false,
        },
        shaders: "parallel",
        geometry: Engine.Components.Geometry.Hypercube(dimensions),
        scripts: [
            { name: "spin", args: [ N(0.1, axes), true ] },
            { name: "control", args: [ 100, 0.5 ] }
        ],
    }));

    engine.start();
};
