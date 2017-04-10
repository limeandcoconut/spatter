const BezierEasing = require('bezier-easing');
const raf = require('raf');
const Droplet = require('./droplet.js');
const Pour = require('./pour.js');
const externalConfig = require('./spatter.config.js');

/**
 * [Spatter description]
 * @method Spatter
 * @param  {[type]} canvas [description]
 * @param  {[type]} opts   [description]
 */
function Spatter(canvas, opts) {
    // Type check all the things 🙋
    if (!(canvas instanceof HTMLCanvasElement)) {
        throw new TypeError('First argument required to be an html canvas element');
    }

    if (opts) {
        if (typeof opts !== 'object') {
            throw new TypeError('Second argument expected to be an object');
        }
    }

    this.canvas = canvas;

    // Bind because they'll be raf'ed
    this.outro = this.outro.bind(this);
    this.dropletAnimation = this.dropletAnimation.bind(this);

    let config = {};
    Object.assign(config, externalConfig);

    let dropletsConfig = config.droplets;

    Object.assign(this, {
        ...config.opts,
        ...config.timing,
        easingControls: config.easingControls,
        dropletCount: dropletsConfig.count,
    }, opts);

    this.outroFrameCount = 0;
    this.dropletFrameCount = 0;
    this.droplets = [];
    this.img = new Image();

    // Used to delay begin() until bg is loaded
    this.isReady = false;
    // Scale down to account for approximate raf timing.
    this.maximumDelay /= 16;
    this.outroLength /= 16;

    // Used for timing
    // this.dropletDuration = (this.dropletCount * this.dropletTiming) - dropletsConfig.scaleTiming;
    this.dropletDuration = this.dropletCount * this.dropletTiming;

    // Create easing functions
    let a = this.easingControls.timing.a;
    let b = this.easingControls.timing.b;
    this.easeTiming = new BezierEasing(a.x, a.y, b.x, b.y);

    // Configure droplet class
    a = dropletsConfig.easingControls.a;
    b = dropletsConfig.easingControls.b;
    Droplet.configure({
        size: dropletsConfig.size,
        // blurAmount: dropletsConfig.initalBlur,
        printSize: dropletsConfig.printSize,
        scaleTiming: dropletsConfig.scaleTiming,
        speckCount: dropletsConfig.speckCount,
        canvasWidth: this.canvas.width,
        canvasHeight: this.canvas.height,
        easingFunction: new BezierEasing(a.x, a.y, b.x, b.y),
    });

    // Create background image and draw it to the can
    this.canvasCtx = canvas.getContext('2d');
    this.bgImg = document.createElement('IMG');
    let bgImg = this.bgImg;

    // When the image is loaded signal that it is possible to .begin()
    bgImg.onload = () => {
        this.canvasCtx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
        this.canvasCtx.globalCompositeOperation = 'destination-out';
        this.isReady = true;
    };

    bgImg.src = this.bgSrc;
}

Spatter.prototype.begin = function() {
    // If the bg image is not loaded delay
    if (!this.isReady) {
        // If the maximum delay has been reached don't reattempt
        if (this.maximumDelay > 0) {
            raf(() => {
                this.maximumDelay -= 1;
                this.begin();
            });
        }
        return;
    }

    // User callback
    if (this.onStart) {
        this.onStart();
    }

    let droplets = this.droplets;
    // Prepare all of the droplet objects for rendering
    let i = this.dropletCount - 1;
    while (i >= 0) {
        i--;
        droplets.push(new Droplet());
    }

    this.dropletAnimationComplete = false;

    // Create a promise for each droplet that will be resolved when it finished animating.
    let dropletPromises = droplets.map((droplet) => {
        let cb = droplet.prepare.bind(droplet);
        return new Promise(cb);
    });

    // When all droplets are finished start the outro.
    Promise.all(dropletPromises).then(() => {
        this.dropletAnimationComplete = true;
        if (this.showOutro) {
            this.startOutro();
        }
    });

    raf(this.dropletAnimation);
};

Spatter.prototype.startOutro = function() {
    let a = this.easingControls.outro.a;
    let b = this.easingControls.outro.b;
    Pour.configure({
        canvasWidth: this.canvas.width,
        canvasHeight: this.canvas.height,
        easingFunction: new BezierEasing(a.x, a.y, b.x, b.y),
    });
    this.pour = new Pour();
    raf(this.outro);
};

Spatter.prototype.dropletAnimation = function() {

    let timing = this.easeTiming(this.dropletFrameCount / this.dropletDuration) * this.dropletDuration;
    let img = this.img;
    this.dropletFrameCount++;
    // For each droplet
    this.droplets.forEach((droplet, index) => {
        // If it is not begun and it's time is up then activate it
        if (!droplet.begun && timing / this.dropletTiming >= index) {
            droplet.activate();
        } else if (droplet.begun && !droplet.complete) {
        // If it is not done animating scale it more
            // Promise.all() will be triggered here when all droplets are scaled to the maximum amount
            // That will begin the outro (maybe) and stop requesting frames for this function
            droplet.scaleUp();
            img.src = droplet.getFrame();

            this.canvasCtx.drawImage(
                img,
                droplet.x,
                droplet.y,
                droplet.printSize,
                droplet.printSize
            );
        }
    });

    if (!this.dropletAnimationComplete) {
        raf(this.dropletAnimation);
        // setTimeout(this.dropletAnimation, 100);
    }
};

Spatter.prototype.outro = function() {
    this.pour.expand(this.outroFrameCount / this.outroLength);
    this.outroFrameCount++;

    this.img.src = this.pour.getFrame();

    this.canvasCtx.drawImage(
        this.img,
        this.pour.x,
        this.pour.y,
        this.pour.printSize,
        this.pour.printSize
    );

    if (this.outroFrameCount < this.outroLength) {
        raf(this.outro);
    } else if (this.onComplete) {
        this.onComplete();
    }
};

module.exports = Spatter;
