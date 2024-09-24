# Start a New ascii.js Project

To start a new project from scratch, follow the instructions below.

## Direct Source Code Integration

If you want to include the ascii.js source code directly in your project, you can download the [latest release](https://github.com/NotTimTam/ascii.js/releases/) from GitHub. Both CJS and ESM compilations of the source code are provided.

## Browser CDN Integration

If you don't want to maintain source code versions, you can import ascii.js directly into your project using a CDN.

You can directly import the code in your HTML file using:

```html
<script src="https://cdn.jsdelivr.net/gh/nottimtam/ascii.js/dist/bundle.cjs.js"></script>
```

You can also

**ESM**:
```js
import Runtime from "https://cdn.jsdelivr.net/gh/nottimtam/ascii.js/dist/bundle.esm.js";
```

**CJS**:
```js
const Runtime = require("https://cdn.jsdelivr.net/gh/nottimtam/ascii.js/dist/bundle.cjs.js");
```

The `.esm.js` and `.cjs.js` extensions determine whether you are using an EcmaScript module, or CommonJS require version of the source code.
