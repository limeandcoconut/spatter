module.exports = {
    droplets: {
        size: 70,
        printSize: 300,
        count: 50,
        speckCount: 10,
        scaleTiming: 8,
        easingControls: {
            a: {x: 0.13, y: 1.00},
            b: {x: 0.73, y: 1.00},
        },
    },
    easingControls: {
        outro: {
            // a: {x: 0.22, y: 0.55},
            // b: {x: 0.73, y: 0.73},
            a: {x: 0.42, y: 0.87},
            b: {x: 0.62, y: 0.51},
        },
        timing: {
            a: {x: 1.00, y: 0.1},
            b: {x: 0.91, y: 0.28},
        },
    },
    timing: {
        dropletTiming: 2,
        maximumDelay: 10000,
        showOutro: true,
        outroLength: 1000,
    },
    opts: {
        bgSrc: 'http://placehold.it/500x300',
        onStart: null,
        onComplete: null,
    },
};
