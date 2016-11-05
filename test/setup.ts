// This could probably be fixed to use the actual import/export syntax but
// we're only bothered about this for testing. Figuring out the right
// combination to get it working with Typescript is also hard...
const jsdom = require('jsdom').jsdom;

const _global: any = <any> global;

_global.document = jsdom('');
_global.window = document.defaultView;
