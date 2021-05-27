import sections from "./sections/sections.js";

import Mandelbrot from "./mandelbrot.js";
import xd from "./engine_xd.js";
import rgb from "./rgb.js";
import pfp from "./pfp.js";

const _ = undefined;

const rbg_button = document.querySelector("#rgb");

let start;

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

const createCard = (id, {title = "", text = "", image, url}) => {

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

    let text_div = div("text", _, [
        p("card-title", title),
        p("card-text", text),
    ]);

    let a = {
        type: "a",
        attributes: url ? { href: url } : {},
        children: [ text_div ],
    };

    let card = generateElement(
        div(`card ${id}-card`, _, [
            img_child,
            url ? a : text_div,
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
    let json;
    try {
        json = await (await import(`./sections/${section.id}.js`)).default;
    }
    catch(error) {
        console.warn(`Failed to generate section ${section.id}:\n${error}`);
        return;
    }
    let target = document.getElementById(`${section.id}-cards`)
    if (section.urls === "relative") {
        json.filter(element => element.image).forEach(element => element.image = `./sections/${section.id}/${element.image}`);
    }
    json.forEach(element => target.appendChild(createCard(section.id, element)));
};

window.onload = async () => {

    const time = "Sections loaded in";
    console.time(time);
    sections.forEach(createSection);
    await Promise.all(sections.map(loadSection));
    console.timeEnd(time);

    let width = document.getElementById("sections").offsetWidth;
    let resolution = [ width, Math.ceil(width / 2) ];

    start = Date.now();
    pfp("#2196f3");
    Mandelbrot(resolution);
    xd(resolution);
    rbg_button.onclick = rgb;
};
