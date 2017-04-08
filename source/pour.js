module.exports = class Pour {
    constructor() {
        // this.data = 'data:image/svg+xml;charset=UTF-8,';
        this.svgOpen = `data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="1000" height="1000"><defs>
            <filter id="goo"><feGaussianBlur in="SourceGraphic" stdDeviation="12.199999999999989" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
            result="secondBlur" /><feGaussianBlur in="secondBlur" stdDeviation="3" result="goo" /></filter></defs>
            <g transform="translate(1000, 0)"><g filter="url(#goo)" transform="scale(1), translate(`;
        this.svgMid = ')"><circle cx="0" cy="0" r="';
        this.radius = 1;
        this.svgClose = `" style="stroke: rgb(0, 0, 0); stroke-width: 0px; fill: rgb(255, 255, 255);"></circle></g></g>
            </svg>`;
        this.img = new Image();
    }

    expand(progress) {
        // Scaled by 1000 to match the size of the final svg tag
        this.radius = Pour.easingFunction(progress) * 1000;
    }

    getFrame() {
        // 6/7 provides the visual flow effect desired by allowing most frames to only partially overlap
        let translation = (-(8 / 9) * this.radius) + 20;
        this.img.src = `${this.svgOpen}${translation} ,${-translation}${this.svgMid}
        ${this.radius}${this.svgClose}`;
        return this.img;
    }

    static configure({easingFunction}) {
        this.easingFunction = easingFunction;
    }
};
