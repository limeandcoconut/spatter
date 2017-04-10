module.exports = class Droplet {
    constructor() {
        let size = Droplet.size;
        let canvasWidth = Droplet.canvasWidth;
        let canvasHeight = Droplet.canvasHeight;

        this.scale = 0;
        this.scaleProgress = 1;

        this.groupRadius = (Math.random() * (size / 2)) + (size / 2);

        this.circles = `<circle
        cx="${size}"
        cy="${size}"
        r="${this.groupRadius * 0.9}"
        style="stroke: rgb(0, 0, 0); stroke-width: 0px; fill: rgb(255, 255, 255);"></circle>`;

        // Add specks for this droplet
        let i = Droplet.speckCount - 1;
        while (i >= 0) {
            i--;
            this.addSpeck();
        }

        // Complete the tag
        this.tag = Droplet.svgOpen + this.circles + Droplet.svgClose;

        // For positioning on the canvas
        this.x = (Math.random() * (canvasWidth * (3 / 4))) + (canvasWidth / 8) - (Droplet.origPrintSize / 2);
        this.y = (Math.random() * (canvasHeight * (3 / 4))) + (canvasHeight / 8) - (Droplet.origPrintSize / 2);
        this.origX = this.x;
        this.origY = this.y;

        // Lifecycle flags
        this.begun = false;
        this.compete = false;
    }

    addSpeck() {
        let groupRadius = this.groupRadius;
        let size = Droplet.size;
        let random = Math.random;

        let theta = random() * 2 * Math.PI;
        // Variance from radial placement
        let offset = (random() * (groupRadius / 5)) + (4 * groupRadius / 5);
        // Radius of speck
        let radius = (random() * 10) + 5;

        let top = offset * Math.sin(theta);
        let left = offset * Math.cos(theta);
        let speckDeviation = -(radius / 2);

        // Add this speck to the svg
        this.circles += `<circle
        cx="${(size - left + speckDeviation)}"
        cy="${(size - top + speckDeviation)}"
        r="${radius}"
        style="stroke: rgb(0, 0, 0); stroke-width: 0px; fill: rgb(255, 255, 255);"></circle>`;
    }

    activate() {
        this.begun = true;
    }

    prepare(resolve) {
        this.resolve = resolve;
    }

    scaleUp() {
        this.scaleProgress += 1;
        this.scale = Droplet.easingFunction((this.scaleProgress / Droplet.scaleTiming)) * 2.2;

        this.printSize = Droplet.origPrintSize * this.scale;

        let translation = (this.printSize - Droplet.origPrintSize) / 2;
        this.x = this.origX - translation;
        this.y = this.origY - translation;

        if (this.scaleProgress >= Droplet.scaleTiming) {
            this.complete = true;
            this.resolve();
        }
    }

    getFrame() {
        return this.tag;
    }

    isComplete() {
        return this.blurAmount >= Droplet.maxBlur;
    }

    static configure({size, printSize, scaleTiming, speckCount, canvasWidth, canvasHeight, easingFunction}) {
        this.prototype.printSize = printSize;

        this.size = size;
        this.origPrintSize = printSize;
        this.scaleTiming = scaleTiming;
        this.speckCount = speckCount;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.easingFunction = easingFunction;

        this.svgOpen = `data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" version="1.1"
        width="600" height="600"><defs><filter id="goo"><feGaussianBlur in="SourceGraphic" stdDeviation="8"
        result="blur" /><feColorMatrix in="blur" mode="matrix"
        values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="secondBlur"/><feGaussianBlur in="secondBlur"
        stdDeviation="3" result="goo" /></filter></defs><g transform="translate(250, 250)"><g filter="url(#goo)">`;
        this.svgClose = '</g></g></svg>';
    }
};
