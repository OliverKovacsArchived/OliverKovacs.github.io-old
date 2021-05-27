import pfp from "./pfp.js";

const root = document.querySelector(":root");
const speed = 0.001;
let start;

const rgb = () => {
    requestAnimationFrame(rgb);
    const x = Date.now() - start;
    const r = 127.5 * (Math.sin(x * speed + 0 * Math.PI / 3) + 1);
    const g = 127.5 * (Math.sin(x * speed + 2 * Math.PI / 3) + 1);
    const b = 127.5 * (Math.sin(x * speed + 4 * Math.PI / 3) + 1);
    const color = `rgb(${r}, ${g}, ${b})`;
    root.style.setProperty("--primary", color);
    root.style.setProperty("--secondary", color);
    pfp(color);
};

export default () => {
    start = Date.now();
    requestAnimationFrame(rgb);
};
