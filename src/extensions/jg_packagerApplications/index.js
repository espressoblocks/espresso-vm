const BlockType = require('../../extension-support/block-type');
const ArgumentType = require('../../extension-support/argument-type');
const Cast = require('../../util/cast');
const Icon = require('./icon.svg');

class JgPackagerApplicationsBlocks {
    constructor(runtime) {
        /**
         * The runtime instantiating this block package.
         */
        this.runtime = runtime;
    }

    /**
     * metadata for this extension and its blocks.
     * @returns {object}
     */
    getInfo() {
        return {
            id: "jgPackagerApplications",
            name: "Packager Applications",
            color1: "#66b8ff",
            color2: "#5092cc",
            blockIconURI: Icon,
            blocks: [
                {
                    opcode: "isPackaged",
                    blockType: BlockType.BOOLEAN,
                    text: "is packaged?"
                },
                {
                    opcode: "moveWindow",
                    blockType: BlockType.COMMAND,
                    text: "move window to x: [X] y: [Y]",
                    arguments: {
                        X: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        Y: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        }
                    }
                },
                {
                    opcode: "setX",
                    blockType: BlockType.COMMAND,
                    text: "set window x to [X]",
                    arguments: {
                        X: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        }
                    }
                },
                {
                    opcode: "changeX",
                    blockType: BlockType.COMMAND,
                    text: "change window x by [X]",
                    arguments: {
                        X: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 10
                        }
                    }
                },
                {
                    opcode: "setY",
                    blockType: BlockType.COMMAND,
                    text: "set window y to [Y]",
                    arguments: {
                        Y: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        }
                    }
                },
                {
                    opcode: "changeY",
                    blockType: BlockType.COMMAND,
                    text: "change window y by [Y]",
                    arguments: {
                        Y: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 10
                        }
                    }
                },
                {
                    opcode: "windowX",
                    blockType: BlockType.REPORTER,
                    text: "window x"
                },
                {
                    opcode: "windowY",
                    blockType: BlockType.REPORTER,
                    text: "window y"
                },
                "---",
                {
                    opcode: "resizeWindow",
                    blockType: BlockType.COMMAND,
                    text: "set window size to width: [WIDTH] height: [HEIGHT]",
                    arguments: {
                        WIDTH: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 640
                        },
                        HEIGHT: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 360
                        }
                    }
                },
                {
                    opcode: "windowWidth",
                    blockType: BlockType.REPORTER,
                    text: "window width"
                },
                {
                    opcode: "windowHeight",
                    blockType: BlockType.REPORTER,
                    text: "window height"
                },
                "---",
                {
                    opcode: "enableFullscreen",
                    blockType: BlockType.COMMAND,
                    text: "enable fullscreen"
                },
                {
                    opcode: "exitFullscreen",
                    blockType: BlockType.COMMAND,
                    text: "exit fullscreen"
                },
                {
                    opcode: "isFullscreen",
                    blockType: BlockType.BOOLEAN,
                    text: "in fullscreen?"
                },
                {
                    opcode: "screenWidth",
                    blockType: BlockType.REPORTER,
                    text: "screen width"
                },
                {
                    opcode: "screenHeight",
                    blockType: BlockType.REPORTER,
                    text: "screen height"
                },
                "---",
                {
                    opcode: "setWindowName",
                    blockType: BlockType.COMMAND,
                    text: "set window name to [NAME]",
                    arguments: {
                        NAME: {
                            type: ArgumentType.STRING,
                            defaultValue: "My Cool Game"
                        }
                    }
                },
                {
                    opcode: "getWindowName",
                    blockType: BlockType.REPORTER,
                    text: "window name"
                },
                {
                    opcode: "isFocused",
                    blockType: BlockType.BOOLEAN,
                    text: "is user using this window?"
                },
                {
                    opcode: "closeWindow",
                    blockType: BlockType.COMMAND,
                    isTerminal: true,
                    text: "close window"
                },
            ]
        };
    }

    // blocks
    isPackaged() {
        return this.runtime.isPackaged;
    }
    moveWindow(args) {
        const x = Cast.toNumber(args.X);
        const y = Cast.toNumber(args.Y);
        window.moveTo(x, y);
    }
    setX(args) {
        const x = Cast.toNumber(args.X);
        const y = window.screenY;
        window.moveTo(x, y);
    }
    changeX(args) {
        const x = Cast.toNumber(args.X);
        window.moveBy(x, 0);
    }
    setY(args) {
        const x = window.screenX;
        const y = Cast.toNumber(args.Y);
        window.moveTo(x, y);
    }
    changeY(args) {
        const y = Cast.toNumber(args.Y);
        window.moveBy(0, y);
    }
    windowX() {
        return window.screenLeft;
    }
    windowY() {
        return window.screenTop;
    }
    resizeWindow(args) {
        const width = Cast.toNumber(args.WIDTH);
        const height = Cast.toNumber(args.HEIGHT);
        window.resizeTo(width, height);
    }
    windowWidth() {
        return window.outerWidth;
    }
    windowHeight() {
        return window.outerHeight;
    }
    screenWidth() {
        return screen.width;
    }
    screenHeight() {
        return screen.height;
    }
    enableFullscreen() {
        document.documentElement.requestFullscreen();
    }
    exitFullscreen() {
        document.exitFullscreen();
    }
    isFullscreen() {
        if (document.fullscreenElement) {
            return true;
        }
        return false;
    }
    setWindowName(args) {
        const name = Cast.toString(args.NAME);
        document.title = name;
    }
    getWindowName() {
        return document.title;
    }
    isFocused() {
        return document.hasFocus();
    }
    closeWindow() {
        window.close();
    }
}

module.exports = JgPackagerApplicationsBlocks;