let pfp;
const svgns = "http://www.w3.org/2000/svg";

window.addEventListener("load", () => pfp = document.querySelector("#pfp"));

const rectangle = (pos, size, color) => {
    let rect = document.createElementNS(svgns, "rect");
    rect.setAttribute("x", pos[0]);
    rect.setAttribute("y", pos[1]);
    rect.setAttribute("width", size[0]);
    rect.setAttribute("height", size[1]);
    rect.setAttribute("fill", color);
    pfp.appendChild(rect);
};

export default color => {
    while (pfp.firstChild) {
        pfp.removeChild(pfp.lastChild);
    }
    let rect = pfp.getBoundingClientRect();
    let size = [ rect.width, rect.height ];
    let tile = size.map(element => element / 5);

    rectangle([ 0, 0 ], tile, color);
    rectangle([ 0, tile[1] ], tile, color);
    rectangle([ tile[0], tile[1] ], tile, color);
    rectangle([ 4 * tile[0], 0 ], tile, color);
    rectangle([ 4 * tile[0], tile[1] ], tile, color);
    rectangle([ 3 * tile[0], tile[1] ], tile, color);
    rectangle([ tile[0], 3 * tile[1] ], tile, color);
    rectangle([ 2 * tile[0], 4 * tile[1] ], tile, color);
    rectangle([ 3 * tile[0], 3 * tile[1] ], tile, color);
};
