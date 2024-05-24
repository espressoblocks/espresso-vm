const {test} = require('tap');

/* globals Request */
global.Request = class {
    constructor (url) {
        this.url = url;
    }
};
global.fetch = (url, options = {}) => (
    Promise.resolve(`[Response ${url instanceof Request ? url.url : url} options=${JSON.stringify(options)}]`)
);

// Need to trick the extension API to think it's running in a worker
// It will not actually use this object ever.
global.self = {};
// This will install extension worker APIs onto `global`
require('../../src/extension-support/extension-worker');

test('basic API', t => {
    t.type(global.Scratch.extensions.register, 'function');
    t.equal(global.Scratch.ArgumentType.BOOLEAN, 'Boolean');
    t.equal(global.Scratch.BlockType.REPORTER, 'reporter');
    t.end();
});

test('not unsandboxed', t => {
    t.not(global.Scratch.extensions.unsandboxed, true);
    t.end();
});

test('Cast', t => {
    // Cast is thoroughly tested elsewhere
    t.equal(global.Scratch.Cast.toString(5), '5');
    t.equal(global.Scratch.Cast.toNumber(' 5'), 5);
    t.equal(global.Scratch.Cast.toBoolean('true'), true);
    t.end();
});

test('fetch', async t => {
    t.equal(await global.Scratch.canFetch('https://untrusted.example/'), true);
    t.equal(await global.Scratch.fetch('https://untrusted.example/'), '[Response https://untrusted.example/ options={}]');
    t.equal(await global.Scratch.fetch('https://untrusted.example/', {
        method: 'POST'
    }), `[Response https://untrusted.example/ options={"method":"POST"}]`);
    t.end();
});

test('openWindow', async t => {
    t.equal(await global.Scratch.canOpenWindow('https://example.com/'), false);
    await t.rejects(global.Scratch.openWindow('https://example.com/'), /^Scratch\.openWindow not supported in sandboxed extensions$/);
    t.end();
});

test('redirect', async t => {
    t.equal(await global.Scratch.canRedirect('https://example.com/'), false);
    await t.rejects(global.Scratch.redirect('https://example.com/'), /^Scratch\.redirect not supported in sandboxed extensions$/);
    t.end();
});
