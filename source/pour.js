module.exports = class Pour {
    constructor() {
        this.tag = `data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="750"
        height="750"><defs><filter id="goo"><feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur" />
        <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
        result="secondBlur" /><feGaussianBlur in="secondBlur" stdDeviation="3" result="goo" /></filter></defs><g
        transform="translate(500, 250)"><g filter="url(#goo)" transform="scale(1), translate(0 ,0)"><circle cx="0"
        cy="0" r="500" style="stroke: rgb(0, 0, 0); stroke-width: 0px; fill: rgb(255, 255, 255);"></circle></g></g>
        </svg>`;
        this.x = Pour.canvasWidth - this.printSize;
        this.y = 0;
    }

    expand(progress) {
        this.printSize = Pour.origPrintSize * (Pour.maxSize / Pour.origPrintSize) * Pour.easingFunction(progress);

        this.x = Pour.canvasWidth - this.printSize;
    }

    getFrame() {
        return this.tag;
    }

    static configure({canvasWidth, canvasHeight, easingFunction}) {
        this.easingFunction = easingFunction;
        this.canvasWidth = canvasWidth;
        this.maxSize = Math.max(canvasWidth, canvasHeight) * 1.25;
        this.origPrintSize = 300;
        this.prototype.printSize = 300;
    }
};
