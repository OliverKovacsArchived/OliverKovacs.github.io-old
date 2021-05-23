import sections from "./sections/sections.js";
import WebGLShaderRenderer from "./webgl.js";
import Vector from "./vector.js";

const _ = undefined;

let resolution;
let position = [ 0.5, 0 ];
let zoom = 0.8;

const def = {
    type: "div",
    attributes: [],
    properties: [],
    children: [],
};

const generateElement = json => {
    json = { ...def, ...json };
    let element = document.createElement(json.type);
    Object.entries(json.attributes).forEach(([ key, value ]) => element.setAttribute(key, value));
    Object.entries(json.properties).forEach(([ key, value]) => element[key] = value);
    json.children.forEach(child => element.appendChild(generateElement(child)));
    return element;
};

const p = (_class, innerHTML) => {
    return {
        type: "p",
        attributes: { class: _class },
        properties: { innerHTML },
    };
};

const div = (_class, id, children = []) => {
    return {
        type: "div",
        attributes: { class: _class, id },
        children,
    }
}

const createCard = (id, {title = "", text = "", image, svg, url}) => {

    let img_child;
    if (image) {
        img_child = {
            type: "img",
            attributes: {
                class: "card-image",
                src: image,
            }
        };
    }
    if (svg) {
        img_child = {
            type: "object",
            attributes: {
                class: "card-image",
                type: "image/svg+xml",
                data: svg,
            }
        };
    }

    let card = generateElement(
        div(`card ${id}-card`, _, [
            img_child,
            {
                type: "a",
                attributes: url ? { href: url } : {},
                children: [
                    div("card-text", _, [
                        p("card-title", title),
                        p("card-text", text),
                    ]),
                ],
            },
        ]),
    );
    return card;
};

const createSection = ({ name, id }) => {
    let target = document.getElementById("sections");
    let section = generateElement({
        type: "section",
        attributes: { class: "section" },
        children: [
            p("section-title", name),
            div("section-cards", `${id}-cards`),
        ],
    });
    target.appendChild(section);
};

const loadSection = async section => {
    let json = await (await import(`./sections/${section.id}.js`)).default;
    let target = document.getElementById(`${section.id}-cards`)
    if (section.urls === "relative") {
        if (json[0].image) {
            json.forEach(element => element.image = `./sections/${section.id}/${element.image}`);
        }
        if (json[0].svg) {
            json.forEach(element => element.svg = `./sections/${section.id}/${element.svg}`);
        }
    }
    json.forEach(element => target.appendChild(createCard(section.id, element)));
};

const wheel = canvas => event => {
    event.preventDefault();
    const rectangle = canvas.getBoundingClientRect();
    const speed = -0.003;
    const nzoom = zoom * (1 + event.deltaY * speed);
    const mouse = [ event.clientX - rectangle.left, event.clientY - rectangle.top ];
    let uv = Vector.scalar(Vector.subtract(Vector.scalar(mouse, 2), resolution), 1 / resolution[1]);
    position = Vector.add(position, Vector.scalar(uv, (zoom - nzoom) / (zoom * nzoom)));
    zoom = nzoom;
};

window.onload = async () => {
    let start = Date.now();
    const time = "Sections loaded in";
    console.time(time);
    sections.forEach(createSection);
    await Promise.all(sections.map(loadSection));
    console.timeEnd(time);

    let width = document.getElementById("sections").offsetWidth;
    resolution = [ width, Math.ceil(width / 2) ];
    let renderer = new WebGLShaderRenderer("mandelbrot", resolution);
    renderer.programInfo.uniforms = [
        "resolution",
        "position",
        "zoom",
        "time",
    ];
    await renderer.setShader("/shaders/fragment.glsl");

    renderer.callback = (gl, shaderProgram) => {
        gl.uniform2fv(shaderProgram.uniforms.resolution, resolution);
        gl.uniform2fv(shaderProgram.uniforms.position, position);
        gl.uniform1f(shaderProgram.uniforms.zoom, zoom);
        gl.uniform1f(shaderProgram.uniforms.time, Date.now() - start);
    };

    renderer.canvas.onwheel = wheel(renderer.canvas);
    renderer.start();
};
