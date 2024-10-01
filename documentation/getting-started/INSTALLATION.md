# Start a New ascii.js Project

To start a new project from scratch, follow the instructions below.

## Direct Source Code Integration

If you want to include the ascii.js source code directly in your project, you can download the [latest release](https://github.com/NotTimTam/ascii.js/releases/) from GitHub.

## Browser CDN Integration

If you don't want to maintain source code versions, you can import ascii.js directly into your project using a CDN.

You can directly import the code in your HTML file using:

```html
<script src="https://cdn.jsdelivr.net/gh/nottimtam/ascii.js/dist/bundle.js"></script>
```

You can also import it through JavaScript

**CJS**:

```js
const Runtime = require("https://cdn.jsdelivr.net/gh/nottimtam/ascii.js/dist/bundle.js");
```

**Note:** As of version `1.0.28`, ascii.js no longer supports CommonJS. Thus only a single `bundle.js` file is generated per build, instead of the previous `bundle.esm.js` and `bundle.cjs.js` files.
