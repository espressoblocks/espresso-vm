const Swal = require("sweetalert2");

function rgbToHex(r, g, b) {
    function componentToHex(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function randomRgb() {
    let min = 0;
    let max = 255;
    let r =  Math.floor(Math.random() * (max - min + 1) + min);
    let g =  Math.floor(Math.random() * (max - min + 1) + min);
    let b =  Math.floor(Math.random() * (max - min + 1) + min);
    return {r,g,b};
}

/**
 * espresso: Extra blocks since I added a shit ton of blocks alreday
 */
class EspressoExtras {
    constructor(runtime) {
        this.runtime = runtime;
        Swal.fire({
            title: 'im workin on it',
            text: 'nothing here, yet. check back later. i literlly have no ideas i added so many blocks. please suggest some. https://espresso.dumorando.com/contact.html',
            icon: 'info'
        })
    }

    getInfo() {
        return null;
    }
}

module.exports = EspressoExtras;