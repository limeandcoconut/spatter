import svgTag from './svg-tag.js'

export default class Droplet {
    constructor() {
        let size = Droplet.size
        let canvasWidth = Droplet.canvasWidth
        let canvasHeight = Droplet.canvasHeight

        this.svgOpen = svgTag.svgOpen + svgTag.filterOpen
        this.groupOpenPre = svgTag.filterClose + svgTag.groupOpenPre
        this.scale = 1
        this.groupOpenMid = svgTag.groupOpenMid

        this.groupRadius = (Math.random() * (size / 2)) + (size / 2)

        let circle = `<circle
        cx="${size}"
        cy="${size}"
        r="${this.groupRadius * 0.9}"
        style="stroke: rgb(0, 0, 0); stroke-width: 0px; fill: rgb(255, 255, 255);"></circle>`

        this.svgClose = svgTag.groupOpenPost + circle
        this.img = new Image()
        this.x = (Math.random() * (canvasWidth / 1.5)) + (canvasWidth / 14)
        this.y = (Math.random() * (canvasHeight / 1.87)) + (canvasHeight / 12)

        this.begun = false
        this.compete = false
    }

    addSpeck() {
        let groupRadius = this.groupRadius
        let size = Droplet.size
        let random = Math.random

        let theta = random() * 2 * Math.PI
        // Variance from radial placement
        let offset = (random() * (groupRadius / 5)) + (4 * groupRadius / 5)
        // Radius of speck
        let radius = (random() * 10) + 5

        let top = offset * Math.sin(theta)
        let left = offset * Math.cos(theta)
        let speckDeviation = -(radius / 2)

        // Add this speck to the svg
        this.svgClose += `<circle
        cx="${(size - left + speckDeviation)}"
        cy="${(size - top + speckDeviation)}"
        r="${radius}"
        style="stroke: rgb(0, 0, 0); stroke-width: 0px; fill: rgb(255, 255, 255);"></circle>`
    }

    completeTag() {
        this.svgClose += svgTag.groupClose + svgTag.svgClose
    }

    activate() {
        this.begun = true
    }

    prepare(resolve) {
        this.resolve = resolve
    }

    blur() {
        this.blurAmount += 0.2
        this.scale = Droplet.easingFunction((this.blurAmount / Droplet.maxBlur)) * 2.2
        if (this.blurAmount >= Droplet.maxBlur) {
            this.complete = true
            this.resolve()
        }
    }

    getFrame() {
        let translation = -this.scale * 20

        this.img.src = `${svgTag.data}${this.svgOpen}${this.blurAmount}${this.groupOpenPre}${this.scale}
        ${this.groupOpenMid}${translation}, ${translation}${this.svgClose}`
        return this.img
    }

    isComplete() {
        return this.blurAmount >= Droplet.maxBlur
    }

    static configure({size, blurAmount, maxBlur, canvasWidth, canvasHeight, easingFunction}) {
        this.prototype.blurAmount = blurAmount

        this.size = size
        this.maxBlur = maxBlur
        this.canvasWidth = canvasWidth
        this.canvasHeight = canvasHeight
        this.easingFunction = easingFunction
    }
}
