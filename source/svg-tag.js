module.exports = {
    data: 'data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="600" height="600"><defs><filter id="goo"><feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" /><feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="secondBlur"/><feGaussianBlur in="secondBlur" stdDeviation="3" result="goo" /></filter></defs><g transform="translate(250, 250)"><g filter="url(#goo)">',
    groupClose: '</g></g></svg>',
};
