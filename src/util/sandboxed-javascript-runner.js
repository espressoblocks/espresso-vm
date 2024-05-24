const uid = require('./uid');

// probably good
const generateQuadUid = () => uid() + uid() + uid() + uid();

// idk i just copied this lol
const none = "'none'";
const featurePolicy = {
    'accelerometer': none,
    'ambient-light-sensor': none,
    'battery': none,
    'camera': none,
    'display-capture': none,
    'document-domain': none,
    'encrypted-media': none,
    'fullscreen': none,
    'geolocation': none,
    'gyroscope': none,
    'magnetometer': none,
    'microphone': none,
    'midi': none,
    'payment': none,
    'picture-in-picture': none,
    'publickey-credentials-get': none,
    'speaker-selection': none,
    'usb': none,
    'vibrate': none,
    'vr': none,
    'screen-wake-lock': none,
    'web-share': none,
    'interest-cohort': none
};

// idk i just copied this lol
const generateAllow = () => Object.entries(featurePolicy)
    .map(([name, permission]) => `${name} ${permission}`)
    .join('; ');

const createFrame = () => {
    const element = document.createElement("iframe");
    const frameId = generateQuadUid(); // this is how we differentiate iframe messages from other messages
    // hopefully pm doesnt do sonme weird stuff that makes this not work lol
    // console.log(frameId); // remove later lol
    element.dataset.id = frameId;
    element.style.display = "none";
    element.setAttribute('aria-hidden', 'true');
    // allow modals so people can use alert & stuff
    element.sandbox = 'allow-scripts allow-modals';
    element.allow = generateAllow();
    document.body.append(element);
    return element;
};

const origin = window.origin;

/**
 * vscode give me autofill
 * @param {MessageEvent} event 
 * @param {HTMLIFrameElement} iframe 
 * @param {Function} removeHandler 
 * @returns nothing
 */
const messageHandler = (event, iframe, removeHandler) => new Promise(resolve => {
    // console.log(event.origin) // remove later
    // this might not work first try cuz idk what event.origin is
    // if (event.origin !== iframe.contentDocument.location.origin) return; 
    // yea event origin is just location
    // console.log(event.origin, origin)
    // why is event.origin null
    // ok we arent checking origin because its just null for some reason
    // if (event.origin !== origin) return;
    // console.log(event.data.payload)
    if (!event.data.payload) return;

    // console.log({ payload: event.data.payload.id, iframe: iframe.dataset.id })
    if (event.data.payload.id !== iframe.dataset.id) return;
    const data = event.data.payload;

    window.removeEventListener('message', removeHandler);
    try {
        const url = iframe.src;
        // delete object url
        URL.revokeObjectURL(url);
    } catch {
        // honestly idk how this could fail im just doing this incase
        // something stupid happens and people cant use eval anymore
        console.warn('failed to revoke url of iframe sandboxed eval');
    }
    iframe.remove();

    // send back data
    resolve(data);
});

/**
 * generates a string that can be placed into the iframe src
 * @param {string} code the code
 * @returns the code that can be placed into the eval in the iframe src
 */
const prepareCodeForEval = (code) => {
    const escaped = JSON.stringify(code);
    // when the html encounters a closing script tag, itll end the script
    // so just put a backslash before it and it should be fine
    const scriptEscaped = escaped.replaceAll('<\/script>', '<\\/script>');
    return scriptEscaped;
}

const generateEvaluateSrc = (code, frame) => {
    // this puts some funny stuff in the iframe src
    // so that it actually works
    const runnerCode = `(async () => {
    let result = null;
    let success = true;
    try {
        // techincally eval can also postMessage
        // and also modify success & result probably
        // but theres no real reason to prevent it
        // nor does the user have any reason to do it
        result = await eval(${prepareCodeForEval(code)});
    } catch (err) {
        success = false;
        result = err;
    }

    const parent = window.parent;
    const origin = '*';
    // console.log(result,success);
    console.log(origin);

    try {
        parent.postMessage({
            payload: {
                success: success,
                value: result,
                id: ${JSON.stringify(frame.dataset.id)}
            },
        }, origin);
    } catch (topLevelError) {
        // couldnt clone likely
        try {
            parent.postMessage({
                payload: {
                    success: success,
                    value: JSON.stringify(result),
                    id: ${JSON.stringify(frame.dataset.id)}
                },
            }, origin);
        } catch (err) {
            // ok we cant stringify it just error
            parent.postMessage({
                payload: {
                    success: false,
                    value: [String(topLevelError), String(err)].join("; "),
                    id: ${JSON.stringify(frame.dataset.id)}
                },
            }, origin);
        }
    }
})();`;

    const html = [
        '<!DOCTYPE html>',
        '<html lang="en-US">',
        // the html head isnt required i just think its sily to add and shouldnt affect anything
        '<head>',
        '<title>the an one of an iframe</title>',
        '</head>',
        // same story with adding actual elements
        '<body>',
        '<h1><p>epic computing in progress...</p></h1>',
        // removed for being not cool!
        // '<img src="https://media.tenor.com/jXQiJUuqfM8AAAAd/type-emoji.gif">',
        '<script>',
        runnerCode,
        '</script>',
        '</body>',
        '</html>'
    ].join("\n");

    const blob = new Blob([html], { type: 'text/html;charset=UTF-8' });
    const url = URL.createObjectURL(blob);

    return url;
};

class SandboxRunner {
    static execute(code) {
        return new Promise(resolve => {
            const frame = createFrame();
            /**
             * please vscode show me the autofill
             * @param {MessageEvent} e 
             */
            const trueHandler = e => {
                // this code is weird but we need to remove
                // event handler ladter
                // console.log(e); // debug
                messageHandler(e, frame, trueHandler).then(payload => {
                    // console.log(payload)
                    resolve({
                        success: payload.success,
                        value: payload.value
                    });
                });
            };
            window.addEventListener('message', trueHandler);
            frame.src = generateEvaluateSrc(code, frame);
        });
    }
}

module.exports = SandboxRunner;
