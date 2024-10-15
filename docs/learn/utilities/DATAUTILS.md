# dataUtils

```js
import { dataUtils } from "https://cdn.jsdelivr.net/gh/nottimtam/ascii.js/dist/bundle.esm.js";
```

## `dataUtils.displayArray()`

Prettify an array when displaying it in a string.

### Arguments

-   `array` &mdash; `Array<*>` The array to display.

### Returns

Returns a string display of the array.

## `dataUtils.isPlainObject()`

Check if a value is a plain JavaScript object. (A non-array, key-value structure)

### Arguments

-   `x` &mdash; `*` The value to check.

### Returns

Returns a boolean indicating whether or not the value is a plain object.

## `dataUtils.wrapString()`

Wrap text if it goes over a certain width, using `"\n"` characters.

### Arguments

-   `string` &mdash; `string` The string to wrap.
-   `maxWidth` &mdash; `number` The maximum width for the string.
-   `breakWord` &mdash; `boolean` Whether to break words that exceed the maxWidth.

### Returns

The newly wrapped string.
