var ae = Object.defineProperty, he = Object.defineProperties;
var le = Object.getOwnPropertyDescriptors;
var q = Object.getOwnPropertySymbols;
var ce = Object.prototype.hasOwnProperty, de = Object.prototype.propertyIsEnumerable;
var j = Math.pow, G = (c, e, t) => e in c ? ae(c, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : c[e] = t, x = (c, e) => {
  for (var t in e || (e = {}))
    ce.call(e, t) && G(c, t, e[t]);
  if (q)
    for (var t of q(e))
      de.call(e, t) && G(c, t, e[t]);
  return c;
}, C = (c, e) => he(c, le(e));
var m = (c, e, t) => G(c, typeof e != "symbol" ? e + "" : e, t);
var J = (c, e, t) => new Promise((r, i) => {
  var n = (h) => {
    try {
      o(t.next(h));
    } catch (l) {
      i(l);
    }
  }, s = (h) => {
    try {
      o(t.throw(h));
    } catch (l) {
      i(l);
    }
  }, o = (h) => h.done ? r(h.value) : Promise.resolve(h.value).then(n, s);
  o((t = t.apply(c, e)).next());
});
const S = (c) => `[${c.map((e) => {
  switch (typeof e) {
    case "string":
      return `"${e}"`;
    default:
      return e;
  }
}).join(", ")}]`, M = (c) => c && typeof c == "object" && !(c instanceof Array), Q = (c, e, t = !1) => {
  const r = c.split(" ");
  let i = [], n = "";
  for (const s of r)
    if ((n + s).length > e)
      if (t && s.length > e) {
        let o = Math.ceil(s.length / e);
        for (let h = 0; h < o; h++) {
          const l = s.slice(h * e, (h + 1) * e);
          n.trim() && i.push(n.trim()), n = l + " ";
        }
      } else
        n && i.push(n.trim()), n = s + " ";
    else
      n += s + " ";
  return n && i.push(n.trim()), i.join(`
`);
}, Te = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  displayArray: S,
  isPlainObject: M,
  wrapString: Q
}, Symbol.toStringTag, { value: "Module" })), F = class F {
  /**
   * A pixel mesh stores a 2-dimensional array of `Pixels`.
   * @param {Object} config The config for this `PixelMesh` instance.
   * @param {Array<Pixel>} config.data The frame's 2-dimensional (array of row arrays of `Pixels`) (left-to-right, top-to-bottom) data array.
   * @param {Array<number>} config.origin An array of display offsets to apply when rendering this pixel.
   */
  constructor(e) {
    if (!M(e))
      throw new TypeError(
        "Expected a plain object for PixelMesh constructor config parameter."
      );
    const { data: t, origin: r } = e;
    if (!t || !(t instanceof Array))
      throw new TypeError(
        'Expected an array for "PixelMesh" config.data property.'
      );
    this.data = t, this.origin = r;
  }
  get origin() {
    return this.__rawOrigin;
  }
  set origin(e) {
    if (e) {
      if (!(e instanceof Array))
        throw new SyntaxError(
          'Invalid origin provided to "PixelMesh". Expected: [<xOffset>, <yOffset>]'
        );
      if (!Number.isInteger(e[0]) || !Number.isInteger(e[0]))
        throw new SyntaxError(
          "PixelMesh origin must be an array of integers."
        );
    }
    this.__rawOrigin = e;
  }
  /**
   * Get the `PixelMesh`'s width.
   */
  get width() {
    let e = -1;
    for (const t of this.data.filter((r) => r))
      t.length > e && (e = t.length);
    return e === -1 ? void 0 : e;
  }
  /**
   * Get the `PixelMesh`'s height.
   */
  get height() {
    return this.data.length;
  }
  /**
   * Get all the `Pixel`s in this `PixelMesh` in a 1D-array.
   */
  get pixels() {
    return this.data.flat().filter((e) => e);
  }
  /**
   * Set the color of all `Pixels` in this `PixelMesh`.
   * @param {string} color The color to set.
   */
  setColor(e) {
    for (const t of this.pixels)
      t.color = e;
  }
  /**
   * Set the fontWeight of all `Pixels` in this `PixelMesh`.
   * @param {string} fontWeight The fontWeight to set.
   */
  setFontWeight(e) {
    for (const t of this.pixels)
      t.fontWeight = e;
  }
  /**
   * Set the backgroundColor of all `Pixels` in this `PixelMesh`.
   * @param {string} backgroundColor The backgroundColor to set.
   */
  setBackgroundColor(e) {
    for (const t of this.pixels)
      t.backgroundColor = e;
  }
  /**
   * Set the solid status of all `Pixels` in this `PixelMesh`.
   * @param {string} solid Whether or not the pixels should be solid.
   */
  setSolid(e) {
    for (const t of this.pixels)
      t.solid = e;
  }
};
/**
 * Create a `PixelMesh` object from a string. `\n` will create a new row.
 * @param {string} string The string to convert to a `PixelMesh`.
 * @returns {Pixel} the newly created `PixelMesh` object.
 */
m(F, "fromString", (e) => new F({
  data: e.split(`
`).map(
    (t) => t.split("").map(
      (r) => r && r.trim() !== "" && y.fromString(r) || null
    )
  )
}));
let g = F;
const W = class W {
  /**
   * Pixel data for a frame coordinate.
   * @param {Object} config The pixel config object.
   * @param {string} config.value The text-value of this spixel.
   * @param {string} config.color The CSS color value of this pixel.
   * @param {string|number} config.fontWeight The CSS font weight value of this pixel.
   * @param {string} config.backgroundColor An optional background color for the pixel.
   * @param {boolean} config.solid Whether or not this pixel is solid. This parameter is used for collision detection.
   * @param {Array<number>} config.origin An array of display offsets to apply when rendering this pixel.
   */
  constructor(e) {
    if (!M(e))
      throw new TypeError(
        "Expected a plain object for Pixel constructor config parameter."
      );
    const {
      value: t,
      color: r = "#ffffff",
      fontWeight: i = "normal",
      backgroundColor: n,
      solid: s = !1,
      origin: o
    } = e;
    if (typeof t != "string" || t.length !== 1)
      throw new Error(
        "The value of this pixel can only be a 1-character long string."
      );
    if (o && !(o instanceof Array))
      throw new Error(
        'Invalid origin provided to "Pixel". Expected: [<xOffset>, <yOffset>]'
      );
    this.value = t, this.color = r, this.fontWeight = i, this.backgroundColor = n, this.solid = s, this.origin = o;
  }
  get origin() {
    return this.__rawOrigin;
  }
  set origin(e) {
    if (e) {
      if (!(e instanceof Array))
        throw new SyntaxError(
          'Invalid origin provided to "Pixel". Expected: [<xOffset>, <yOffset>]'
        );
      if (!Number.isInteger(e[0]) || !Number.isInteger(e[0]))
        throw new SyntaxError(
          "Pixel origin must be an array of integers."
        );
    }
    this.__rawOrigin = e;
  }
};
/**
 * Create a `Pixel` object from a string.
 * @param {string} string The string to convert to a `Pixel`.
 * @returns {Pixel} the newly created `Pixel` object.
 */
m(W, "fromString", (e) => new W({ value: e }));
let y = W;
const T = class T {
  /**
   * A display frame.
   * @param {Array<Pixel>} data The frame's 1-dimensional (left-to-right, top-to-bottom) data array.
   * Any index after `Screen Width * Screen Height` will not be displayed, no max size is enforced.
   */
  constructor(e) {
    this.data = e;
  }
};
/**
 * Convert a string to a frame.
 * @param {string} string The string to convert.
 * @returns {Frame} the generated Frame.
 */
m(T, "fromString", (e) => new T(e.split("").map((t) => new y({ value: t })))), /**
 * Convert a 2D array of `Pixel`s to a Frame.
 * @param {Array<Array<Pixel>} array The array to convert.
 */
m(T, "from2DArray", (e) => new T(e.flat()));
let B = T;
const z = (c, e, t, r, i, n, s, o) => c < i + s && c + t > i && e < n + o && e + r > n, L = (c, e, t) => Math.max(e, Math.min(c, t)), X = (c) => c * (180 / Math.PI), R = (c) => c * (Math.PI / 180), ue = (c, e) => Math.floor(Math.random() * (e - c + 1)) + c, fe = (c) => {
  if (c === 0 || c === 1) return 1;
  for (let e = c - 1; e >= 1; e--)
    c *= e;
  return c;
}, me = (c, e) => [
  e * Math.cos(R(c)),
  e * Math.sin(R(c))
], pe = (c, e) => [
  X(Math.atan2(e, c)),
  Math.sqrt(j(c, 2) + j(e, 2))
], ge = (c, e, t, r) => X(Math.atan2(r - e, t - c)), be = (c, e, t, r) => Math.sqrt(j(t - c, 2) + j(r - e, 2)), Se = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  aabb: z,
  angleBetweenPoints: ge,
  cartesianToVector: pe,
  clamp: L,
  degreeToRadian: R,
  distanceBetweenPoints: be,
  fact: fe,
  radianToDegree: X,
  range: ue,
  vectorToCartesian: me
}, Symbol.toStringTag, { value: "Module" }));
class we {
  /**
   * Manages loading and playback of an audio file.
   * @param {AudioManager} audioManager The audio manager that will parent this Sound.
   * @param {string} src The source of the audio.
   * @param {string} label The unique label to identify this sound.
   * @param {function} onReady An optional method to call when the audio file is ready to play. Passed the sound object.
   */
  constructor(e, t, r, i) {
    if (typeof r != "string")
      throw new Error(
        `Invalid label "${r}" provided. Must be of type "string".`
      );
    if (typeof t != "string")
      throw new Error(
        `Invalid source "${t}" provided. Must be of type "string".`
      );
    if (e.sounds.hasOwnProperty(r))
      throw new Error(`Audio label "${r}" is already in use.`);
    if (i && typeof i != "function")
      throw new Error(
        '"onReady" value provided to "Sound" is not of type "function".'
      );
    e.sounds[r] = this, this.label = r, this.audioManager = e, this.onReady = i, this.src = t, this.ready = !1, this.element = new Audio(t), this.element.addEventListener("canplaythrough", () => {
      this.ready = !0;
    });
  }
  /**
   * Get the audio's playback rate.
   */
  get playbackRate() {
    return this.element.playbackRate;
  }
  /**
   * Set the audio's playback rate.
   */
  set playbackRate(e) {
    this.element.playbackRate = e;
  }
  /**
   * Get the volume of playback.
   */
  get volume() {
    return this.element.volume;
  }
  /**
   * Set the volume of playback.
   */
  set volume(e) {
    if (typeof e != "number")
      throw new Error(
        `Invalid volume value provided to "Sound" instance: ${e}. Must be of type "number".`
      );
    this.element.volume = L(e, 0, 1);
  }
  /**
   * Get whether the audio is playing.
   */
  get playing() {
    return !this.element.paused;
  }
  /**
   * Get the mute state of the audio.
   */
  get muted() {
    return this.volume === 0 || this.element.muted;
  }
  /**
   * Get the loop value of the audio element.
   */
  get loop() {
    return this.element.loop;
  }
  /**
   * Set the loop value of the audio element.
   */
  set loop(e) {
    this.element.loop = !!e;
  }
  /**
   * Mute the audio without stopping playback.
   */
  mute() {
    this.volume = 0, this.element.muted = !0;
  }
  /**
   * Begin audio playback.
   * @param {Object} config Playback configuration data.
   * @param {boolean} config.allowConcurrentPlayback Whether to allow the sound to be played, even if it is already playing.
   * @param {number} config.volume Optionally overwrite the current volume level before playing.
   * @param {boolean} config.loop Whether to loop audio playback.
   */
  play(e = { allowConcurrentPlayback: !1 }) {
    if (!e)
      throw new Error(
        'No playback config provided to "Sound" play method.'
      );
    if (!this.ready)
      return console.warn(
        `A request for playback of "${this.label}" was made, but it could not be fulfilled as the file is not loaded.`
      );
    e.volume && (this.volume = e.volume), e.loop && (this.loop = e.loop), this.playing ? e.allowConcurrentPlayback && this.element.cloneNode().play() : this.element.play();
  }
  /**
   * Stop audio playback.
   */
  stop() {
    this.element.paused || this.element.pause();
  }
}
class _e {
  /**
   * Controls audio playback.
   * @param {Runtime} runtime The game's runtime object.
   */
  constructor(e) {
    this.runtime = e, this.sounds = {};
  }
  /**
   * Get all currently playing tracks.
   */
  get playing() {
    return Object.values(this.sounds).filter(({ playing: e }) => e);
  }
  /**
   * Load an audio file to be played at a later time.
   * @param {string} src The URL of the audio file to preload.
   * @param {string} label An identifer to use to play this audio later.
   * @param {function} onReady An optional method to call when the audio file is ready to play. Passed the sound object.
   */
  preload(e, t, r) {
    new we(this, e, t, r);
  }
  /**
   * Unload a preloaded audio file.
   * @param {string} label The identifier of the audio to unload.
   * @param {boolean} stop Whether to stop the audio immediately. If `false`, the audio will be unloaded after playback has completed. (if it is currently playing)
   */
  unload(e, t = !1) {
    this.sounds.hasOwnProperty(e) && (t && this.sounds[e].stop(), delete this.sounds[e]);
  }
  /**
   * Play a preloaded audio file.
   * @param {string} label The identifier of the audio to play.
   * @param {Object} config Playback configuration.
   */
  play(e, t) {
    if (!this.sounds.hasOwnProperty(e))
      throw new Error(
        `Could not play audio. No preloaded file with label: "${e}".`
      );
    this.sounds[e].play(t);
  }
  /**
   * Play a sound that has not been preloaded. (not recommended)
   * @param {string} src The URL of the audio file to play.
   */
  playNotPreloaded(e) {
    const t = new Audio(e);
    t.addEventListener("canplaythrough", (r) => {
      t.play();
    });
  }
}
class ye {
  /**
   * The scene contains variable layers and compiles them into one frame to render to the screen.
   * @param {Scene} scene The `Scene` this `Camera` is a part of.
   */
  constructor(e) {
    /**
     * Check if a bounding box is on screen.
     * @param {number} x The x-coordinate to check.
     * @param {number} y The y-coordinate to check.
     * @param {number} width The width to check.
     * @param {number} height The height to check.
     * @param {number} parallaxX Optional parallax x-value.
     * @param {number} parallaxY Optional parallax y-value.
     */
    m(this, "isOnScreen", (e, t, r, i, n = 1, s = 1) => z(
      e,
      t,
      r,
      i,
      this.x * n,
      this.y * s,
      this.scene.runtime.renderer.width,
      this.scene.runtime.renderer.height
    ));
    this.scene = e, this.__rawX = 0, this.__rawY = 0;
  }
  /**
   * Get the game object's adjusted x-coordinate.
   */
  get x() {
    return Math.round(this.__rawX);
  }
  /**
   * Set the game object's x-coordinate.
   */
  set x(e) {
    if (typeof e != "number")
      throw new Error(
        "Camera x-coordinate value must be of type 'number'."
      );
    this.__rawX = e;
  }
  /**
   * Get the game object's adjusted y-coordinate.
   */
  get y() {
    return Math.round(this.__rawY);
  }
  /**
   * Set the game object's y-coordinate.
   */
  set y(e) {
    if (typeof e != "number")
      throw new Error(
        "Camera y-coordinate value must be of type 'number'."
      );
    this.__rawY = e;
  }
}
class ee {
  /**
   * The most core level object.
   * @param {Scene} scene The scene this Object is a part of.
   */
  constructor(e) {
    if (!crypto || !crypto.randomUUID)
      throw new Error(
        'This environment does not support the JavaScript "crypto" library. Only secure contexts (HTTPS) support "crypto.randomUUID".'
      );
    if (!(e instanceof H))
      throw new TypeError(
        'Invalid object provided to Core class constructor. Expected an instance of "Scene".'
      );
    this.scene = e, this.id = crypto.randomUUID();
  }
  get runtime() {
    return this.scene.runtime;
  }
}
class A extends ee {
  /**
   * A core object that can have its runtime methods managed by the runtime itself, or another object.
   *
   * `GameObject`s can have a `get renderable()` get method that returns a `Pixel` or `PixelMesh` object for rendering purposes.
   * `GameObject`s do not always need to be rendered, and a `get renderable()` method is not indicative of whether the `GameObject`'s logic will function.
   * `GameObject`s will not be rendered unless they are added to a layer.
   *
   * @param {Scene} scene The scene this `GameObject` is a part of.
   * @param {number} x This `GameObject`'s x-coordinate.
   * @param {number} y This  `GameObject`'s y-coordinate.
   *@param {string} layer The label of the layer to start the `GameObject` on.
   */
  constructor(e, t = 0, r = 0, i) {
    if (super(e), typeof t != "number")
      throw new Error(
        "GameObject x-coordinate value must be of type 'number'."
      );
    if (typeof r != "number")
      throw new Error(
        "GameObject y-coordinate value must be of type 'number'."
      );
    this.__rawX = t, this.__rawY = r, this.__rawVisible = !0, this.__rawRenderable = new y({ value: "#", color: "magenta" }), this.behaviors = [], i && (this.layer = i);
  }
  /**
   * Get this `GameObject`'s position on the screen, relative to the camera and the layer parallax.
   * Return format: `[x, y]`
   */
  get positionOnScreen() {
    if (!this.layer) return;
    const {
      scene: { camera: e },
      layer: {
        parallax: [t, r]
      }
    } = this, [i, n] = [
      Math.round(e.x * t),
      Math.round(e.y * r)
    ];
    return [this.x - i, this.y - n];
  }
  /**
   * Get whether the game object is on-screen.
   */
  get isOnScreen() {
    if (!this.scene || !this.layer) return !1;
    const {
      scene: { camera: e },
      x: t,
      y: r
    } = this;
    if (!this.renderable) return !1;
    const { width: i, height: n } = this.renderable, [s, o] = this.layer.parallax;
    return e.isOnScreen(t, r, i, n, s, o);
  }
  /**
   * Get the `GameObject`'s visibility status.
   * If the `GameObject` is not part of a layer,
   * or is in a `Layer` whose `visible` parameter is false,
   * it will also be false.
   */
  get visible() {
    return this.__rawVisible && this.layer && this.layer.visible;
  }
  /**
   * Set the `GameObject`'s visibility status.
   */
  set visible(e) {
    this.__rawVisible = !!e;
  }
  /**
   * Get the game object's adjusted x-coordinate.
   */
  get x() {
    return Math.round(this.__rawX);
  }
  /**
   * Set the game object's x-coordinate.
   */
  set x(e) {
    if (typeof e != "number")
      throw new Error(
        "GameObject x-coordinate value must be of type 'number'."
      );
    this.__rawX = e;
  }
  /**
   * Get the game object's adjusted y-coordinate.
   */
  get y() {
    return Math.round(this.__rawY);
  }
  /**
   * Set the game object's y-coordinate.
   */
  set y(e) {
    if (typeof e != "number")
      throw new Error(
        "GameObject y-coordinate value must be of type 'number'."
      );
    this.__rawY = e;
  }
  /**
   * Get the width of this `GameObject`'s renderable.
   */
  get width() {
    return this.renderable ? this.renderable instanceof g ? this.renderable.width : 1 : 0;
  }
  /**
   * Get the height of this `GameObject`'s renderable.
   */
  get height() {
    return this.renderable ? this.renderable instanceof g ? this.renderable.height : 1 : 0;
  }
  /**
   * Get the origin of this `GameObject`'s renderable.
   */
  get origin() {
    return this.renderable && this.renderable.origin || [0, 0];
  }
  /**
   * Get the `GameObject`'s current layer.
   */
  get layer() {
    return this.scene.layerManager.layers.find(
      ({ gameObjects: e }) => e.includes(this)
    );
  }
  /**
   * Get the label of the `GameObject`'s current layer.
   */
  get layerLabel() {
    return this.layer && this.layer.label;
  }
  /**
   * Change the `GameObject`'s layer. Set to a falsey value to remove from any active layers.
   * @param {string} layer The name of the layer to move to.
   */
  set layer(e) {
    if (this.layer && (this.layer.gameObjects = this.layer.gameObjects.filter(
      (t) => t !== this
    )), e) {
      if (typeof e != "string")
        throw new Error("Provided layer label is not a string.");
      const {
        scene: {
          layerManager: { layers: t }
        }
      } = this, r = t.find((i) => i.label === e);
      if (!r)
        throw new Error(`No layer exists with label "${e}"`);
      r.gameObjects.push(this);
    }
  }
  /**
   * The object's renderable element.
   */
  get renderable() {
    return this.__rawRenderable;
  }
  /**
   * Set this `GameObject`'s renderable.
   */
  set renderable(e) {
    if (e && !(e instanceof y) && !(e instanceof g))
      throw new TypeError(
        "A GameObject's renderable property must be an instance of Pixel, an instance of PixelMesh, or falsey."
      );
    this.__rawRenderable = e;
  }
  /**
   * Restore the initial getter/setter functionality for this `GameObject` instance's `renderable` property.
   */
  __resetRenderable() {
    Object.defineProperty(this, "renderable", {
      get() {
        return this.__rawRenderable;
      },
      set(e) {
        if (e && !(e instanceof y) && !(e instanceof g))
          throw new TypeError(
            "A GameObject's renderable property must be an instance of Pixel, an instance of PixelMesh, or falsey."
          );
        this.__rawRenderable = e;
      },
      configurable: !0,
      enumerable: !0
    });
  }
  /**
   * Whether the object is on a paused layer or the runtime is paused.
   *
   * This should be checked when input and logic functions are called, to ensure they do not run when the `GameObject` is paused.
   *
   * This **does not** need to be checked in the `GameObject`s `onTick()` method, as the `onTick()` method is not called by its parent layer when that layer is paused.
   */
  get paused() {
    const { runtime: e, layer: t } = this;
    return !!(t && t.paused || e.paused);
  }
  /**
   * Run the events of each object behavior.
   *
   * Runs before this `GameObject`'s `onTick` method.
   */
  __behave() {
    if (!this.paused)
      for (const e of this.behaviors)
        e.enabled && e.onTick && e.onTick();
  }
  /**
   * Delete this `GameObject`.
   *
   * **NOTE:** JavaScript has an automatic garbage collector, which means as long as an object is not referenced anywhere, it will be removed from memory.
   * This method will remove references to the object from engine-created runtime objects. Custom objects or variables that reference this object must stop referencing it before it is fully removed from memory.
   *
   *
   * At minimum, this functions behaviors and tick methods will stop when `GameObject.delete()` is executed. Unless they are called from somewhere other than its parent `Layer`.
   */
  delete() {
    this.layer && (this.layer = void 0), delete this;
  }
}
const p = class p {
  /**
   * Apply a deadzone value to a set of axes inputs.
   * @param {Object<number>} values The axis input values. In a key-value object.
   * @param {number} threshold The deadzone threshold value. (default `0.1`)
   * @returns
   */
  static applyDeadzone(e, t = p.deadzoneThreshold) {
    for (const [r, i] of Object.entries(e))
      Math.abs(i) < t && (e[r] = 0), e[r] = (i - Math.sign(i) * t) / (1 - t);
    return e;
  }
  /**
   * Create a simple interface for collecting gamepad inputs.
   *
   * This interface attempts to normalize inputs for these controllers to make it easier to interact with them.
   * Unsupported controllers can still be interacted with through the interfaces `raw` property.
   *
   * ### Tested Controllers
   * - XB (One) Wireless Controller
   * - PS4
   * - NS Pro
   *
   * @param {InputManager} inputManager The `InputManager` instance this Gamepad is associated with.
   * @param {number} index The index of the gamepad.
   */
  constructor(e, t) {
    this.index = t, this.inputManager = e;
  }
  /**
   * Get the inputs in a normalized format. To allow identical input layouts even with differing input names.
   */
  get normalized() {
    if (!this.raw) return;
    const {
      raw: { axes: e, buttons: t, mapping: r }
    } = this;
    return r === "standard" ? {
      axes: p.applyDeadzone(
        Object.fromEntries(
          e.filter(
            (i, n) => p.standardAxesMap[n]
          ).map((i, n) => [
            p.standardAxesMap[n],
            i
          ])
        )
      ),
      buttons: Object.fromEntries(
        t.filter(
          (i, n) => p.standardButtonMap[n]
        ).map((i, n) => [
          p.standardButtonMap[n],
          i
        ])
      )
    } : this.asXB || this.asPS || this.asNS;
  }
  /**
   * Get the inputs from a xb controller.
   */
  get asXB() {
    if (!this.raw) return;
    const {
      raw: { axes: e, buttons: t }
    } = this;
    return {
      axes: Object.fromEntries(
        e.filter(
          (r, i) => p.standardAxesMap[i]
        ).map((r, i) => [
          p.standardAxesMap[i],
          r
        ])
      ),
      buttons: Object.fromEntries(
        t.filter(
          (r, i) => p.xbButtonMap[i]
        ).map((r, i) => [
          p.xbButtonMap[i],
          r
        ])
      )
    };
  }
  /**
   * Get inputs from a ps controller.
   */
  get asPS() {
    if (!this.raw) return;
    const {
      raw: { axes: e, buttons: t }
    } = this;
    return {
      axes: Object.fromEntries(
        e.filter(
          (r, i) => p.standardAxesMap[i]
        ).map((r, i) => [
          p.standardAxesMap[i],
          r
        ])
      ),
      buttons: Object.fromEntries(
        t.filter(
          (r, i) => p.psButtonMap[i]
        ).map((r, i) => [
          p.psButtonMap[i],
          r
        ])
      )
    };
  }
  /**
   * Get inputs from a ns pro controller.
   */
  get asNS() {
    if (!this.raw) return;
    const {
      raw: { axes: e, buttons: t }
    } = this;
    return {
      axes: Object.fromEntries(
        e.filter(
          (r, i) => p.standardAxesMap[i]
        ).map((r, i) => [
          p.standardAxesMap[i],
          r
        ])
      ),
      buttons: Object.fromEntries(
        t.filter(
          (r, i) => p.nsButtonMap[i]
        ).map((r, i) => [
          p.nsButtonMap[i],
          r
        ])
      )
    };
  }
  /**
   * Get the controller axes. (normalizes inputs to two analogue sticks)
   */
  get axes() {
    return this.normalized && this.normalized.axes;
  }
  /**
   * Get the controller buttons. (normalizes inputs to a standard "xb" layout: [a/b/x/y, dpad, triggers/bumpers])
   */
  get buttons() {
    return this.normalized && this.normalized.buttons;
  }
  get raw() {
    return this.inputManager.rawGamepads[this.index];
  }
  get mapping() {
    if (this.raw)
      return this.raw.mapping === "standard" ? "standard" : "unknown";
  }
  get id() {
    return this.raw && this.raw.id;
  }
  get vibrationActuator() {
    return this.raw && this.raw.vibrationActuator;
  }
  get hapticActuators() {
    return this.raw && this.raw.hapticActuators;
  }
  get hand() {
    return this.raw && this.raw.hand;
  }
};
m(p, "gamepadButtonIntervals", 100), m(p, "deadzoneThreshold", 0.1), m(p, "xbButtonMap", [
  "a",
  "b",
  "x",
  "y",
  "leftBumper",
  "rightBumper",
  "leftTrigger",
  "rightTrigger",
  "select",
  "start",
  "leftStickPress",
  "rightStickPress",
  "up",
  "down",
  "left",
  "right"
]), m(p, "psButtonMap", [
  "x",
  "o",
  "square",
  "triangle",
  "l1",
  "r1",
  "l2",
  "r2",
  "share",
  "options",
  "l3",
  "r3",
  "up",
  "down",
  "left",
  "right"
]), m(p, "nsButtonMap", [
  "b",
  "a",
  "y",
  "x",
  "leftBumper",
  "rightBumper",
  "leftTrigger",
  "rightTrigger",
  "-",
  "+",
  "leftStickPress",
  "rightStickPress",
  "up",
  "down",
  "left",
  "right"
]), m(p, "standardButtonMap", [
  "a",
  "b",
  "x",
  "y",
  "l1",
  "r1",
  "l2",
  "r2",
  "select",
  "start",
  "l3",
  "r3",
  "up",
  "down",
  "left",
  "right"
]), m(p, "standardAxesMap", ["lh", "lv", "rh", "rv"]);
let I = p;
class ve {
  /**
   * Handles user input.
   * @param {Scene} scene The current scene.
   */
  constructor(e) {
    m(this, "__eventHandler", (e) => this.__onEvent(e));
    m(this, "__contextHandler", (e) => e.preventDefault());
    /**
     * Handles when the user leaves this tab.
     */
    m(this, "__windowBlurHandler", () => {
      this.keyboard.keys = {}, this.mouse.buttons = {}, delete this.mouse.deltas, delete this.mouse.scroll;
    });
    this.scene = e, this.keyboard = {
      keys: {},
      keyCodes: {},
      keyCode: void 0,
      key: void 0
    }, this.mouse = { buttons: {}, onLayer: {} }, this.__rawFocusables = [], this.__focusIndex = -1, this.__eventListeners = {
      gamepadbuttonpressed: [],
      gamepadbuttondown: [],
      gamepadbuttonup: [],
      gamepadaxes: [],
      all: [],
      click: [
        (t) => {
          for (const [r, i] of this.__gameObjectClicks)
            if (t.targets.includes(r)) {
              let n = x({}, t);
              delete n.targets, n.target = r, i(n);
            }
        }
      ]
    }, this.__gameObjectClicks = [], this.__onCreated(), this.__windowBlurHandler = this.__windowBlurHandler.bind(this);
  }
  /**
   * Get the current focused item.
   */
  get focusTarget() {
    return this.focusables[this.__focusIndex];
  }
  /**
   * Get all focusable items.
   */
  get focusables() {
    return this.__rawFocusables;
  }
  /**
   * Set focusable items.
   */
  set focusables(e) {
    if (!(e instanceof Array))
      throw new TypeError(
        "InputManager focusables property must be an array of GameObjects."
      );
    for (const t of e)
      if (!t instanceof A)
        throw new TypeError(
          'InputManager focusables must be of type "GameObject".'
        );
    this.__rawFocusables = e;
  }
  /**
   * Add a `GameObject` to the list of focusable objects.
   * @param {GameObject} gameObject The `GameObject` instance to add.
   */
  addFocusable(e) {
    if (this.focusables.includes(e))
      throw new Error("This object is already in the focusable list.");
    this.focusables.push(e);
  }
  /**
   * Get the raw `navigator.getGamepads()` data.
   */
  get rawGamepads() {
    return navigator.getGamepads();
  }
  /**
   * Get easy-to-use gamepad data.
   */
  get gamepads() {
    return this.rawGamepads.map((e) => {
      if (!e) return null;
      const { index: t } = e;
      return new I(this, t);
    });
  }
  /**
   * Get the number of gamepads currently connected to the navigator.
   */
  get gamepadsConnected() {
    return this.gamepads ? this.gamepads.filter((e) => e).length : 0;
  }
  /**
   * Get permitted event types.
   */
  get types() {
    return Object.keys(this.__eventListeners);
  }
  /**
   * Get the pointer lock status.
   */
  get hasPointerLock() {
    const { element: e } = this.scene.runtime.renderer;
    return document.pointerLockElement === e;
  }
  /**
   * Initiate a pointer lock request. Pointer lock cannot be achieved unless the user clicks the screen after this method is called.
   */
  requestPointerLock() {
    return J(this, null, function* () {
      const { element: e } = this.scene.runtime.renderer, t = () => {
        this.hasPointerLock || e.requestPointerLock();
      }, r = () => {
        document.pointerLockElement === e && (this.mouse = { buttons: {} });
      };
      document.body.addEventListener("click", t), document.addEventListener(
        "pointerlockerror",
        (i) => {
          console.error("Pointer lock request failed.", i);
        },
        !1
      ), document.addEventListener("pointerlockchange", r, !1);
    });
  }
  __formatKey(e) {
    return e === " " ? "space" : e === "ArrowUp" ? "up" : e === "ArrowDown" ? "down" : e === "ArrowLeft" ? "left" : e === "ArrowRight" ? "right" : e.toLowerCase();
  }
  /**
   * Calls when a key is pushed.
   * @param {Event} event The listener's event.
   */
  __onKeyDown(e) {
    this.preventKeyboardShortcuts && e.preventDefault();
    const { key: t, keyCode: r } = e;
    this.keyboard.keys[this.__formatKey(t)] = !0, this.keyboard.keyCodes[r] = !0, this.keyboard.keyCode = r, this.keyboard.key = t;
  }
  /**
   * Calls when a key is released.
   * @param {Event} event The listener's event.
   */
  __onKeyUp(e) {
    const { key: t, keyCode: r } = e;
    this.keyboard.keys[this.__formatKey(t)] = !1, this.keyboard.keyCodes[r] = !1;
  }
  /**
   * Calls when a mouse button is pushed.
   * @param {Event} event The listener's event.
   */
  __onMouseDown(e) {
    const { button: t } = e;
    switch (t) {
      case 0:
        this.mouse.buttons.left = !0;
        break;
      case 1:
        this.mouse.buttons.middle = !0;
        break;
      case 2:
        this.mouse.buttons.right = !0;
        break;
    }
  }
  /**
   * Calls when a mouse button is clicked.
   */
  __onClick() {
    const { onLayer: e } = this.mouse;
    this.mouse.targets = [];
    for (const [t, [r, i]] of Object.entries(e)) {
      const n = this.scene.layerManager.getAtPosition(
        r,
        i,
        t
      );
      this.mouse.targets = [...this.mouse.targets, ...n];
    }
    this.mouse.targets && (this.mouse.targets = this.mouse.targets.map(
      ({ gameObject: t }) => t.id
    ));
  }
  /**
   * Calls when a mouse button is released.
   * @param {Event} event The listener's event.
   */
  __onMouseUp(e) {
    const { button: t } = e;
    switch (t) {
      case 0:
        this.mouse.buttons.left = !1;
        break;
      case 1:
        this.mouse.buttons.middle = !1;
        break;
      case 2:
        this.mouse.buttons.right = !1;
        break;
    }
  }
  /**
   * Calls when the mouse is moved on screen.
   * @param {Event} event The listener's event.
   */
  __onMouseMove(e) {
    const { clientX: t, clientY: r, movementX: i, movementY: n } = e, {
      scene: {
        camera: { x: s, y: o },
        layerManager: { layers: h },
        runtime: {
          renderer: {
            width: l,
            height: a,
            element: d
          }
        }
      }
    } = this, {
      x: u,
      y: f,
      width: _,
      height: b
    } = d.getBoundingClientRect(), [E, k] = [t - u, r - f], [O, v] = [E / _, k / b];
    if (this.hasPointerLock)
      this.mouse.velocity = [i, n];
    else {
      this.mouse.velocity = [i, n], this.mouse.rawX = t, this.mouse.rawY = r, this.mouse.canvasX = E, this.mouse.canvasY = k, this.mouse.x = L(
        Math.floor(O * l),
        0,
        l
      ), this.mouse.y = L(
        Math.floor(v * a),
        0,
        a
      ), this.mouse.onLayer = {};
      for (const ie of h) {
        const {
          label: ne,
          parallax: [se, oe]
        } = ie;
        this.mouse.onLayer[ne] = [
          this.mouse.x + s * se,
          this.mouse.y + o * oe
        ];
      }
    }
  }
  /**
   * Calls when a mouse wheel is moved.
   * @param {Event} event The listener's event.
   */
  __onMouseWheel(e) {
    const { deltaX: t, deltaY: r, deltaZ: i } = e;
    this.mouse.deltas = { x: t, y: r, z: i }, this.mouse.scroll = {
      x: t > 0 ? "down" : "up",
      y: r > 0 ? "down" : "up",
      z: i > 0 ? "down" : "up"
    };
  }
  /**
   * Reset mouse wheel return data.
   */
  __resetMouseWheel() {
    this.mouse.deltas = { x: 0, y: 0, z: 0 }, this.mouse.scroll = {
      x: null,
      y: null,
      z: null
    };
  }
  /**
   * Calls when a gamepad is connected.
   * @param {Event} event The listener's event.
   */
  __onGamepadConnected(e) {
    const { gamepad: t } = e;
    t.mapping !== "standard" && console.warn(
      `Controller connected to slot ${t.index} with non-standard mapping: "${t.mapping}"`
    ), this.gamepads[t.index] = t;
  }
  /**
   * Calls when a gamepad is disconnected.
   * @param {Event} event The listener's event.
   */
  __onGamepadDisconnected(e) {
    const { gamepad: t } = e;
    this.gamepads[t.index] = null;
  }
  /**
   * Trigger events for a specific event type.
   * @param {string} type The type of event to trigger for.
   * @param {*} data The data to send to that event.
   */
  __triggerEvents(e, t) {
    this.__eventListeners[e] || (this.__eventListeners[e] = []);
    for (const r of this.__eventListeners[e])
      r(t);
  }
  /**
   * Manages different events firing, and maps them to the proper method.
   * @param {Event} event The listener's event.
   */
  __onEvent(e) {
    if (e instanceof MouseEvent || e instanceof WheelEvent) {
      const { type: t } = e;
      switch (t) {
        case "mousedown":
          this.__onMouseDown(e);
          break;
        case "mouseup":
          this.__onMouseUp(e);
          break;
        case "mousemove":
          this.__onMouseMove(e);
          break;
        case "wheel":
          this.__onMouseWheel(e);
          break;
        case "click":
          this.__onClick();
          break;
      }
      this.__triggerEvents(t, x({ type: t }, this.mouse)), this.__triggerEvents("all", x({ type: t }, this.mouse)), t === "click" && this.mouse.target && delete this.mouse.target, this.__resetMouseWheel();
    } else if (e instanceof KeyboardEvent) {
      const { type: t } = e;
      switch (t) {
        case "keydown":
          this.__onKeyDown(e);
          break;
        case "keyup":
          this.__onKeyUp(e);
          break;
      }
      this.__triggerEvents(t, x({ type: t }, this.keyboard)), this.__triggerEvents("all", x({ type: t }, this.keyboard));
    } else if (e instanceof GamepadEvent) {
      const { type: t } = e;
      switch (t) {
        case "gamepadconnected":
          this.__onGamepadConnected(e);
          break;
        case "gamepaddisconnected":
          this.__onGamepadDisconnected(e);
          break;
      }
      this.__triggerEvents(t, { type: t, gamepads: this.gamepads }), this.__triggerEvents("all", { type: t, gamepads: this.gamepads });
    }
  }
  /**
   * Add an event listener to the input manager.
   * @param {string} type The type of event to add.
   * @param {function} listener The event listener function.
   */
  addEventListener(e, t) {
    if (!this.types.includes(e))
      throw new Error(
        `"${e}" is not a valid event type. Must be one of: ${S(
          this.types
        )}`
      );
    this.__eventListeners[e].push(t);
  }
  /**
   * Remove an event listener from the input manager.
   * @param {string} type The type of event to remove.
   * @param {function} listener The event listener function that was added to the event listener.
   */
  removeEventListener(e, t) {
    if (!this.types.includes(e))
      throw new Error(
        `"${e}" is not a valid event type. Must be one of: ${S(
          this.types
        )}`
      );
    this.__eventListeners[e] = this.__eventListeners[e].filter(
      (r) => r !== t
    );
  }
  /**
   * Add a listener for clicks on a `GameObject`.
   * @param {string} gameObjectId The ID of the `GameObject` that, when clicked, triggers the event.
   */
  watchObjectClick(e, t) {
    this.__gameObjectClicks.push([e, t]);
  }
  /**
   * Remove a listener for clicks on a `GameObject`.
   * @param {string} gameObjectId The ID of the `GameObject`.
   * @param {function} listener The event listener function that was added to the event listener.
   */
  unwatchObjectClick(e, t) {
    this.__gameObjectClicks = this.__gameObjectClicks.filter(
      (r) => r[0] !== e && r[1] !== t
    );
  }
  /**
   * Add an event listener to the window for the entire `InputManager`.
   * @param {string} type The type of event to add.
   * @param {function} handler The handler for that event.
   */
  __addGlobalEventListener(e, t) {
    this.__eventListeners[e] || (this.__eventListeners[e] = []), window.addEventListener(e, t);
  }
  /**
   * Remove an event listener from the window.
   * @param {string} type The type of event to remove.
   * @param {function} handler The handler that was set for that event.
   */
  __removeGlobalEventListener(e, t) {
    delete this.__eventListeners[e], window.removeEventListener(e, t);
  }
  __onCreated() {
    this.__addGlobalEventListener("keydown", this.__eventHandler), this.__addGlobalEventListener("keyup", this.__eventHandler), this.__addGlobalEventListener("mousemove", this.__eventHandler), this.__addGlobalEventListener("mousedown", this.__eventHandler), this.__addGlobalEventListener("mouseup", this.__eventHandler), this.__addGlobalEventListener("click", this.__eventHandler), this.__addGlobalEventListener("wheel", this.__eventHandler), this.__addGlobalEventListener("gamepadconnected", this.__eventHandler), this.__addGlobalEventListener(
      "gamepaddisconnected",
      this.__eventHandler
    ), this.__addGlobalEventListener("contextmenu", this.__contextHandler), window.addEventListener("blur", this.__windowBlurHandler);
  }
  /**
   * Unload the `InputManager` instance by removing all system event listeners.
   */
  __unLoad() {
    this.__removeGlobalEventListener("keydown", this.__eventHandler), this.__removeGlobalEventListener("keyup", this.__eventHandler), this.__removeGlobalEventListener("mousemove", this.__eventHandler), this.__removeGlobalEventListener("mousedown", this.__eventHandler), this.__removeGlobalEventListener("mouseup", this.__eventHandler), this.__removeGlobalEventListener("click", this.__eventHandler), this.__removeGlobalEventListener("wheel", this.__eventHandler), this.__removeGlobalEventListener(
      "gamepadconnected",
      this.__eventHandler
    ), this.__removeGlobalEventListener(
      "gamepaddisconnected",
      this.__eventHandler
    ), this.__removeGlobalEventListener("contextmenu", this.__contextHandler), window.removeEventListener("blur", this.__windowBlurHandler);
  }
  /**
   * Handle non-window events that don't have native listeners.
   */
  __onTick() {
    if (this.gamepadsConnected === 0) return;
    const e = this.gamepads && this.gamepads.filter(
      (t) => t && t.mapping === "standard"
    );
    if (this.__eventListeners.gamepadaxes.length > 0)
      for (const t of e) {
        const { axes: r, index: i } = t;
        if (Object.values(r).map((s) => s !== 0).find((s) => s)) {
          const s = {
            gamepad: t,
            index: i,
            axes: r
          };
          this.__triggerEvents("gamepadaxes", C(x({}, s), {
            type: "gamepadaxes"
          })), this.__triggerEvents("all", C(x({}, s), {
            type: "gamepadaxes"
          }));
        }
      }
    if (this.__eventListeners.gamepadbuttonpressed.length > 0 || this.__eventListeners.gamepadbuttondown.length > 0 || this.__eventListeners.gamepadbuttonup.length > 0) {
      this.__gamepadButtonHistory || (this.__gamepadButtonHistory = {});
      const r = performance.now() - (this.__lastGamepadButtonEvent || 0) > I.gamepadButtonIntervals;
      for (const i of e) {
        const { buttons: n, index: s } = i;
        for (const [o, { pressed: h }] of Object.entries(n)) {
          const l = this.__gamepadButtonHistory[s] && this.__gamepadButtonHistory[s][o];
          this.__gamepadButtonHistory[s] || (this.__gamepadButtonHistory[s] = {});
          const a = {
            gamepad: i,
            index: s,
            button: o,
            buttons: this.__gamepadButtonHistory[s]
          };
          h ? (this.__gamepadButtonHistory[s][o] = !0, r && (this.__triggerEvents("gamepadbuttondown", C(x({}, a), {
            type: "gamepadbuttondown"
          })), this.__triggerEvents("all", C(x({}, a), {
            type: "gamepadbuttondown"
          })))) : (l && (this.__triggerEvents("gamepadbuttonpressed", C(x({}, a), {
            type: "gamepadbuttonpressed"
          })), this.__triggerEvents("all", C(x({}, a), {
            type: "gamepadbuttonpressed"
          }))), this.__gamepadButtonHistory[s][o] = !1, r && (this.__triggerEvents("gamepadbuttonup", C(x({}, a), {
            type: "gamepadbuttonup"
          })), this.__triggerEvents("all", C(x({}, a), {
            type: "gamepadbuttonup"
          }))));
        }
      }
      r && (this.__lastGamepadButtonEvent = performance.now());
    }
  }
}
class Z {
  /**
   * A layer is a construct of other objects. The layer manages these objects and can optionally render them to the screen.
   * @param {LayerManager} layerManager The `LayerManager` parent object.
   * @param {Object} config The `Layer`'s config object.
   * @param {string} config.label This layer's label.
   * @param {Array<Number>} config.parallax This layer's parallax array. `[x, y]` Numbers 0-1 determine how much this layer moves with the camera. `[0, 0]` for layers that do not move.
   * @param {Array<function>} config.gameObjectConstructors An array of functions that return game objects.
   */
  constructor(e, t) {
    if (!M(t))
      throw new TypeError(
        "Expected a plain object for Layer constructor config parameter."
      );
    const { label: r, parallax: i = [1, 1], gameObjectConstructors: n } = t;
    this.layerManager = e, this.label = r, this.layerManager.layers.push(this), this.gameObjects = [], n && this.__populateGameObjects(n), this.paused = !1, this.parallax = i, this.__rawVisible = !0;
  }
  /**
   * Converts the config array of gameObjects into active `GameObject`s.
   * @param {Array<Function|GameObject>} gameObjectConstructors The array of `GameObject` population functions to run. Each function is passed the current `Scene` instance.
   * @returns {Array<GameObject>} The new array of `GameObject`s.
   */
  __populateGameObjects(e) {
    for (const t of e)
      if (typeof t != "function")
        throw new TypeError(
          `Each value provided to a Layer's "configuration.gameObjects"`
        );
    this.gameObjects = e.map((t) => {
      const r = t(
        this.layerManager.scene
      );
      if (!(r instanceof A))
        throw new TypeError(
          'Each gameObjectConstructor function must return an object of type "GameObject".'
        );
      return r;
    }).filter(
      (t) => t && t instanceof A
    );
    for (const t of this.gameObjects)
      t.layer = this.label;
  }
  /**
   * Get the `Layer`'s visibility status.
   */
  get visible() {
    return this.__rawVisible;
  }
  /**
   * Set the `Layer`'s visibility status.
   */
  set visible(e) {
    this.__rawVisible = !!e;
  }
  /**
   * Returns a frame composed of a layer's objects.
   */
  get frame() {
    const {
      layerManager: {
        scene: {
          camera: e,
          runtime: { renderer: t }
        }
      },
      parallax: [r, i]
    } = this, [n, s] = [
      Math.round(e.x * r),
      Math.round(e.y * i)
    ], o = (l, a, d) => {
      if (!l || !(l instanceof y) || !e.isOnScreen(a, d, 1, 1, r, i) || (!l.value || l.value.trim() === "") && (!l.backgroundColor || l.backgroundColor === "transparent"))
        return;
      const [u, f] = [a - n, d - s], _ = t.coordinatesToIndex(u, f);
      h[_] = l;
    }, h = [];
    for (const l of this.gameObjects.filter(
      ({ visible: a }) => a
    )) {
      const { renderable: a } = l;
      let { x: d, y: u } = l;
      if (a) {
        if (a.origin) {
          const [f, _] = a.origin;
          d -= f, u -= _, d = Math.round(d), u = Math.round(u);
        }
        if (a instanceof y)
          o(a, d, u);
        else if (a instanceof g) {
          if (!e.isOnScreen(
            d,
            u,
            a.width,
            a.height,
            r,
            i
          ))
            continue;
          for (let f = 0; f < a.data.length; f++) {
            const _ = a.data[f];
            if (!(!_ || _.length === 0))
              for (let b = 0; b < _.length; b++) {
                const E = _[b];
                o(E, d + b, u + f);
              }
          }
        }
      } else
        continue;
    }
    return new B(h);
  }
  __onTick() {
    const {
      layerManager: {
        scene: { runtime: e }
      },
      gameObjects: t,
      paused: r
    } = this;
    if (!(r || e.paused))
      for (const i of t)
        i.__behave(), e.__runOnTick(i);
  }
}
class xe {
  /**
   * The layer manager contains variable layers and compiles them into one frame to render to the screen.
   * @param {Scene} scene The current loaded `Scene`.
   * @param {Array<Object>} layers The layer configuration objects.
   */
  constructor(e, t) {
    /**
     * Get a layer by its label.
     * @param {string} label The label of the layer to get.
     * @returns {Layer} A layer with the label provided. Or `undefined` if no layer was found.
     */
    m(this, "getLayerByLabel", (e) => this.layers.find((t) => t.label === e));
    this.scene = e, this.layers = t;
  }
  /**
   * Get all visible layers in this `LayerManager`.
   */
  get visibleLayers() {
    return this.layers.filter((e) => e.visible);
  }
  /**
   * Check for content at a location.
   * @param {number} x The x-coordinate to check.
   * @param {number} y The y-coordinate to check.
   * @param {string} layer An optional layer to check. If no layer is provided, all layer's are checked.
   */
  getAtPosition(e, t, r) {
    const i = this.layers.find(({ label: o }) => o === r);
    if (r && !i)
      throw new Error(`No layer exists with label "${r}".`);
    const n = r ? [i] : this.layers, s = [];
    for (const o of n) {
      const { gameObjects: h } = o;
      for (const l of h) {
        const { renderable: a, x: d, y: u } = l;
        if (a instanceof y && d === e && u === t)
          s.push({ gameObject: l, pixel: a });
        else if (a instanceof g && z(
          e,
          t,
          1,
          1,
          d,
          u,
          a.width,
          a.height
        )) {
          const f = a.data[t - u] && a.data[t - u][e - d];
          if (!f) continue;
          s.push({
            gameObject: l,
            pixel: f
          });
        }
      }
    }
    return s;
  }
  /**
   * Check for a solid at a location.
   * @param {number} x The x-coordinate to check.
   * @param {number} y The y-coordinate to check.
   * @param {string} layer An optional layer to check. If no layer is provided, all layer's are checked.
   */
  solidAtPosition(e, t, r) {
    const i = this.getAtPosition(e, t, r);
    for (const n of i) if (n.pixel.solid) return n;
    return !1;
  }
  /**
   * Create layers from config.
   * @param {Array<*>} layers The layer creation array.
   */
  __createLayers(e = []) {
    this.layers = [], e.includes("system") || new Z(this, { label: "system" });
    for (const t of e) {
      if (this.getLayerByLabel(t.label))
        throw new Error(
          `More than one layer is currently configured with the label: "${t.label}"`
        );
      new Z(this, t);
    }
  }
  __mergedRender() {
    const {
      scene: {
        runtime: { renderer: e }
      }
    } = this, t = e.compileFrames(
      ...this.visibleLayers.map((r) => r.frame)
    );
    JSON.stringify(t) === this.lastFrame && e.hasDrawn || (this.lastFrame = JSON.stringify(t), e.drawFrames([t]));
  }
  __stackedRender() {
    const {
      scene: {
        runtime: { renderer: e }
      }
    } = this, t = this.visibleLayers.map((r) => r.frame);
    e.drawFrames(t);
  }
  __onLoad() {
    this.__createLayers(this.layers);
  }
  __onTick() {
    const {
      scene: {
        runtime: e,
        runtime: {
          renderer: {
            config: { renderMode: t }
          }
        }
      }
    } = this;
    if (!e.paused)
      for (const r of this.layers) r.__onTick();
    t === "stacked" ? this.__stackedRender() : this.__mergedRender();
  }
}
class H {
  /**
   * A scene is a level, screen, or world that can be load in at any point during the runtime.
   * @param {Runtime} runtime The main runtime object.
   * @param {Object} config The `Scene` configuration object.
   * @param {string} config.label The `Scene`'s label.
   * @param {Array<Object>} config.layers An optional array of configuration objects for each layer in the `Scene`.
   * @param {string} config.layers[].label The layer's label.
   * @param {Array<number>} [config.layers[].parallax] Optional parallax data, where the format is [integer, integer]. (`[1, 1]` is 100% parallax, `[0, 0]` is 0% parallax)
   * @param {Array<function>} [config.layers[].gameObjectConstructors] Optional callback functions that return `GameObject`s for this layer.
   * @param {function} [config.layers[].gameObjectConstructors[]] A callback function, passed this `Scene` as an argument, that return an instance of `GameObject`.
   * @param {function} config.onLoad A callback (passed this `Scene` as an argument) that runs when the `Scene` has finished loading.
   * @param {function} config.onTick A callback (passed this `Scene` as an argument) that runs every frame that this `Scene` is loaded.
   */
  constructor(e, t) {
    if (this.runtime = e, !e || !(e instanceof Ee))
      throw new TypeError(
        "Scene constructor was not provided an instance of Runtime."
      );
    H.validateConfig(t);
    const { label: r, layers: i, onLoad: n, onTick: s } = t;
    this.label = r, this.camera = new ye(this), this.layerManager = new xe(this, i), this.inputManager = new ve(this), n && (this.onLoadPassthrough = n), s && (this.onTickPassthrough = s), this.__onTick.bind(this), this.__onLoad();
  }
  /**
   * Get the number of `GameObject`s in the current scene.
   */
  get gameObjects() {
    return this.layerManager.layers.map(({ gameObjects: e }) => e.length).reduce((e, t) => e + t);
  }
  /**
   * Validates a scene configuration file and throws an error if it is invalid.
   * @param {Object} config The config object to validate.
   */
  static validateConfig(e) {
    if (!M(e))
      throw new TypeError(
        "Expected a plain object for Scene constructor config parameter."
      );
    if (!e.label || typeof e.label != "string")
      throw new Error(
        `Invalid label value provided to Scene configuration: "${e.label}". Must be a string.`
      );
    if (e.layers) {
      if (!(e.layers instanceof Array))
        throw new TypeError(
          'Scene configuration "layers" property should be an array.'
        );
      for (const t of e.layers) {
        if (!t)
          throw new Error(
            `Invalid layer provided to Scene layers config: ${t}`
          );
        if (!t.label)
          throw new Error(
            "No label provided to layer in Scene config."
          );
        if (typeof t.label != "string")
          throw new Error(
            `Provided layer name <${layerName}> is not of type 'string'.`
          );
        if (t.parallax && (!(t.parallax instanceof Array) || typeof t.parallax[0] != "number" || typeof t.parallax[1] != "number"))
          throw new Error(
            "Invalid parallax data provided to layer configuration. Required format: [<x>, <y>]"
          );
        if (t.gameObjectConstructors) {
          if (!(t.gameObjectConstructors instanceof Array))
            throw new Error(
              'Invalid "gameObjectConstructors" data provided to layer configuration. Required format: [(scene) => { return <instance of GameObject> }]'
            );
          for (const r of t.gameObjectConstructors)
            if (typeof r != "function")
              throw new Error(
                "gameObjectConstructors array must contain callback functions that return constructed GameObject instances."
              );
        }
      }
    }
    if (e.onLoad && typeof e.onLoad != "function")
      throw new Error(
        '"onLoad" method provided to scene config is not of type "function".'
      );
    if (e.onTick && typeof e.onTick != "function")
      throw new Error(
        '"onTick" method provided to scene config is not of type "function".'
      );
  }
  /**
   * Unload the scene.
   */
  __unLoad() {
    this.inputManager.__unLoad();
  }
  __onLoad() {
    this.layerManager.__onLoad(), this.onLoadPassthrough && this.onLoadPassthrough(this);
  }
  __onTick() {
    this.inputManager.__onTick(), this.layerManager.__onTick(), this.onTickPassthrough && this.onTickPassthrough(this);
  }
}
class Ee {
  /**
   * The overall game state and management system.
   * @param {Object} config The game's config object.
   * @param {Object} config.renderer Configuration for the `Renderer` class.
   * @param {Array<Number>} config.renderer.resolution Determines the resolution (in characters) of the renderer. Format: `[integer width, integer height]`
   * @param {Element|string} config.renderer.canvas A DOM `<canvas/>` element, or a CSS selector string that targets one. This element will be used for rendering.
   * @param {Boolean} config.renderer.forceParentStyles A boolean indicating whether the parent of the `config.renderer.canvas` element should have styles applied for properly containing the canvas. Ideally, the canvas' parent element is a wrapper with no other elements in it. Default `true`.
   * @param {string} config.renderer.fontSize A string CSS `font-size` value that will be used for text displayed in the renderer. Defaults to `"32px"`. An increased font size does not increase the size of characters on the screen, but their resolution quality instead. (smaller font sizes will result in blurrier characters)
   * @param {"off"|"letterbox"} config.renderer.scaling The scaling mode for the canvas. Should be one of: `"off"`, `"letterbox"`.
   * - "letterbox" &mdash; Scales the canvas element to fit the viewport without changing its aspect ratio.
   * - "off" &mdash; Does not modify the scale of the canvas element.
   * @param {boolean} config.renderer.useWebWorkers Whether or not to use web workers for rendering. Default `true`.
   * @param {"stacked"|"merged"} config.renderer.renderMode Should be one of: `"stacked"`, `"merged"`.
   * #### Stacked Mode
   *
   * -   **Description:** Draws each layer in order, stacked on top of each other.
   * -   **Behavior:** Layers are drawn one on top of the other, allowing characters to overlap.
   * -   **Performance:** More expensive due to multiple render calls, but offers higher quality graphics.
   *
   * #### Merged Mode
   *
   * -   **Description:** Compiles all layer frames into a single frame before rendering.
   * -   **Behavior:** Characters cannot overlap as all layers are combined into one frame.
   * -   **Performance:** Faster rendering compared to stacked mode due to the compilation of all frames. Additionally, identifies and skips rendering frames that are identical to the currently drawn frame, saving processing time when the screen is static. Due to the nature of this rendering mode, some graphical issues can occur, and it should only be used on lower-end devices.
   */
  constructor(e) {
    /**
     * Run the onStartup method of any object.
     * @param {Object} object The object whose method should be run.
     * @param  {...any} passthrough The data to pass through to that method.
     */
    m(this, "__runOnStartup", (e, ...t) => e.onStartup && e.onStartup(...t));
    /**
     * Run the onTick method of any object.
     * @param {Object} object The object whose method should be run.
     * @param  {...any} passthrough The data to pass through to that method.
     */
    m(this, "__runOnTick", (e, ...t) => e.onTick && e.onTick(this, ...t));
    /**
     * Run the onLoad method of any object.
     * @param {Object} object The object whose method should be run.
     * @param  {...any} passthrough The data to pass through to that method.
     */
    m(this, "__runOnLoad", (e, ...t) => e.onLoad && e.onLoad(...t));
    this.config = e, this.validateConfig(e), this.audioManager = new _e(this), this.renderer = new Y(this), this.running = !1, this.initialized = !1, this.paused = !1;
  }
  get webGLSupported() {
    try {
      const e = document.createElement("canvas");
      return !!(window.WebGLRenderingContext && (e.getContext("webgl") || e.getContext("experimental-webgl")));
    } catch (e) {
      return !1;
    }
  }
  /**
   * Validates a renderer configuration file and throws an error if it is invalid.
   * @param {Object} config The config object to validate.
   */
  validateConfig(e) {
    if (!M(e))
      throw new TypeError(
        "Expected a plain object for Runtime constructor config parameter."
      );
    if (!e.renderer)
      throw new Error("No 'renderer' config provided to config object.");
  }
  /**
   * Get the time since the game was initialized, in milliseconds.
   */
  get walltime() {
    return this.initialized ? performance.now() - this.running : 0;
  }
  get dt() {
    return this.__dtm / 1e3;
  }
  /**
   * Get the current frames-per-second value.
   */
  get fps() {
    return this.initialized ? 1e3 / this.__dtm : 0;
  }
  /**
   * Code that runs when the project starts.
   */
  __onStartup() {
    this.start = performance.now(), this.__lastFrame = 0;
  }
  /**
   * Code that runs on every frame.
   */
  __onTick(e) {
    this.running && (this.__dtm = e - this.__lastFrame, this.__lastFrame = e, this.scene && this.scene.__onTick(), requestAnimationFrame((t) => this.__onTick(t)));
  }
  /**
   * Load a scene into the runtime. This will replace all `GameObject` and `Layer` instances.
   * @param {Scene} scene The scene to load.
   */
  loadScene(e) {
    if (!this.running)
      throw new Error(
        `A scene loading attempt was made, but the Runtime's "start" method has not yet been called.`
      );
    if (!(e instanceof H))
      throw new Error('Provided scene is not a "Scene" object');
    this.scene && this.scene.__unLoad(), this.scene = e;
  }
  /**
   * Start the game loop.
   * @param {function} onInitialized An optional method to run when the runtime has been initialized.
   */
  start(e) {
    this.running = !0, this.initialized || (this.__onStartup(), this.initialized = !0, e && typeof e == "function" && e(this)), requestAnimationFrame((t) => this.__onTick(t));
  }
}
const ke = `
self.onmessage = function ({ data: { data: frame, characterSize: [cW, cH], width, height, fontSize, lastFrame } }) {
	const canvas = new OffscreenCanvas(cW * width, cH * height);
	const ctx = canvas.getContext('2d');
	ctx.textAlign = "left";
	ctx.textBaseline = "top";

	for (let x = 0; x < width; x++)
		for (let y = 0; y < height; y++) {
			const index = y * width + x;

			const data = frame[index];

			if (!data) continue;

			const { value, color, fontWeight, backgroundColor } = data;

			if (backgroundColor) {
				ctx.beginPath();

				ctx.fillStyle = backgroundColor;

				ctx.fillRect(
					x * cW,
					y * cH,
					cW + Math.max(1 / width, 1),
					cH
				);

				ctx.closePath();
			}

			ctx.beginPath();

			ctx.font = \`\${
				fontWeight || "normal"
			} \${fontSize} monospace\`;

			ctx.fillStyle = color || "#FFFFFF";

			ctx.fillText(value, x * cW, y * cH);

			ctx.closePath();
		}

	self.postMessage({ bitmap: canvas.transferToImageBitmap(), lastFrame });
};
`;
class Y {
  /**
   * Handles rendering the game using **2D Context**.
   * @param {Runtime} runtime The current `Runtime` instance.
   */
  constructor(e) {
    /**
     * Determine the frame index of a pixel coordinate.
     * @param {number} x The x-value of the coordinate.
     * @param {number} y The y-value of the coordinate.
     * @returns {number} The index of that coordinate in a frame.
     */
    m(this, "coordinatesToIndex", (e, t) => t * this.width + e);
    /**
     * Convert a frame index into x and y coordinates.
     * @param {number} index The frame index.
     * @returns {Array<Number>} A coordinate array.
     */
    m(this, "indexToCoordinates", (e) => [
      e % this.width,
      Math.floor(e / this.width)
    ]);
    if (this.runtime = e, this.config = this.runtime.config && this.runtime.config.renderer, Y.validateConfig(this.config), !this.config)
      throw new Error("No config object provided to renderer.");
    if (this.__onCreated(), this.useWebWorkers = this.config.hasOwnProperty("useWebWorkers") ? !!this.config.useWebWorkers : !0, !window.Worker && this.useWebWorkers)
      throw new Error("This environment does not support webworkers.");
    this.__createWorkerInterface();
  }
  /**
   * Get the display's character width.
   */
  get width() {
    return this.config.resolution[0];
  }
  /**
   * Get the display's character height.
   */
  get height() {
    return this.config.resolution[1];
  }
  /**
   * Validates a renderer configuration file and throws an error if it is invalid.
   * @param {Object} config The config object to validate.
   */
  static validateConfig(e) {
    if (!e.resolution)
      throw new Error(
        "No resolution array defined in renderer config. [width, height]"
      );
    if (e.resolution.length !== 2 || typeof e.resolution[0] != "number" || typeof e.resolution[1] != "number")
      throw new Error(
        "Resolution array must be in format: [width (number), height (number)]"
      );
    if (e.resolution[0] < 5 || e.resolution[1] < 5)
      throw new Error("Resolution cannot be smaller than 5x5.");
    if (e.fontSize && typeof e.fontSize != "string")
      throw new Error(
        "Invalid fontSize parameter provided to renderer config. Must be of type 'string'"
      );
    if (e.scaling) {
      const t = ["off", "letterbox"];
      if (!t.includes(e.scaling))
        throw new Error(
          `Invalid scaling value provided, must be one of: ${S(
            t
          )}`
        );
    }
    if (e.renderMode) {
      const t = ["stacked", "merged"];
      if (!t.includes(e.renderMode))
        throw new Error(
          `Provided render mode is invalid. Must be of type: ${S(
            t
          )}`
        );
    }
    if (!e.canvas)
      throw new Error(
        'No "canvas" value provided to Renderer configuration.'
      );
    if (typeof e.canvas == "string") {
      if (!document.querySelector(e.canvas))
        throw new Error(
          `No canvas element found in DOM with query selector "${e.canvas}"`
        );
    } else if (e.canvas instanceof Element) {
      if (e.canvas.tagName.toLowerCase() !== "canvas")
        throw new Error(
          'Renderer config provided HTML element for "canvas" field, but the element is not a canvas.'
        );
    } else
      throw new Error(
        'Invalid "canvas" configuration provided to Renderer config. Must be a canvas element or query selector string that points to a canvas.'
      );
  }
  /**
   * Initialize the display.
   */
  __intializeDisplay() {
    this.drawing = !1, this.hasDrawn = !1;
    const { fontSize: e, canvas: t, forceParentStyles: r = !0 } = this.config;
    typeof t == "string" ? this.element = document.querySelector(t) : t instanceof Element && t.tagName.toLowerCase() === "canvas" && (this.element = t), r && (this.element.parentElement.style = `
			width: 100vw;
			height: 100vh;
			overflow: hidden;
			background-color: black;
			padding: 0;
			margin: 0;
			box-sizing: border-box;
			position: relative;
		`), this.element.style = `
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translateX(-50%) translateY(-50%);

			box-sizing: border-box;
			padding: 0;
			margin: 0;

			width: 100%;
			height: 100%;

			background-color: black;
		`, this.ctx = this.element.getContext("2d");
    const { ctx: i } = this;
    i.canvas.width = window.innerWidth, i.canvas.height = window.innerHeight, i.canvas.style.width = `${window.innerWidth}px`, i.canvas.style.height = `${window.innerHeight}px`, i.font = `${e} monospace`;
    const {
      width: n,
      fontBoundingBoxAscent: s,
      fontBoundingBoxDescent: o
    } = this.ctx.measureText("█"), h = s + o;
    this.characterSize = [n, h];
    const [l, a] = [
      n * this.width,
      h * this.height
    ];
    i.canvas.width = l, i.canvas.height = a, i.canvas.style.width = `${l}px`, i.canvas.style.height = `${a}px`;
  }
  /**
   * Rescale the display to fit the screen.
   */
  __rescaleDisplay() {
    const {
      element: e,
      config: { scaling: t }
    } = this;
    if (!t || t === "off") {
      e.style.transform = "translateX(-50%) translateY(-50%)";
      return;
    }
    e.style.transform = "translateX(-50%) translateY(-50%) scale(1)";
    const { width: r, height: i } = e.parentElement.getBoundingClientRect(), { width: n, height: s } = e.getBoundingClientRect(), [o, h] = [
      r / n,
      i / s
    ], l = Math.min(o, h);
    e.style.transform = `translateX(-50%) translateY(-50%) scale(${l})`;
  }
  /**
   * Clear the screen;
   */
  clearDisplay() {
    const {
      ctx: e,
      ctx: {
        canvas: { width: t, height: r }
      }
    } = this;
    e.beginPath(), e.clearRect(0, 0, t, r), e.closePath();
  }
  /**
   * Create interfaces for each web worker.
   */
  __createWorkerInterface() {
    this.webWorkers = {
      drawFrame: new Worker(
        URL.createObjectURL(
          new Blob([ke], {
            type: "application/javascript"
          })
        ),
        {
          type: "module"
        }
      )
    }, this.webWorkers.drawFrame.onmessage = ({
      data: { bitmap: e, lastFrame: t }
    }) => {
      this.buffer.push(e), t && this.__drawBuffer();
    };
  }
  /**
   * Draw an array of `ImageData` to the display. This data would be generated by the web worker.
   */
  __drawBuffer() {
    this.clearDisplay();
    for (const e of this.buffer)
      this.ctx.drawImage(e, 0, 0);
    this.drawing = !1;
  }
  /**
   * Draw several frames to the screen.
   * @param {Array<Frame>} frames The frames to draw.
   */
  drawFrames(e) {
    if (!this.drawing) {
      this.hasDrawn || (this.hasDrawn = !0), this.drawing = !0, this.useWebWorkers ? this.buffer = [] : this.clearDisplay();
      for (const t of e) {
        if (!(t instanceof B))
          throw new Error(
            "Provided frame object is not an instance of the Frame constructor."
          );
        if (this.useWebWorkers) {
          const {
            characterSize: r,
            width: i,
            height: n,
            config: { fontSize: s }
          } = this;
          this.webWorkers.drawFrame.postMessage({
            data: t.data,
            characterSize: r,
            width: i,
            height: n,
            fontSize: s,
            lastFrame: e.indexOf(t) === e.length - 1
          });
        } else {
          const {
            config: { fontSize: r = "32px" },
            characterSize: [i, n],
            ctx: s,
            width: o
          } = this;
          s.textAlign = "left", s.textBaseline = "top";
          for (let h = 0; h < this.width; h++)
            for (let l = 0; l < this.height; l++) {
              const a = l * this.width + h, d = t.data[a];
              if (!d || !(d instanceof y)) continue;
              const { value: u, color: f, fontWeight: _, backgroundColor: b } = d;
              b && (s.beginPath(), s.fillStyle = b, s.fillRect(
                h * i,
                l * n,
                i + Math.max(1 / o, 1),
                n
              ), s.closePath()), s.beginPath(), s.font = `${_ || "normal"} ${r} monospace`, s.fillStyle = f || "#FFFFFF", s.fillText(u, h * i, l * n), s.closePath();
            }
        }
      }
      this.useWebWorkers || (this.drawing = !1);
    }
  }
  /**
   * Compile several frames. Last frame provided on top.
   * @param  {...Frame} frames The frames to compile.
   * @returns {Frame} The compiled frames.
   */
  compileFrames(...e) {
    let t = [];
    for (const r of e) {
      const { data: i } = r;
      i.forEach((n, s) => {
        n && (t[s] = n);
      });
    }
    return new B(t);
  }
  /**
   * Code that runs when the render is created.
   */
  __onCreated() {
    this.__intializeDisplay(), this.__rescaleDisplay(), window.addEventListener("resize", () => this.__rescaleDisplay());
  }
}
class N extends ee {
  /**
   * A core object that modifies the behavior of a GameObject. Behaviors need an `onTick` method that will run every frame right before their `GameObject`'s `onTick`.
   * @param {GameObject} gameObject The game object to append this behavior to.
   * @param {boolean} enabledByDefault Whether the Behavior starts out enabled. Default: `true`.
   */
  constructor(e, t = !0) {
    super(e.scene), this.gameObject = e, e.behaviors.push(this), this.enabled = t;
  }
}
const $ = {
  line: [
    ["┌", "─", "┐"],
    ["│", null, "│"],
    ["└", "─", "┘"]
  ],
  double: [
    ["╔", "═", "╗"],
    ["║", null, "║"],
    ["╚", "═", "╝"]
  ]
};
class K extends A {
  /**
   * A box that can be rendered on screen.
   * @param {Scene} scene The scene this Object is a part of.
   * @param {Object} config The `Box`'s config object.
   * @param {number} config.x This `Box` object's x-coordinate.
   * @param {number} config.y This `Box` object's y-coordinate.
   * @param {number} config.width This `Box` object's width.
   * @param {number} config.height This `Box` object's height.
   * @param {string} config.color Option Box color.
   * @param {string} config.backgroundColor Optional background color.
   * @param {string} config.style The box line style. `"line" || "double"`
   * @param {string} config.layer The label of the layer to start the `Box` on.
   */
  constructor(e, t) {
    if (!M(t))
      throw new TypeError(
        "Expected a plain object for Box constructor config parameter."
      );
    const {
      x: r,
      y: i,
      width: n,
      height: s,
      color: o = "#ffffff",
      backgroundColor: h,
      style: l = "double",
      layer: a
    } = t;
    if (super(e, r, i, a), this.__rawWidth = n, this.__rawHeight = s, this.color = o, this.backgroundColor = h, !Object.keys($).includes(l))
      throw new Error(
        `Invalid box style "${l}" provided. Must be one of: ${S(
          Object.keys($)
        )}`
      );
    this.style = l;
  }
  get width() {
    return Math.round(this.__rawWidth);
  }
  set width(e) {
    if (typeof e != "number")
      throw new Error("Box width value must be of type 'number'.");
    this.__rawWidth = e;
  }
  get height() {
    return Math.round(this.__rawHeight);
  }
  set height(e) {
    if (typeof e != "number")
      throw new Error("Box height value must be of type 'number'.");
    this.__rawHeight = e;
  }
  get renderable() {
    const { width: e, height: t, color: r, backgroundColor: i, style: n } = this;
    return K.asPixelMesh(e, t, r, i, n);
  }
  set renderable(e) {
  }
  /**
   * Get just the renderable `PixelMesh` portion of a `Box` instance.
   * @param {number} width This `Box` object's width.
   * @param {number} height This `Box` object's height.
   * @param {string} color Option Box color.
   * @param {string} backgroundColor Optional background color.
   * @param {string} style The box line style. `"line" || "double"`
   * @returns {PixelMesh} The generated `PixelMesh`.
   */
  static asPixelMesh(e, t, r, i, n) {
    const s = $[n], o = [];
    for (let h = 0; h < t; h++) {
      const l = [];
      for (let a = 0; a < e; a++) {
        let d = 0, u = 0;
        a === e - 1 ? d = 2 : a > 0 && (d = 1), h === t - 1 ? u = 2 : h > 0 && (u = 1);
        let f = s[u][d];
        l.push(
          f && new y({
            value: f,
            color: r,
            backgroundColor: i,
            solid: !1
          })
        );
      }
      o.push(l);
    }
    return new g({ data: o });
  }
}
class D {
  get renderable() {
    return y.fromString(" ");
  }
  get index() {
    return this.menu.items.indexOf(this);
  }
  onLoad() {
  }
  onKeyDown() {
  }
  onClick() {
  }
  onGamepadButton() {
  }
  onMouseMove() {
  }
}
class Me extends D {
  /**
   * A string of text that triggers an event when clicked.
   * @param {Object} config The `Button`'s config object.
   * @param {string} config.label The `Button`'s display label.
   * @param {function} config.callback The function to call when this item is clicked/activated. This callback is passed the `Menu` instance as an argument.
   * @param {boolean} config.wrap Whether or not to wrap the text if it overflows the container. Will break words. Default `false`.
   */
  constructor(e) {
    super();
    const { label: t, callback: r, wrap: i } = e;
    if (typeof t != "string")
      throw new TypeError(
        "Menu.Button config.label property must be a string."
      );
    this.label = t && t.trim(), this.callback = r, this.wrap = !!i;
  }
  onKeyDown(e) {
    e.keys.enter && this.callback(this.menu);
  }
  onGamepadButton(e) {
    e.buttons.a && this.callback(this.menu);
  }
  onClick() {
    this.callback(this.menu);
  }
  get renderable() {
    const {
      menu: {
        index: e,
        availableContentSpace: [t]
      },
      index: r,
      label: i,
      wrap: n
    } = this, s = g.fromString(
      n ? Q(i, t, !0) : i.slice(0, t)
    );
    return e === r ? s.setColor("white") : s.setColor("grey"), s;
  }
}
class Ce extends D {
  /**
   * A slider that allows value selection.
   * @param {Object} config The `Slider`'s config object.
   * @param {string} config.label An optional `Slider` display label.
   * @param {boolean} config.showValue Whether to show the value of the `Slider` after it. Default: `false`.
   * @param {boolean} config.showPercentage Whether to show the value (in percentage format) of the `Slider` after it. Default: `true`.
   * @param {number} config.value The starting value of the `Slider`.
   * @param {number} config.min The minimum value for the `Slider`.
   * @param {number} config.max The maximum value for the `Slider`.
   * @param {number} config.step The amount the value will change by each input.
   * @param {function} config.onChange The function to call when the value of this `Slider` changes.
   * @param {function} config.callback The function to call when "enter" is pressed on the `Slider`. This callback is passed the current `Menu.Slider` value as an argument.
   */
  constructor(e) {
    super();
    const {
      label: t,
      value: r = 0,
      min: i = 0,
      max: n = 100,
      step: s = 1,
      onChange: o,
      callback: h,
      showValue: l = !0,
      showPercentage: a = !0
    } = e;
    if (t && typeof t != "string")
      throw new TypeError(
        "Menu.Button config.label property must be a string."
      );
    if (typeof r != "number")
      throw new TypeError(
        "Menu.Slider config.value property must be a number."
      );
    if (typeof i != "number")
      throw new TypeError(
        "Menu.Slider config.min property must be a number."
      );
    if (typeof n != "number")
      throw new TypeError(
        "Menu.Slider max.value property must be a number."
      );
    if (typeof s != "number")
      throw new TypeError(
        "Menu.Slider config.step property must be a number."
      );
    if (i > n)
      throw new Error(
        "Menu.Slider config.min cannot be greater than config.max."
      );
    this.showValue = !!l, this.showPercentage = !!a, this.label = t && t.trim(), this.min = i, this.max = n, this.value = r, this.step = s, this.callback = h, this.onChange = o;
  }
  /**
   * Get the value of this `Slider`.
   */
  get value() {
    return this.__rawValue;
  }
  set value(e) {
    e = L(e, this.min, this.max);
    let t = e !== this.__rawValue;
    this.__rawValue = e, this.onChange && t && this.onChange(this.value);
  }
  snapToStep(e) {
    return Math.round((e - this.min) / this.step) * this.step + this.min;
  }
  onKeyDown(e) {
    const {
      keys: { enter: t, left: r, right: i }
    } = e;
    t && this.callback(this.value), r && (this.value -= this.step), i && (this.value += this.step);
  }
  onGamepadButton(e) {
    const {
      buttons: { a: t, left: r, right: i }
    } = e;
    t && this.callback(this.value), r && (this.value -= this.step), i && (this.value += this.step);
  }
  __positionByMouse(e) {
    let [t] = e.onLayer[this.menu.layerLabel];
    t -= P.borderWidth + P.horizontalSpacing, this.label && (t -= this.label.length + 0.5);
    const r = this.snapToStep(
      L(t / this.sliderWidth * this.max, this.min, this.max)
    );
    this.value = r;
  }
  onClick(e) {
    this.__positionByMouse(e), this.callback(this.value);
  }
  onMouseMove(e) {
    e.buttons.left && this.__positionByMouse(e);
  }
  /**
   * Get the width of the slider portion of the renderable.
   */
  get sliderWidth() {
    const e = (this.max - this.min) / this.step + 1;
    return e <= 10 ? Math.round(e) : L(
      e,
      10,
      this.menu.runtime.renderer.width / 4
    );
  }
  get renderable() {
    const {
      menu: { index: e },
      index: t,
      value: r,
      min: i,
      max: n,
      step: s,
      label: o,
      showValue: h,
      showPercentage: l,
      sliderWidth: a
    } = this, d = e === t;
    let u = [];
    if (o) {
      const v = g.fromString(this.label + " ");
      d || v.setColor("grey"), u.push(v.data[0]);
    }
    const f = a - 1, _ = Math.floor(
      (r - i) / (n - i) * f
    ), b = new y({
      value: "─",
      color: d ? "white" : "grey"
    }), [E, k] = [
      new Array(_).fill(b),
      new Array(f - _).fill(b)
    ], O = new g({
      data: [
        ...E,
        new y({ value: "█", color: d ? "green" : "grey" }),
        ...k
      ]
    });
    if (u[0] = [...u[0], ...O.data], h) {
      const v = g.fromString(
        " " + String(r).padEnd(
          Math.max(
            String(n - n / s + (s < 1 ? s : 0)).length - 1,
            1
          ),
          " "
        )
      );
      d || v.setColor("grey"), u[0].push(...v.data[0]);
    }
    if (h && l && u[0].push(
      null,
      new y({ value: "-", color: d ? "white" : "grey" })
    ), l) {
      const v = g.fromString(
        (" " + Math.round(r / n * 100) + "%").padEnd(5, " ")
      );
      d || v.setColor("grey"), u[0].push(...v.data[0]);
    }
    return new g({ data: u });
  }
}
class Oe extends D {
  /**
   * A checkbox that can be toggled.
   * @param {Object} config The `Toggle`'s config object.
   * @param {string} config.label The `Toggle`'s display label.
   * @param {boolean} config.checked The initial status of the `Toggle`. Default: `false`.
   * @param {boolean} config.prepend Whether to put the checkbox icon at the start or end of the label. Default: `true`.
   * @param {function} config.callback The function to call when this item is toggled. This callback is passed the current `checked` state as an argument.
   */
  constructor(e) {
    super();
    const { label: t, callback: r, checked: i = !1, prepend: n = !0 } = e;
    if (typeof t != "string")
      throw new TypeError(
        "Menu.Button config.label property must be a string."
      );
    this.label = t && t.trim(), this.prepend = !!n, this.checked = !!i, this.callback = r;
  }
  get checked() {
    return this.__rawChecked;
  }
  set checked(e) {
    this.__rawChecked = !!e;
  }
  onKeyDown(e) {
    e.keys.enter && (this.checked = !this.checked), this.callback(this.checked);
  }
  onClick() {
    this.checked = !this.checked, this.callback(this.checked);
  }
  onGamepadButton(e) {
    e.buttons.a && (this.checked = !this.checked), this.callback(this.checked);
  }
  get renderable() {
    const {
      menu: { index: e },
      index: t,
      checked: r,
      prepend: i
    } = this, n = r ? "☑" : "☐", s = g.fromString(
      `${i ? n + " " : ""}${this.label}${i ? "" : " " + n}`
    );
    return e === t ? s.setColor("white") : s.setColor("grey"), s;
  }
}
const w = class w extends A {
  /**
   * A menu of various items that can be rendered on screen.
   * @param {Scene} scene The scene this Object is a part of.
   * @param {Object} config The `Menu`'s config object.
   * @param {number} config.x This `Menu` object's x-coordinate.
   * @param {number} config.y This `Menu` object's y-coordinate.
   * @param {Object} config.items An array of `Menu.Item` instances. You can extend the `Menu.Item` class to make your own items.
   * @param {string} config.title Optional menu title.
   * @param {boolean} config.alignCenter Whether or not to align the content to the center of the menu. Default `true`.
   * @param {boolean} config.border Whether or not to create a border around the menu. Default `true`.
   * @param {string} config.layer The label of the layer to start the `Menu` on.
   * @param {boolean} config.autoFocus Whether to automatically focus on the `Menu` after it has been instantiated. Default `true`.
   * @param {boolean} config.maintainFocus Forces the menu to stay focused. Default `true`.
   * @param {boolean} config.deleteOnBlur Whether to delete the menu when it becomes unfocused. Default `false`. **NOTE:** If `config.autoFocus` is set to false, the `Menu` will be deleted immediately!
   * @param {number} config.gamepad An optional number indicating the gamepad (0-based index) this menu should accept input from. Set to `-1` to accept input from all gamepads.
   */
  constructor(e, t) {
    if (!M(t))
      throw new TypeError(
        "Expected a plain object for Menu constructor config parameter."
      );
    const {
      x: r,
      y: i,
      title: n,
      items: s = [],
      layer: o,
      autoFocus: h = !0,
      deleteOnBlur: l = !1,
      maintainFocus: a = !0,
      gamepad: d,
      alignCenter: u = !0,
      border: f = !0
    } = t;
    if (super(e, r, i, o), this.deleteOnBlur = !!l, this.maintainFocus = !!a, this.alignCenter = !!u, this.border = !!f, !(s instanceof Array))
      throw new TypeError(
        '"Menu" constructor config.items object should be an array of "Menu.Item" instances.'
      );
    if (this.items = s, this.__rawIndex = 0, this.focused = !!h, n && typeof n != "string")
      throw new Error(
        `Provided menu title "${n}" is not of type "string".`
      );
    this.title = n, this.gamepad = d, e.inputManager.addEventListener(
      "keydown",
      this.__onKeyDown.bind(this)
    ), e.inputManager.addEventListener(
      "mousemove",
      this.__onMouseMove.bind(this)
    ), e.inputManager.addEventListener("click", this.__onClick.bind(this)), this.__inputMode = "keyboard";
  }
  /**
   * Get the menu items instantiated in this `Menu`.
   */
  get items() {
    return this.__rawItems;
  }
  /**
   * Set the menu items instantiated in this `Menu`.
   */
  set items(e) {
    for (const t of e) {
      if (!(t instanceof w.Item))
        throw new TypeError(
          'Each object in the Menu.items array must be an instance of "Menu.Item".'
        );
      t.menu = this, this.scene.runtime.__runOnLoad(t);
    }
    this.__rawItems = e;
  }
  /**
   * Get the index of the active gamepad.
   */
  get gamepad() {
    return this.__rawGamepad;
  }
  /**
   * Set the index of the gamepad whose inputs should be listened to.
   */
  set gamepad(e) {
    if (typeof e != "number") {
      this.__rawGamepad = void 0, this.scene.inputManager.removeEventListener(
        "gamepadbuttonpressed",
        this.__handleGamepadButtonPressed.bind(this)
      );
      return;
    }
    if (typeof e != "number" || !Number.isInteger(e) || e < -1 || e > 3)
      throw new Error(
        "Menu gamepad property should be an integer at or between -1 and 3."
      );
    this.scene.inputManager.addEventListener(
      "gamepadbuttonpressed",
      this.__handleGamepadButtonPressed.bind(this)
    ), this.__rawGamepad = e;
  }
  /**
   * Get the current active index in the menu.
   */
  get index() {
    return this.__rawIndex;
  }
  /**
   * Set the current active index in the menu.
   */
  set index(e) {
    if (typeof e != "number" || !Number.isInteger(e))
      throw new TypeError("Menu index must be an integer.");
    const t = this.items.length - 1;
    e < 0 && (e = t), e > t && (e = 0), this.__rawIndex = e;
  }
  /**
   * Get the screen-space available to the content of the menu.
   * Return format: `[width, height]`
   */
  get availableContentSpace() {
    const { width: e, height: t } = this.scene.runtime.renderer;
    return [
      e - w.horizontalSpacing * 2 - w.borderWidth * 2,
      t
    ];
  }
  /**
   * Get the actual current width of the `Menu`.
   */
  get width() {
    const { items: e, title: t } = this, [r] = this.availableContentSpace;
    let i = 0;
    for (const { renderable: s } of e) {
      if (!s) continue;
      const o = s instanceof g ? s.width : 1;
      o > i && (i = o);
    }
    const n = t ? t.length : 0;
    return Math.min(r, Math.max(i, n)) + (this.border ? w.horizontalSpacing * 2 : 0) + (this.border ? w.borderWidth * 2 : 0);
  }
  /**
   * Get the actual current height of the `Menu`.
   */
  get height() {
    let e = 0;
    for (const { renderable: t } of this.items)
      t && (t instanceof g ? e += t.height : e++);
    return Math.round(
      e + (this.border ? w.borderWidth * 2 : 0)
    );
  }
  /**
   * Get the screen-space currently used by the content of the menu.
   * Return format: `[width, height]`
   */
  get currentContentSpace() {
    const { width: e, height: t } = this;
    return this.border ? [e - w.borderWidth * 2, t - w.borderWidth * 2] : [e, t];
  }
  /**
   * Get the screen-space available to the content of the menu.
   * Return format: `[width, height]`
   */
  get availableContentSpace() {
    const { width: e, height: t } = this.scene.runtime.renderer;
    return [
      e - w.horizontalSpacing * 2 - w.borderWidth * 2,
      t
    ];
  }
  /**
   * Get the item at the current menu index.
   */
  get currentItem() {
    return this.items[this.index];
  }
  /**
   * Unfocus the menu.
   */
  blur() {
    this.maintainFocus || (this.focused = !1, this.__rawIndex = -1, this.deleteOnBlur && this.delete());
  }
  /**
   * Get an item at a y-coordinate relative to the menu.
   * @param {number} y The y-coordinate to check.
   * @returns {Menu.Item|undefined} The item at that coordinate, or `undefined` if there is no item at the coordinate.
   */
  itemAtCoordinate(e) {
    let t = 0;
    for (const r of this.items) {
      const { renderable: i } = r, n = i instanceof g ? i.height : 1, s = t;
      if (e >= s && e <= s + n) return r;
      t += n;
    }
  }
  /**
   * Handle a key being pressed.
   * @param {Event} event The event that triggered this method.
   */
  __onKeyDown(e) {
    if (!this.isOnScreen || !this.visible || !this.focused) return;
    this.__inputMode = "keyboard";
    const {
      keys: { up: t, down: r, escape: i }
    } = e;
    if (i) return this.blur();
    this.focus = !0, r ? this.index++ : t ? this.index-- : this.currentItem && this.currentItem.onKeyDown(e);
  }
  /**
   * Handle the mouse being moved.
   * @param {Event} event The event that triggered this method.
   */
  __onMouseMove(e) {
    if (!this.isOnScreen || !this.visible) return;
    const { onLayer: t } = e, [r, i] = t[this.layer.label], [n, s] = [r - this.x, i - this.y];
    n >= 0 && n <= this.width && s >= 0 && s < this.height && (this.__inputMode = "mouse"), this.__determineMouseOverInput(e), this.__inputMode === "mouse" && this.currentItem && this.currentItem.onMouseMove(e);
  }
  __determineMouseOverInput(e) {
    if (this.__inputMode !== "mouse") return;
    const { onLayer: t } = e, [r, i] = t[this.layer.label], [n, s] = [
      r - this.x,
      i - this.y + (this.title || this.border ? 0 : 1)
    ], o = this.items.indexOf(this.itemAtCoordinate(s));
    o >= 0 && o < this.items.length && n >= 0 && n <= this.width && this.focused ? this.index = o : this.__rawIndex = -1;
  }
  /**
   * Handle the mouse being clicked.
   * @param {event} event The event that triggered this method.
   */
  __onClick(e) {
    if (!(!this.isOnScreen || !this.visible)) {
      if (this.focused && !e.targets.includes(this.id))
        return this.blur();
      e.targets.includes(this.id) && (this.focused = !0, this.__inputMode = "mouse"), this.__inputMode === "mouse" && (this.__determineMouseOverInput(e), this.currentItem && this.currentItem.onClick(e));
    }
  }
  __handleGamepadButtonPressed(e) {
    if (this.gamepad !== e.index && this.gamepad !== -1) return;
    const {
      buttons: { up: t, down: r }
    } = e;
    t ? this.index-- : r ? this.index++ : this.currentItem && (this.__lastGamepadClick = this.index, this.currentItem.onGamepadButton(e));
  }
  get renderable() {
    const {
      title: e,
      items: t,
      width: r,
      height: i,
      currentContentSpace: [n]
    } = this;
    let s = [];
    if (this.border) {
      const {
        data: o,
        width: h,
        height: l
      } = K.asPixelMesh(
        r,
        i,
        this.focused ? "white" : "grey",
        void 0,
        "double"
      );
      s = o;
    }
    if (t) {
      let o = this.border || this.title ? w.borderWidth : 0;
      for (const { renderable: h } of t)
        if (h)
          if (h instanceof g) {
            if (h.width > this.availableContentSpace[0])
              throw new Error(
                `Menu.Item renderable.width is greater than the Menu's maximum content width of ${this.availableContentSpace[0]}.`
              );
            h.data.forEach((l) => {
              s[o] || (s[o] = this.border ? [] : new Array(n).fill(null)), s[o].splice(
                Math.round(
                  this.alignCenter ? n / 2 - l.length / 2 : 0
                ) + (this.border ? w.horizontalSpacing : 0),
                l.length,
                ...l
              ), o++;
            });
          } else
            s[o] || (s[o] = []), s[o].splice(
              n % 2 === 0 && this.alignCenter ? (this.border ? w.horizontalSpacing : 0) + (this.border ? w.borderWidth : 0) : Math.round(n / 2),
              1,
              h
            ), o++;
    }
    if (e) {
      const o = g.fromString(
        e.slice(0, this.availableContentSpace[0])
      );
      this.border || o.setFontWeight(800);
      const {
        data: [h]
      } = o, l = this.border || this.alignCenter ? Math.floor((n - h.length) / 2) : 0;
      for (let a = 0; a < h.length; a++)
        s[0] || (s[0] = []), s[0][a + l + (this.border ? w.horizontalSpacing : 0)] = h[a];
    }
    return new g({ data: s });
  }
  set renderable(e) {
  }
};
m(w, "Item", D), m(w, "Button", Me), m(w, "Slider", Ce), m(w, "Toggle", Oe), m(w, "horizontalSpacing", 1), m(w, "borderWidth", 1);
let P = w;
class U extends A {
  /**
   * A string of text that can be rendered on screen.
   * @param {Scene} scene The scene this Object is a part of.
   * @param {Object} config The `Text`'s config object.
   * @param {number} config.x This `Text` object's x-coordinate.
   * @param {number} config.y This `Text` object's y-coordinate.
   * @param {number} config.maxWidth The maximum width of the `Text`. Defaults to `Renderer.width`.
   * @param {string} config.value The text to display. (use `"\n"` for newlines)
   * @param {boolean} config.wrap Whether to wrap the text if it overflows the screen.
   * @param {string} config.color Option text color.
   * @param {string} config.backgroundColor Optional background color.
   * @param {string} config.fontWeight Optional font weight.
   * @param {string} config.layer The label of the layer to start the `Text` on.
   */
  constructor(e, t) {
    if (!M(t))
      throw new TypeError(
        "Expected a plain object for Text constructor config parameter."
      );
    const {
      x: r,
      y: i,
      value: n = "Hello, world!",
      wrap: s = !0,
      color: o = "#ffffff",
      backgroundColor: h,
      fontWeight: l = 400,
      maxWidth: a = e.runtime.renderer.width,
      layer: d
    } = t;
    if (super(e, r, i, d), a && (typeof a != "number" || !Number.isInteger(a) || a < 1))
      throw new TypeError(
        "Invalid config.maxWidth value provided to Text. Expected an integer greater than 0."
      );
    if (typeof n != "string")
      throw new Error(
        `Provided text value "${n}" is not of type "string".`
      );
    this.__rawValue = n, this.wrap = s, this.color = o, this.backgroundColor = h, this.fontWeight = l, this.maxWidth = a;
  }
  /**
   * Get the value of the text object.
   */
  get value() {
    return String(this.__rawValue);
  }
  /**
   * Set the value of the text object.
   */
  set value(e) {
    this.__rawValue = e;
  }
  get renderable() {
    const { wrap: e, value: t, maxWidth: r, color: i, backgroundColor: n, fontWeight: s } = this;
    return U.asPixelMesh(
      t,
      r,
      e,
      i,
      n,
      s
    );
  }
  /**
   * Get just the renderable `PixelMesh` portion of a `Text` instance.
   * @param {string} config.value The text to display. (use `"\n"` for newlines)
   * @param {number} config.maxWidth The maximum width of the `Text`. Defaults to `Renderer.width`.
   * @param {boolean} config.wrap Whether to wrap the text if it overflows the screen.
   * @param {string} config.color Option text color.
   * @param {string} config.backgroundColor Optional background color.
   * @param {string} config.fontWeight Optional font weight.
   * @returns {PixelMesh} The generated `PixelMesh`.
   */
  static asPixelMesh(e, t, r, i, n, s) {
    const o = e.split(`
`), h = [];
    for (const l of o)
      if (!r && l.length > t)
        h.push(
          l.substring(0, t).split("").map(
            (a) => new y({
              value: a,
              color: i,
              backgroundColor: n,
              fontWeight: s
            })
          )
        );
      else {
        let a = [], d = 0;
        for (const u of l) {
          if (d >= t)
            if (r)
              h.push(
                a.map(
                  (f) => new y({
                    value: f,
                    color: i,
                    backgroundColor: n,
                    fontWeight: s
                  })
                )
              ), a = [], d = 0;
            else
              break;
          a.push(u), d++;
        }
        a.length > 0 && h.push(
          a.map(
            (u) => new y({
              value: u,
              color: i,
              backgroundColor: n,
              fontWeight: s
            })
          )
        );
      }
    return new g({ data: h });
  }
  set renderable(e) {
  }
}
class Ae extends U {
  /**
   * A text input that can be rendered on screen.
   * @param {Scene} scene The scene this Object is a part of.
   * @param {Object} config The `TextInput`'s config object.
   * @param {number} config.x This `TextInput` object's x-coordinate.
   * @param {number} config.y This `TextInput` object's y-coordinate.
   * @param {number} config.maxWidth The maximum width of the `TextInput`. Defaults to `8`.
   * @param {string} config.value The text to display. (use `"\n"` for newlines)
   * @param {string} config.color Optional text color.
   * @param {string} config.activeColor Optional text color for active character.
   * @param {string} config.backgroundColor Optional background color.
   * @param {string} config.backgroundColorActive Optional background color for active key.
   * @param {string} config.fontWeight Optional font weight.
   * @param {string} config.autoFocus Automatically focus on element once it is instantiated.
   * @param {function} config.onChange Callback that runs when the input's value changes.
   * @param {function} config.onKeyDown Callback that runs when the input recieves a keypress.
   * @param {function} config.onFocus Callback that runs when focus on this input is gained.
   * @param {function} config.onBlur Callback that runs when focus on this input is lost.
   * @param {number} config.maxLength An optional maximum input length.
   * @param {string} config.layer The label of the layer to start the `TextInput` on.
   */
  constructor(e, t) {
    if (!M(t))
      throw new TypeError(
        "Expected a plain object for TextInput constructor config parameter."
      );
    t.wrap = !1, t.maxWidth || (t.maxWidth = 8), super(e, t);
    const {
      activeColor: r = "black",
      backgroundColor: i = "transparent",
      backgroundColorActive: n = "white",
      onChange: s,
      onKeyDown: o,
      onFocus: h,
      onBlur: l,
      maxLength: a
    } = t;
    if (r) {
      if (typeof r != "string")
        return new TypeError(
          "Expected a string for Text config.activeColor value."
        );
      this.activeColor = r;
    }
    if (i) {
      if (typeof i != "string")
        return new TypeError(
          "Expected a string for Text config.backgroundColor value."
        );
      this.backgroundColor = i;
    }
    if (n) {
      if (typeof n != "string")
        return new TypeError(
          "Expected a string for Text config.backgroundColorActive value."
        );
      this.backgroundColorActive = n;
    }
    if (s) {
      if (typeof s != "function")
        throw new TypeError(
          "Expected a function for TextInput config.onChange value."
        );
      this.onChange = s;
    }
    if (o) {
      if (typeof o != "function")
        throw new TypeError(
          "Expected a function for TextInput config.onKeyDown value."
        );
      this.onKeyDown = o;
    }
    if (h) {
      if (typeof h != "function")
        throw new TypeError(
          "Expected a function for TextInput config.onFocus value."
        );
      this.onFocus = h;
    }
    if (l) {
      if (typeof l != "function")
        throw new TypeError(
          "Expected a function for TextInput config.onBlur value."
        );
      this.onBlur = l;
    }
    if (a) {
      if (typeof a != "number" || !Number.isInteger(a) || a < 0)
        throw new TypeError(
          "Invalid config.maxLength value provided to TextInput. Expected an integer greater than or equal to 0."
        );
      this.maxLength = a;
    }
    this.scroll = 0, this.focused = t.autoFocus, this.caret = t.value ? t.value.length : 0, e.inputManager.watchObjectClick(this.id, this.__onClick.bind(this)), e.inputManager.addEventListener(
      "click",
      this.__onAnyClick.bind(this)
    ), e.inputManager.addEventListener(
      "keydown",
      this.__onKeyDown.bind(this)
    ), e.inputManager.addFocusable(this);
  }
  get focused() {
    return this.__rawFocused;
  }
  set focused(e) {
    this.__rawFocused = !!e, e ? this.onFocus && this.onFocus(this) : this.onBlur && this.onBlur(this);
  }
  /**
   * Listens to click events.
   */
  __onClick() {
    this.focused || (this.focused = !0, this.caret = this.value.length, this.__updateScrollPosition());
  }
  /**
   * Trigger when anything is clicked.
   */
  __onAnyClick(e) {
    e.targets.includes(this.id) || (this.focused = !1);
  }
  /**
   * Listen to other input events.
   */
  __onKeyDown(e) {
    const { caret: t } = this;
    if (!this.focused) return;
    const { key: r } = e, i = this.value;
    /^[\x20-\x7E]$/.test(r) && (typeof this.maxLength != "number" || this.value.length < this.maxLength) ? (this.value = this.value.slice(0, this.caret) + r + this.value.slice(this.caret), this.caret++) : r === "Backspace" ? (this.value = this.value.slice(0, t - 1) + this.value.slice(t), this.caret !== this.value.length && this.caret--) : r === "Delete" ? this.value = this.value.slice(0, t) + this.value.slice(t + 1) : r === "Tab" ? (this.value += "    ", this.caret += 4) : r === "Escape" ? this.focused = !1 : r === "ArrowLeft" ? this.caret-- : r === "ArrowRight" && this.caret++, this.__updateScrollPosition(), i !== this.value && this.onChange && this.onChange(x({ target: this }, e)), this.onKeyDown && this.onKeyDown(x({ target: this }, e));
  }
  /**
   * Update the position of this `TextInput`'s `scroll` property to properly scroll to the caret in the input.
   */
  __updateScrollPosition() {
    for (; this.caret < this.scroll; ) this.scroll--;
    for (; this.caret > this.scroll + this.maxWidth - 2; ) this.scroll++;
  }
  get caret() {
    return this.__rawCaret < 0 && (this.__rawCaret = 0), this.__rawCaret > this.value.length && (this.__rawCaret = this.value.length), this.__rawCaret;
  }
  set caret(e) {
    if (typeof e != "number" || !Number.isInteger(e))
      throw new TypeError("TextInput caret value should be an integer.");
    e < 0 && (e = 0), e > this.value.length && (e = this.value.length), this.__rawCaret = e;
  }
  get renderable() {
    const {
      value: e,
      fontWeight: t,
      maxWidth: r,
      caret: i,
      color: n,
      activeColor: s,
      backgroundColor: o,
      backgroundColorActive: h,
      focused: l
    } = this, a = [], d = e.length - r + 1;
    this.scroll > d && (this.scroll = d), this.scroll < 0 && (this.scroll = 0);
    const { scroll: u } = this, f = e.substring(u, u + r).padEnd(r, " ").split("");
    for (let _ = 0; _ < f.length; _++) {
      const b = f[_], E = _ + u === i && l;
      a.push(
        new y({
          value: b,
          color: E ? s : n,
          backgroundColor: E ? h : o,
          fontWeight: t
        })
      );
    }
    return new g({ data: [a] });
  }
}
class je extends N {
  /**
   * Scroll the camera to a `GameObject`.
   * @param {GameObject} gameObject The game object to append this behavior to.
   * @param {boolean} enabledByDefault Whether the Behavior starts out enabled. Default: `true`.
   */
  constructor(e, t = !0) {
    super(e, t);
  }
  onTick() {
    if (this.gameObject.paused) return;
    const {
      gameObject: {
        x: e,
        y: t,
        width: r,
        height: i,
        origin: [n, s]
      },
      scene: {
        camera: o,
        runtime: {
          renderer: { width: h, height: l }
        }
      }
    } = this;
    o.x = e - n + r / 2 - h / 2, o.y = t - s + i / 2 - l / 2;
  }
}
class te extends N {
  /**
   * Move a `GameObject` from a top-down perspective.
   * @param {GameObject} gameObject The game object to append this behavior to.
   * @param {boolean} enabledByDefault Whether the Behavior starts out enabled. Default: `true`.
   * @param {Object} config The configuration for this `TopDownMovement`.
   * @param {boolean} config.defaultControls Whether to automatically handle input using the arrow keys. Default: `true`.
   */
  constructor(t, r = !0, i = { defaultControls: !0 }) {
    super(t, r);
    /**
     * Attempt to move `GameObject` up.
     */
    m(this, "simulateControlUp", () => {
      if (this.gameObject.paused) return;
      const {
        gameObject: { x: t, y: r }
      } = this;
      this.__tryToMoveToPosition(t, r - 1);
    });
    /**
     * Attempt to move `GameObject` down.
     */
    m(this, "simulateControlDown", () => {
      if (this.gameObject.paused) return;
      const {
        gameObject: { x: t, y: r }
      } = this;
      this.__tryToMoveToPosition(t, r + 1);
    });
    /**
     * Attempt to move `GameObject` left.
     */
    m(this, "simulateControlLeft", () => {
      if (this.gameObject.paused) return;
      const {
        gameObject: { x: t, y: r }
      } = this;
      this.__tryToMoveToPosition(t - 1, r);
    });
    /**
     * Attempt to move `GameObject` right.
     */
    m(this, "simulateControlRight", () => {
      if (this.gameObject.paused) return;
      const {
        gameObject: { x: t, y: r }
      } = this;
      this.__tryToMoveToPosition(t + 1, r);
    });
    te.validateConfig(i);
    const { defaultControls: n = !0 } = i;
    n && this.scene.inputManager.addEventListener(
      "keydown",
      this.__handleKeyDown.bind(this)
    );
  }
  /**
   * Validates a TopDownMovement configuration object and throws an error if it is invalid.
   * @param {Object} config The config object to validate.
   */
  static validateConfig(t) {
    if (!t)
      throw new Error(
        'No configuration provided to "TopDownMovement" behavior.'
      );
  }
  __handleKeyDown(t) {
    if (this.gameObject.paused) return;
    const {
      keys: { up: r, down: i, left: n, right: s }
    } = t;
    r && this.simulateControlUp(), i && this.simulateControlDown(), n && this.simulateControlLeft(), s && this.simulateControlRight();
  }
  /**
   * Check if it is clear to move to a position, and then move there.
   * @param {number} x The x-coordinate to check.
   * @param {number} y The y-coordinate to check.
   */
  __tryToMoveToPosition(t, r) {
    if (this.gameObject.paused) return;
    const {
      gameObject: i,
      gameObject: {
        width: n,
        height: s,
        origin: [o, h]
      },
      scene: { layerManager: l }
    } = this;
    if (n <= 1 && s <= 1) {
      const b = l.solidAtPosition(t, r);
      (!b || b.gameObject === i) && (i.x = t, i.y = r);
      return;
    }
    let a = !0;
    const d = t > i.x, u = t < i.x, f = r > i.y, _ = r < i.y;
    if (d || u) {
      const b = i.y - h, E = b + s - 1;
      for (let k = b; k <= E; k++) {
        const O = d ? t + n - 1 - o : t - o, v = l.solidAtPosition(O, k);
        if (v && v.gameObject !== i) {
          a = !1;
          break;
        }
      }
    } else if (f || _) {
      const b = i.x - o, E = b + n - 1;
      for (let k = b; k <= E; k++) {
        const O = f ? r + s - 1 - h : r - h, v = l.solidAtPosition(k, O);
        if (v && v.gameObject !== i) {
          a = !1;
          break;
        }
      }
    }
    a && (i.x = t, i.y = r);
  }
  onTick() {
  }
}
class Be {
  /**
   * An animation frame. The `renderable` value of this Frame should return a `Pixel` or `PixelMesh` that will determine what is displayed on this frame.
   * @param {Pixel|PixelMesh} renderable The renderable item to display for this frame.
   * @param {number} duration The duration (in frames) of this frame. Example: a value of `2` will make this frame last twice as long as the rest.
   */
  constructor(e = y.fromString("#"), t) {
    if (!e || !(e instanceof y) && !(e instanceof g))
      throw new Error(
        `Invalid renderable provided to "AnimationFrame": ${e}. Must be of type "Pixel" or "PixelMesh".`
      );
    if (t && typeof t != "number")
      throw new Error(
        `Invalid duration provided to Frame: ${t}. Must be of type "number".`
      );
    this.duration = t, this.renderable = e;
  }
}
class V {
  /**
   * An animation. The `Animate` behavior operates on the data in this object.
   * @param {Object} config The configuration for this `Animation`.
   * @param {string} config.label This `Animation`'s label.
   * @param {Array<AnimationFrame>} config.animationFrames An array of this `Animation`'s frames.
   * @param {number} config.speed The speed at which this `Animation` should play. In frames per second.
   * @param {boolean} config.loop Whether or not this animation should loop infinitely or end after `config.repeatCount` iterations.
   * @param {number} config.repeatCount The number of times the `Animation` should repeat if `config.loop` is set to `false`.
   * @param {boolean} config.pingPong When `true`, the animation will switch directions once it reaches its end and loop back and forth from start to end.
   */
  constructor(e = {
    label: "Unnamed Animation",
    animationFrames,
    speed: 12,
    loop: !1,
    repeatCount: 1,
    pingPong: !1
  }) {
    V.validateConfig(e);
    const {
      label: t = "Unnamed Animation",
      animationFrames: r,
      speed: i = 12,
      loop: n = !1,
      repeatCount: s = 1,
      pingPong: o = !1
    } = e;
    this.label = t, this.animationFrames = r, this.speed = i, this.loop = n, this.repeatCount = s, this.pingPong = o;
  }
  /**
   * Validates a TopDownMovement configuration object and throws an error if it is invalid.
   * @param {Object} config The config object to validate.
   */
  static validateConfig(e) {
    if (!e)
      throw new Error('No configuration provided to "Animation" object.');
    if (!e.label || typeof e.label != "string")
      throw new Error(
        `Invalid label provided to Animation: ${e.label}. Must be of type "string".`
      );
    if (!e.animationFrames)
      throw new Error(
        `Invalid label provided to Animation: ${e.label}. Must be of type "string".`
      );
    if (typeof e.speed != "number" || e.speed < 0)
      throw new Error(
        `Invalid speed provided to Frame: ${e.speed}. Must be of type "number" and greater than 0.`
      );
    if (e.repeatCount && typeof e.repeatCount != "number")
      throw new Error(
        `Invalid repeatCount provided to Frame: ${e.repeatCount}. Must be of type "number".`
      );
  }
}
class re extends N {
  /**
   * Animate a `GameObject`.
   * @param {GameObject} gameObject The game object to append this behavior to.
   * @param {Object} config The configuration for this `Animate`.
   * @param {Array<Animation>} config.animations The animations for this behavior.
   * @param {boolean} config.enabledByDefault Whether the Behavior starts out enabled. Default: `true`.
   * @param {string} config.initialAnimation The label of the animation to start on.
   * @param {number} config.initialFrame The frame of the animation to start on.
   * @param {boolean} config.overwriteObjectRenderable Whether or not to force the GameObject's `renderable` property to return this `Animate` instance's `renderable` property. Default `false`.
   */
  constructor(e, t) {
    super(
      e,
      t.hasOwnProperty("enabledByDefault") ? t.enabledByDefault : !0
    ), re.validateConfig(t);
    const {
      animations: r,
      initialFrame: i = 0,
      initialAnimation: n,
      overwriteObjectRenderable: s = !1
    } = t;
    this.animations = r, this.currentAnimationLabel = void 0, this.__rawCurrentAnimationFrameIndex = i, this.playing = !1, this.repeats = 0, this.speed = 0, s && this.__overwriteObjectRenderable(), n && (this.currentAnimation = n), this.currentAnimation && (this.playing = !0);
  }
  /**
   * Overwrite a `GameObject`'s `renderable` property with this `Animate` instance's `renderable` property.
   */
  __overwriteObjectRenderable() {
    const e = this;
    Object.defineProperty(this.gameObject, "renderable", {
      get() {
        return e.renderable;
      },
      // Remove the ability to change the renderable.
      set(t) {
      },
      configurable: !0,
      enumerable: !0
    });
  }
  /**
   * After overwriting a `GameObject`'s `renderable` property, this method will return to back to its original functionality.
   */
  resetObjectRenderable() {
    this.gameObject.__resetRenderable();
  }
  get renderable() {
    return this.currentAnimationFrame && this.currentAnimationFrame.renderable;
  }
  /**
   * Get the current animation frame index.
   */
  get currentAnimationFrameIndex() {
    return Math.floor(this.__rawCurrentAnimationFrameIndex);
  }
  /**
   * Set the current animation frame index.
   */
  set currentAnimationFrameIndex(e) {
    this.__rawCurrentAnimationFrameIndex = e;
  }
  /**
   * Get the current animation frame.
   */
  get currentAnimationFrame() {
    return this.currentAnimation && this.currentAnimation.animationFrames[this.currentAnimationFrameIndex];
  }
  /**
   * The number of frames in the current animation.
   */
  get animationFrameCount() {
    return this.currentAnimation ? this.currentAnimation.animationFrames.length : 0;
  }
  /**
   * Get the current Animation.
   */
  get currentAnimation() {
    return this.animations.find(
      (e) => e.label === this.currentAnimationLabel
    );
  }
  /**
   * Set the current animation.
   */
  set currentAnimation(e) {
    const t = this.animations.find(
      (r) => r.label === e
    );
    if (!t)
      throw new Error(`No animation found with label: ${e}.`);
    this.currentAnimationLabel = e, this.currentAnimationFrameIndex = 0, this.speed = t.speed, this.playing = !0;
  }
  /**
   * Validates a TopDownMovement configuration object and throws an error if it is invalid.
   * @param {Object} config The config object to validate.
   */
  static validateConfig(e) {
    if (!e)
      throw new Error('No configuration provided to "Animate" behavior.');
    if (!e.animations || !(e.animations instanceof Array))
      throw new Error("No animations configured for Animate behavior.");
    for (const t of e.animations)
      if (!(t instanceof V))
        throw new Error(
          'Item in "animations" array is not an instance of "Animation".'
        );
    if (e.initialAnimation && typeof e.initialAnimation != "string")
      throw new Error(
        `Invalid initialAnimation provided to "Animate" behavior: ${e.initialAnimation}. Must be of type "string".`
      );
    if (e.initialFrame && (typeof e.initialFrame != "number" || e.initialAnimation < 0))
      throw new Error(
        `Invalid initialFrame provided to "Animate" behavior: ${e.initialAnimation}. Must be of type "number" and greater than 0.`
      );
  }
  onTick() {
    if (this.gameObject.paused || !this.playing) return;
    const {
      currentAnimation: e,
      animationFrameCount: t,
      runtime: { dt: r }
    } = this, i = this.currentAnimationFrame, n = i.duration && typeof i.duration == "number" ? i.duration : 1;
    this.__rawCurrentAnimationFrameIndex += e.speed * r / n, this.__rawCurrentAnimationFrameIndex >= t ? e.pingPong ? (e.speed *= -1, this.__rawCurrentAnimationFrameIndex = t - 1) : (this.repeats++, e.loop || this.repeats < e.repeatCount ? this.__rawCurrentAnimationFrameIndex = 0 : (this.playing = !1, this.__rawCurrentAnimationFrameIndex = t - 1)) : this.__rawCurrentAnimationFrameIndex < 0 && (e.pingPong && this.repeats++, e.loop || this.repeats < e.repeatCount ? (e.speed *= -1, this.__rawCurrentAnimationFrameIndex = 1) : (this.playing = !1, this.__rawCurrentAnimationFrameIndex = 0));
  }
}
export {
  Se as AdvMath,
  re as Animate,
  V as Animation,
  Be as AnimationFrame,
  N as Behavior,
  K as Box,
  ee as Core,
  B as Frame,
  A as GameObject,
  Z as Layer,
  P as Menu,
  y as Pixel,
  g as PixelMesh,
  H as Scene,
  je as ScrollTo,
  U as Text,
  Ae as TextInput,
  te as TopDownMovement,
  _e as __AudioManager,
  ye as __Camera,
  ve as __InputManager,
  xe as __LayerManager,
  Y as __Renderer,
  we as __Sound,
  Te as dataUtils,
  Ee as default
};
