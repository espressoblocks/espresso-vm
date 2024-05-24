/**
 * espresso: strings category
 * note: most of the strings blocks won't be in here since they are just recolored operators blocks 
 */

class EspressoStringBlocks {
    constructor(runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;
    }

    /**
     * Retrieve the block primitives implemented by this package.
     * @return {object.<string, Function>} Mapping of opcode to Function.
     */
    getPrimitives () {
        return {
            strings_reverse: this.reverse,
            strings_encode: this.encode,
            strings_decode: this.decode,
            strings_random: this.runtime.strings.random //is this a good idea 😇
        }
    }

    reverse(args) {
        return this.runtime.strings.reverse(args.TEXT);
    }

    encode(args) {
        try {
            return this.runtime.strings.encode(args.TEXT, args.METHOD);
        } catch {
            return "";
        }
    }

    decode(args) {
        try {
            return this.runtime.strings.decode(args.TEXT, args.METHOD);
        } catch {
            return "";
        }
    }
}

module.exports = EspressoStringBlocks;