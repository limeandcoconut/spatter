# Spatter

A package for creating a watercolor on paper effect using svgs and canvas.

## Example:

Demo coming soon. 4/10/17

```js
    const Spatter = require('spatter');

    let spatter = new Spatter(
        document.getElementById('canvas'),
        {
            bgSrc: 'http://placehold.it/500x300',
            onComplete: () => {
                console.log('complete');
            },
            onStart: () => {
                console.log('started');
            },
        }
    );

    spatter.begin();
```

### Parameters

#### canvas - \*required
This is the canvas that you want the drawing to take place on.

#### opts - optional
Can include callbacks for `onStart`, `onComplete`, and a background image for the canvas.

## Usage

[![NPM](https://nodei.co/npm/spatter.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/spatter/)

## Feedback ✉️
It is greatly appreciated! 🎉
Please hit me up, I'd love to hear what you have to say!

[messagethesmith@gmail.com](messagethesmith@gmail.com)

[https://github.com/limeandcoconut](https://github.com/limeandcoconut)

[@limeandcoconut](https://twitter.com/limeandcoconut)

Cheers!

## TODO:
- [ ] More comprehensive docs
- [ ] Link to example
- [ ] Run off of [powertrain](http://github.com/limeandcoconut/powertrain)
- [ ] Use dt to ensure that timing is accurate
- [ ] Throw if Droplet has not been configured or passed opts

## License

MIT, see [LICENSE.md](http://github.com/limeandcoconut/spatter/blob/master/LICENSE.md) for details.
