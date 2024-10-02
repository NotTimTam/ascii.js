var be = Object.defineProperty;
var he = Object.getOwnPropertySymbols;
var _e = Object.prototype.hasOwnProperty, ye = Object.prototype.propertyIsEnumerable;
var G = Math.pow, J = (d, e, t) => e in d ? be(d, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : d[e] = t, A = (d, e) => {
  for (var t in e || (e = {}))
    _e.call(e, t) && J(d, t, e[t]);
  if (he)
    for (var t of he(e))
      ye.call(e, t) && J(d, t, e[t]);
  return d;
};
var g = (d, e, t) => J(d, typeof e != "symbol" ? e + "" : e, t);
var le = (d, e, t) => new Promise((r, i) => {
  var n = (l) => {
    try {
      s(t.next(l));
    } catch (o) {
      i(o);
    }
  }, a = (l) => {
    try {
      s(t.throw(l));
    } catch (o) {
      i(o);
    }
  }, s = (l) => l.done ? r(l.value) : Promise.resolve(l.value).then(n, a);
  s((t = t.apply(d, e)).next());
});
const T = (d) => `[${d.map((e) => {
  switch (typeof e) {
    case "string":
      return `"${e}"`;
    default:
      return e;
  }
}).join(", ")}]`, j = (d) => d && typeof d == "object" && !(d instanceof Array), We = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  displayArray: T,
  isPlainObject: j
}, Symbol.toStringTag, { value: "Module" })), B = class B {
  /**
   * A pixel mesh stores a 2-dimensional array of `Pixels`.
   * @param {Object} config The config for this `PixelMesh` instance.
   * @param {Array<Pixel>} config.data The frame's 2-dimensional (array of row arrays of `Pixels`) (left-to-right, top-to-bottom) data array.
   * @param {Array<number>} config.origin An array of display offsets to apply when rendering this pixel.
   */
  constructor(e) {
    if (!j(e))
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
g(B, "fromString", (e) => new B({
  data: e.split(`
`).map(
    (t) => t.split("").map(
      (r) => r && r.trim() !== "" && v.fromString(r)
    )
  )
}));
let L = B;
const R = class R {
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
    if (!j(e))
      throw new TypeError(
        "Expected a plain object for Pixel constructor config parameter."
      );
    const {
      value: t,
      color: r = "#ffffff",
      fontWeight: i = "normal",
      backgroundColor: n,
      solid: a = !1,
      origin: s
    } = e;
    if (typeof t != "string" || t.length !== 1)
      throw new Error(
        "The value of this pixel can only be a 1-character long string."
      );
    if (s && !(s instanceof Array))
      throw new Error(
        'Invalid origin provided to "Pixel". Expected: [<xOffset>, <yOffset>]'
      );
    this.value = t, this.color = r, this.fontWeight = i, this.backgroundColor = n, this.solid = a, this.origin = s;
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
g(R, "fromString", (e) => new R({ value: e }));
let v = R;
const P = class P {
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
g(P, "fromString", (e) => new P(e.split("").map((t) => new v({ value: t })))), /**
 * Convert a 2D array of `Pixel`s to a Frame.
 * @param {Array<Array<Pixel>} array The array to convert.
 */
g(P, "from2DArray", (e) => new P(e.flat()));
let $ = P;
const re = (d, e, t, r, i, n, a, s) => d < i + a && d + t > i && e < n + s && e + r > n, H = (d, e, t) => Math.max(e, Math.min(d, t)), ie = (d) => d * (180 / Math.PI), Q = (d) => d * (Math.PI / 180), ve = (d, e) => Math.floor(Math.random() * (e - d + 1)) + d, xe = (d) => {
  if (d === 0 || d === 1) return 1;
  for (let e = d - 1; e >= 1; e--)
    d *= e;
  return d;
}, ke = (d, e) => [
  e * Math.cos(Q(d)),
  e * Math.sin(Q(d))
], Ee = (d, e) => [
  ie(Math.atan2(e, d)),
  Math.sqrt(G(d, 2) + G(e, 2))
], Me = (d, e, t, r) => ie(Math.atan2(r - e, t - d)), Ce = (d, e, t, r) => Math.sqrt(G(t - d, 2) + G(r - e, 2)), Ge = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  aabb: re,
  angleBetweenPoints: Me,
  cartesianToVector: Ee,
  clamp: H,
  degreeToRadian: Q,
  distanceBetweenPoints: Ce,
  fact: xe,
  radianToDegree: ie,
  range: ve,
  vectorToCartesian: ke
}, Symbol.toStringTag, { value: "Module" }));
class Oe {
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
    this.element.volume = H(e, 0, 1);
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
class Le {
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
    new Oe(this, e, t, r);
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
class M {
  constructor(e, t, r) {
    g(this, "x");
    g(this, "y");
    g(this, "z");
    this.x = e, this.y = t, this.z = r;
  }
  dot2(e, t) {
    return this.x * e + this.y * t;
  }
  dot3(e, t, r) {
    return this.x * e + this.y * t + this.z * r;
  }
}
class je {
  /**
   * Create a new `Noise` instance.
   * @param {number} seed The seed for noise generation.
   */
  constructor(e = 0) {
    this.permutationTable = [
      151,
      160,
      137,
      91,
      90,
      15,
      131,
      13,
      201,
      95,
      96,
      53,
      194,
      233,
      7,
      225,
      140,
      36,
      103,
      30,
      69,
      142,
      8,
      99,
      37,
      240,
      21,
      10,
      23,
      190,
      6,
      148,
      247,
      120,
      234,
      75,
      0,
      26,
      197,
      62,
      94,
      252,
      219,
      203,
      117,
      35,
      11,
      32,
      57,
      177,
      33,
      88,
      237,
      149,
      56,
      87,
      174,
      20,
      125,
      136,
      171,
      168,
      68,
      175,
      74,
      165,
      71,
      134,
      139,
      48,
      27,
      166,
      77,
      146,
      158,
      231,
      83,
      111,
      229,
      122,
      60,
      211,
      133,
      230,
      220,
      105,
      92,
      41,
      55,
      46,
      245,
      40,
      244,
      102,
      143,
      54,
      65,
      25,
      63,
      161,
      1,
      216,
      80,
      73,
      209,
      76,
      132,
      187,
      208,
      89,
      18,
      169,
      200,
      196,
      135,
      130,
      116,
      188,
      159,
      86,
      164,
      100,
      109,
      198,
      173,
      186,
      3,
      64,
      52,
      217,
      226,
      250,
      124,
      123,
      5,
      202,
      38,
      147,
      118,
      126,
      255,
      82,
      85,
      212,
      207,
      206,
      59,
      227,
      47,
      16,
      58,
      17,
      182,
      189,
      28,
      42,
      223,
      183,
      170,
      213,
      119,
      248,
      152,
      2,
      44,
      154,
      163,
      70,
      221,
      153,
      101,
      155,
      167,
      43,
      172,
      9,
      129,
      22,
      39,
      253,
      19,
      98,
      108,
      110,
      79,
      113,
      224,
      232,
      178,
      185,
      112,
      104,
      218,
      246,
      97,
      228,
      251,
      34,
      242,
      193,
      238,
      210,
      144,
      12,
      191,
      179,
      162,
      241,
      81,
      51,
      145,
      235,
      249,
      14,
      239,
      107,
      49,
      192,
      214,
      31,
      181,
      199,
      106,
      157,
      184,
      84,
      204,
      176,
      115,
      121,
      50,
      45,
      127,
      4,
      150,
      254,
      138,
      236,
      205,
      93,
      222,
      114,
      67,
      29,
      24,
      72,
      243,
      141,
      128,
      195,
      78,
      66,
      215,
      61,
      156,
      180
    ], this.grad3 = [
      new M(1, 1, 0),
      new M(-1, 1, 0),
      new M(1, -1, 0),
      new M(-1, -1, 0),
      new M(1, 0, 1),
      new M(-1, 0, 1),
      new M(1, 0, -1),
      new M(-1, 0, -1),
      new M(0, 1, 1),
      new M(0, -1, 1),
      new M(0, 1, -1),
      new M(0, -1, -1)
    ], this.perm = new Array(512), this.gradP = new Array(512), this.F2 = 0.5 * (Math.sqrt(3) - 1), this.G2 = (3 - Math.sqrt(3)) / 6, this.F3 = 1 / 3, this.G3 = 1 / 6, e > 0 && e < 1 && (e *= 65536), e = Math.floor(e), e < 256 && (e |= e << 8);
    for (let t = 0; t < 256; t++) {
      let r;
      t & 1 ? r = this.permutationTable[t] ^ e & 255 : r = this.permutationTable[t] ^ e >> 8 & 255, this.perm[t] = this.perm[t + 256] = r, this.gradP[t] = this.gradP[t + 256] = this.grad3[r % 12];
    }
  }
  /**
   * Generate a 2D simplex noise value.
   * @param {number} xin x-coordinate.
   * @param {number} yin y-coordinate.
   * @returns {number} The random noise for those coordinates.
   */
  simplex2(e, t) {
    let r, i, n, a = (e + t) * this.F2, s = Math.floor(e + a), l = Math.floor(t + a), o = (s + l) * this.G2, h = e - s + o, c = t - l + o, u, f;
    h > c ? (u = 1, f = 0) : (u = 0, f = 1);
    let p = h - u + this.G2, m = c - f + this.G2, w = h - 1 + 2 * this.G2, b = c - 1 + 2 * this.G2;
    s &= 255, l &= 255;
    let x = this.gradP[s + this.perm[l]], y = this.gradP[s + u + this.perm[l + f]], E = this.gradP[s + 1 + this.perm[l + 1]], k = 0.5 - h * h - c * c;
    k < 0 ? r = 0 : (k *= k, r = k * k * x.dot2(h, c));
    let C = 0.5 - p * p - m * m;
    C < 0 ? i = 0 : (C *= C, i = C * C * y.dot2(p, m));
    let O = 0.5 - w * w - b * b;
    return O < 0 ? n = 0 : (O *= O, n = O * O * E.dot2(w, b)), 70 * (r + i + n);
  }
  /**
   * Generate a 3D simplex noise value.
   * @param {number} xin x-coordinate.
   * @param {number} yin y-coordinate.
   * @param {number} zin z-coordinate.
   * @returns {number} The random noise for those coordinates.
   */
  simplex3(e, t, r) {
    let i, n, a, s, l = (e + t + r) * this.F3, o = Math.floor(e + l), h = Math.floor(t + l), c = Math.floor(r + l), u = (o + h + c) * this.G3, f = e - o + u, p = t - h + u, m = r - c + u, w, b, x, y, E, k;
    f >= p ? p >= m ? (w = 1, b = 0, x = 0, y = 1, E = 1, k = 0) : f >= m ? (w = 1, b = 0, x = 0, y = 1, E = 0, k = 1) : (w = 0, b = 0, x = 1, y = 1, E = 0, k = 1) : p < m ? (w = 0, b = 0, x = 1, y = 0, E = 1, k = 1) : f < m ? (w = 0, b = 1, x = 0, y = 0, E = 1, k = 1) : (w = 0, b = 1, x = 0, y = 1, E = 1, k = 0);
    let C = f - w + this.G3, O = p - b + this.G3, Y = m - x + this.G3, N = f - y + 2 * this.G3, z = p - E + 2 * this.G3, q = m - k + 2 * this.G3, U = f - 1 + 3 * this.G3, K = p - 1 + 3 * this.G3, V = m - 1 + 3 * this.G3;
    o &= 255, h &= 255, c &= 255;
    let pe = this.gradP[o + this.perm[h + this.perm[c]]], me = this.gradP[o + w + this.perm[h + b + this.perm[c + x]]], ge = this.gradP[o + y + this.perm[h + E + this.perm[c + k]]], we = this.gradP[o + 1 + this.perm[h + 1 + this.perm[c + 1]]], S = 0.6 - f * f - p * p - m * m;
    S < 0 ? i = 0 : (S *= S, i = S * S * pe.dot3(f, p, m));
    let F = 0.6 - C * C - O * O - Y * Y;
    F < 0 ? n = 0 : (F *= F, n = F * F * me.dot3(C, O, Y));
    let I = 0.6 - N * N - z * z - q * q;
    I < 0 ? a = 0 : (I *= I, a = I * I * ge.dot3(N, z, q));
    let W = 0.6 - U * U - K * K - V * V;
    return W < 0 ? s = 0 : (W *= W, s = W * W * we.dot3(U, K, V)), 32 * (i + n + a + s);
  }
  // ##### Perlin noise stuff
  fade(e) {
    return e * e * e * (e * (e * 6 - 15) + 10);
  }
  lerp(e, t, r) {
    return (1 - r) * e + r * t;
  }
  /**
   * Generate a 2D perlin noise value.
   * @param {number} x x-coordinate.
   * @param {number} y y-coordinate.
   * @returns {number} The random noise for those coordinates.
   */
  perlin2(e, t) {
    let r = Math.floor(e), i = Math.floor(t);
    e = e - r, t = t - i, r = r & 255, i = i & 255;
    let n = this.gradP[r + this.perm[i]].dot2(e, t), a = this.gradP[r + this.perm[i + 1]].dot2(e, t - 1), s = this.gradP[r + 1 + this.perm[i]].dot2(e - 1, t), l = this.gradP[r + 1 + this.perm[i + 1]].dot2(e - 1, t - 1), o = this.fade(e);
    return this.lerp(
      this.lerp(n, s, o),
      this.lerp(a, l, o),
      this.fade(t)
    );
  }
  /**
   * Generate a 3D perlin noise value.
   * @param {number} x x-coordinate.
   * @param {number} y y-coordinate.
   * @param {number} z z-coordinate.
   * @returns {number} The random noise for those coordinates.
   */
  perlin3(e, t, r) {
    let i = Math.floor(e), n = Math.floor(t), a = Math.floor(r);
    e = e - i, t = t - n, r = r - a, i = i & 255, n = n & 255, a = a & 255;
    let s = this.gradP[i + this.perm[n + this.perm[a]]].dot3(e, t, r), l = this.gradP[i + this.perm[n + this.perm[a + 1]]].dot3(
      e,
      t,
      r - 1
    ), o = this.gradP[i + this.perm[n + 1 + this.perm[a]]].dot3(
      e,
      t - 1,
      r
    ), h = this.gradP[i + this.perm[n + 1 + this.perm[a + 1]]].dot3(
      e,
      t - 1,
      r - 1
    ), c = this.gradP[i + 1 + this.perm[n + this.perm[a]]].dot3(
      e - 1,
      t,
      r
    ), u = this.gradP[i + 1 + this.perm[n + this.perm[a + 1]]].dot3(
      e - 1,
      t,
      r - 1
    ), f = this.gradP[i + 1 + this.perm[n + 1 + this.perm[a]]].dot3(
      e - 1,
      t - 1,
      r
    ), p = this.gradP[i + 1 + this.perm[n + 1 + this.perm[a + 1]]].dot3(
      e - 1,
      t - 1,
      r - 1
    ), m = this.fade(e), w = this.fade(t), b = this.fade(r);
    return this.lerp(
      this.lerp(this.lerp(s, c, m), this.lerp(l, u, m), b),
      this.lerp(this.lerp(o, f, m), this.lerp(h, p, m), b),
      w
    );
  }
}
class Ae {
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
    g(this, "isOnScreen", (e, t, r, i, n = 1, a = 1) => re(
      e,
      t,
      r,
      i,
      this.x * n,
      this.y * a,
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
const _ = class _ {
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
      axes: Object.fromEntries(
        e.filter(
          (i, n) => _.standardAxesMap[n]
        ).map((i, n) => [
          _.standardAxesMap[n],
          i
        ])
      ),
      buttons: Object.fromEntries(
        t.filter(
          (i, n) => _.standardButtonMap[n]
        ).map((i, n) => [
          _.standardButtonMap[n],
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
          (r, i) => _.standardAxesMap[i]
        ).map((r, i) => [
          _.standardAxesMap[i],
          r
        ])
      ),
      buttons: Object.fromEntries(
        t.filter(
          (r, i) => _.xbButtonMap[i]
        ).map((r, i) => [
          _.xbButtonMap[i],
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
          (r, i) => _.standardAxesMap[i]
        ).map((r, i) => [
          _.standardAxesMap[i],
          r
        ])
      ),
      buttons: Object.fromEntries(
        t.filter(
          (r, i) => _.psButtonMap[i]
        ).map((r, i) => [
          _.psButtonMap[i],
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
          (r, i) => _.standardAxesMap[i]
        ).map((r, i) => [
          _.standardAxesMap[i],
          r
        ])
      ),
      buttons: Object.fromEntries(
        t.filter(
          (r, i) => _.nsButtonMap[i]
        ).map((r, i) => [
          _.nsButtonMap[i],
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
g(_, "xbButtonMap", [
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
]), g(_, "psButtonMap", [
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
]), g(_, "nsButtonMap", [
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
]), g(_, "standardButtonMap", [
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
]), g(_, "standardAxesMap", ["lh", "lv", "rh", "rv"]);
let ee = _;
class Pe {
  /**
   * Handles user input.
   * @param {Scene} scene The current scene.
   */
  constructor(e) {
    g(this, "__eventHandler", (e) => this.__onEvent(e));
    g(this, "__contextHandler", (e) => e.preventDefault());
    /**
     * Handles when the user leaves this tab.
     */
    g(this, "__windowBlurHandler", () => {
      this.keyboard.keys = {}, this.mouse.buttons = {}, delete this.mouse.deltas, delete this.mouse.scroll;
    });
    this.scene = e, this.keyboard = {
      keys: {},
      keyCodes: {},
      keyCode: void 0,
      key: void 0
    }, this.mouse = { buttons: {}, onLayer: {} }, this.__eventListeners = {
      all: [],
      click: [
        (t) => {
          for (const [r, i] of this.__gameObjectClicks)
            if (t.targets.includes(r)) {
              let n = A({}, t);
              delete n.targets, n.target = r, i(n);
            }
        }
      ]
    }, this.__gameObjectClicks = [], this.__onCreated(), this.__windowBlurHandler = this.__windowBlurHandler.bind(this);
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
      return new ee(this, t);
    });
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
    return le(this, null, function* () {
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
        camera: { x: a, y: s },
        layerManager: { layers: l },
        runtime: {
          renderer: {
            width: o,
            height: h,
            element: c
          }
        }
      }
    } = this, {
      x: u,
      y: f,
      width: p,
      height: m
    } = c.getBoundingClientRect(), [w, b] = [t - u, r - f], [x, y] = [w / p, b / m];
    if (this.hasPointerLock)
      this.mouse.velocity = [i, n];
    else {
      this.mouse.velocity = [i, n], this.mouse.rawX = t, this.mouse.rawY = r, this.mouse.canvasX = w, this.mouse.canvasY = b, this.mouse.x = H(
        Math.floor(x * o),
        0,
        o
      ), this.mouse.y = H(
        Math.floor(y * h),
        0,
        h
      ), this.mouse.onLayer = {};
      for (const E of l) {
        const {
          label: k,
          parallax: [C, O]
        } = E;
        this.mouse.onLayer[k] = [
          this.mouse.x + a * C,
          this.mouse.y + s * O
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
      this.__triggerEvents(t, A({ type: t }, this.mouse)), this.__triggerEvents("all", A({ type: t }, this.mouse)), t === "click" && this.mouse.target && delete this.mouse.target, this.__resetMouseWheel();
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
      this.__triggerEvents(t, A({ type: t }, this.keyboard)), this.__triggerEvents("all", A({ type: t }, this.keyboard));
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
        `"${e}" is not a valid event type. Must be one of: ${T(
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
        `"${e}" is not a valid event type. Must be one of: ${T(
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
}
class de {
  /**
   * The most core level object.
   * @param {Scene} scene The scene this Object is a part of.
   */
  constructor(e) {
    if (!crypto || !crypto.randomUUID)
      throw new Error(
        'This environment does not support the JavaScript "crypto" library. Only secure contexts (HTTPS) support "crypto.randomUUID".'
      );
    if (!(e instanceof X))
      throw new TypeError(
        'Invalid object provided to Core class constructor. Expected an instance of "Scene".'
      );
    this.scene = e, this.id = crypto.randomUUID();
  }
  get runtime() {
    return this.scene.runtime;
  }
}
class D extends de {
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
    this.__rawX = t, this.__rawY = r, this.__rawVisible = !0, this.__rawRenderable = new v({ value: "#", color: "magenta" }), this.behaviors = [], i && (this.layer = i);
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
    const { width: i, height: n } = this.renderable, [a, s] = this.layer.parallax;
    return e.isOnScreen(t, r, i, n, a, s);
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
    return this.renderable && this.renderable.width || 0;
  }
  /**
   * Get the height of this `GameObject`'s renderable.
   */
  get height() {
    return this.renderable && this.renderable.height || 0;
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
    if (e && !(e instanceof v) && !(e instanceof L))
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
        if (e && !(e instanceof v) && !(e instanceof L))
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
class ce {
  /**
   * A layer is a construct of other objects. The layer manages these objects and can optionally render them to the screen.
   * @param {LayerManager} layerManager The `LayerManager` parent object.
   * @param {Object} config The `Layer`'s config object.
   * @param {string} config.label This layer's label.
   * @param {Array<Number>} config.parallax This layer's parallax array. `[x, y]` Numbers 0-1 determine how much this layer moves with the camera. `[0, 0]` for layers that do not move.
   * @param {Array<function>} config.gameObjectConstructors An array of functions that return game objects.
   */
  constructor(e, t) {
    if (!j(t))
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
      if (!(r instanceof D))
        throw new TypeError(
          'Each gameObjectConstructor function must return an object of type "GameObject".'
        );
      return r;
    }).filter(
      (t) => t && t instanceof D
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
    } = this, [n, a] = [
      Math.round(e.x * r),
      Math.round(e.y * i)
    ], s = (o, h, c) => {
      if (!o || !(o instanceof v) || !e.isOnScreen(h, c, 1, 1, r, i) || (!o.value || o.value.trim() === "") && (!o.backgroundColor || o.backgroundColor === "transparent"))
        return;
      const [u, f] = [h - n, c - a], p = t.coordinatesToIndex(u, f);
      l[p] = o;
    }, l = [];
    for (const o of this.gameObjects.filter(
      ({ visible: h }) => h
    )) {
      const { renderable: h } = o;
      let { x: c, y: u } = o;
      if (h) {
        if (h.origin) {
          const [f, p] = h.origin;
          c -= f, u -= p, c = Math.round(c), u = Math.round(u);
        }
        if (h instanceof v)
          s(h, c, u);
        else if (h instanceof L) {
          if (!e.isOnScreen(
            c,
            u,
            h.width,
            h.height,
            r,
            i
          ))
            continue;
          for (let f = 0; f < h.data.length; f++) {
            const p = h.data[f];
            if (!(!p || p.length === 0))
              for (let m = 0; m < p.length; m++) {
                const w = p[m];
                s(w, c + m, u + f);
              }
          }
        }
      } else
        continue;
    }
    return new $(l);
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
class Te {
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
    g(this, "getLayerByLabel", (e) => this.layers.find((t) => t.label === e));
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
    const i = this.layers.find(({ label: s }) => s === r);
    if (r && !i)
      throw new Error(`No layer exists with label "${r}".`);
    const n = r ? [i] : this.layers, a = [];
    for (const s of n) {
      const { gameObjects: l } = s;
      for (const o of l) {
        const { renderable: h, x: c, y: u } = o;
        if (h instanceof v && c === e && u === t)
          a.push({ gameObject: o, pixel: h });
        else if (h instanceof L && re(
          e,
          t,
          1,
          1,
          c,
          u,
          h.width,
          h.height
        )) {
          const f = h.data[t - u] && h.data[t - u][e - c];
          if (!f) continue;
          a.push({
            gameObject: o,
            pixel: f
          });
        }
      }
    }
    return a;
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
    this.layers = [], e.includes("system") || new ce(this, { label: "system" });
    for (const t of e) new ce(this, t);
  }
  __mergedRender() {
    const {
      scene: {
        runtime: { renderer: e }
      }
    } = this, t = e.compileFrames(
      ...this.visibleLayers.map((r) => r.frame)
    );
    JSON.stringify(t) === this.lastFrame && e.hasDrawn || (this.lastFrame = JSON.stringify(t), e.clearDisplay(), e.drawFrame(t));
  }
  __stackedRender() {
    const {
      scene: {
        runtime: { renderer: e }
      }
    } = this, t = this.visibleLayers.map((r) => r.frame);
    for (const r of t) e.drawFrame(r);
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
class X {
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
    if (this.runtime = e, !e || !(e instanceof Se))
      throw new TypeError(
        "Scene constructor was not provided an instance of Runtime."
      );
    X.validateConfig(t);
    const { label: r, layers: i, onLoad: n, onTick: a } = t;
    this.label = r, this.camera = new Ae(this), this.layerManager = new Te(this, i), this.inputManager = new Pe(this), n && (this.onLoadPassthrough = n), a && (this.onTickPassthrough = a), this.__onTick.bind(this), this.__onLoad();
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
    if (!j(e))
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
    this.layerManager.__onTick(), this.onTickPassthrough && this.onTickPassthrough(this);
  }
}
class Se {
  /**
   * The overall game state and management system.
   * @param {Object} config The game's config object.
   * @param {number} config.seed A seed for random value generation.
   * @param {Object} config.renderer Configuration for the `Renderer` class.
   * @param {Array<Number>} config.renderer.resolution Determines the resolution (in characters) of the renderer. Format: `[integer width, integer height]`
   * @param {Element|string} config.renderer.canvas A DOM `<canvas/>` element, or a CSS selector string that targets one. This element will be used for rendering.
   * @param {string} config.renderer.fontSize A string CSS `font-size` value that will be used for text displayed in the renderer.
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
    g(this, "__runOnStartup", (e, ...t) => e.onStartup && e.onStartup(...t));
    /**
     * Run the onTick method of any object.
     * @param {Object} object The object whose method should be run.
     * @param  {...any} passthrough The data to pass through to that method.
     */
    g(this, "__runOnTick", (e, ...t) => e.onTick && e.onTick(this, ...t));
    /**
     * Run the onLoad method of any object.
     * @param {Object} object The object whose method should be run.
     * @param  {...any} passthrough The data to pass through to that method.
     */
    g(this, "__runOnLoad", (e, ...t) => e.onLoad && e.onLoad(...t));
    this.config = e, this.validateConfig(e), this.noise = new je(e.seed || Date.now()), this.audioManager = new Le(this), this.renderer = new ne(this), this.running = !1, this.initialized = !1, this.paused = !1;
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
    if (!j(e))
      throw new TypeError(
        "Expected a plain object for Runtime constructor config parameter."
      );
    if (e.seed && typeof e.seed != "number" && typeof e.seed != "string")
      throw new Error(
        `Invalid random noise "seed" value provided to Runtime: "${e.seed}". String or number value required.`
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
    if (!(e instanceof X))
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
const Fe = `
self.onmessage = function ({ data: { data: frame, characterSize: [cW, cH], width, height, fontSize } }) {
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

	const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);

	self.postMessage(imageData);
};
`;
class ne {
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
    g(this, "coordinatesToIndex", (e, t) => t * this.width + e);
    /**
     * Convert a frame index into x and y coordinates.
     * @param {number} index The frame index.
     * @returns {Array<Number>} A coordinate array.
     */
    g(this, "indexToCoordinates", (e) => [
      e % this.width,
      Math.floor(e / this.width)
    ]);
    if (this.runtime = e, this.config = this.runtime.config && this.runtime.config.renderer, ne.validateConfig(this.config), !this.config)
      throw new Error("No config object provided to renderer.");
    if (this.__onCreated(), this.useWebWorkers = this.config.hasOwnProperty("useWebWorkers") ? !!this.config.useWebWorkers : !0, !window.Worker && this.useWebWorkers)
      throw new Error("This environment does not support webworkers.");
    this.__createWorkerInterface();
  }
  /**
   * Create interfaces for each web worker.
   */
  __createWorkerInterface() {
    this.webWorkers = {
      drawFrame: new Worker(
        URL.createObjectURL(
          new Blob([Fe], {
            type: "application/javascript"
          })
        ),
        {
          type: "module"
        }
      )
    }, this.webWorkers.drawFrame.onmessage = (e) => {
      this.clearDisplay(), this.ctx.putImageData(e.data, 0, 0), this.drawing = !1;
    };
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
          `Invalid scaling value provided, must be one of: ${T(
            t
          )}`
        );
    }
    if (e.renderMode) {
      const t = ["stacked", "merged"];
      if (!t.includes(e.renderMode))
        throw new Error(
          `Provided render mode is invalid. Must be of type: ${T(
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
    const { fontSize: e, canvas: t } = this.config;
    typeof t == "string" ? this.element = document.querySelector(t) : t instanceof Element && t.tagName.toLowerCase() === "canvas" && (this.element = t), document.body.style = `
			width: 100vw;
			height: 100vh;
			overflow: hidden;
			background-color: black;
			padding: 0;
			margin: 0;
			box-sizing: border-box;
		`, this.element.style = `
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translateX(-50%) translateY(-50%);

			box-sizing: border-box;
			padding: 0;
			margin: 0;

			width: 100%;
			height: 100%;
		`, this.ctx = this.element.getContext("2d");
    const { ctx: r } = this;
    r.canvas.width = window.innerWidth, r.canvas.height = window.innerHeight, r.canvas.style.width = `${window.innerWidth}px`, r.canvas.style.height = `${window.innerHeight}px`, r.font = `${e} monospace`;
    const {
      width: i,
      fontBoundingBoxAscent: n,
      fontBoundingBoxDescent: a
    } = this.ctx.measureText("█"), s = n + a;
    this.characterSize = [i, s];
    const [l, o] = [
      i * this.width,
      s * this.height
    ];
    r.canvas.width = l, r.canvas.height = o, r.canvas.style.width = `${l}px`, r.canvas.style.height = `${o}px`;
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
    const { innerWidth: r, innerHeight: i } = window;
    e.style.transform = "translateX(-50%) translateY(-50%) scale(1)";
    const { width: n, height: a } = e.getBoundingClientRect(), [s, l] = [
      r / n,
      i / a
    ], o = Math.min(s, l);
    e.style.transform = `translateX(-50%) translateY(-50%) scale(${o})`;
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
   * Draw a frame to the screen.
   * @param {Frame} frame The frame to draw.
   */
  drawFrame(e) {
    if (!this.drawing) {
      if (!(e instanceof $))
        throw new Error(
          "Provided frame object is not an instance of the Frame constructor."
        );
      if (this.hasDrawn || (this.hasDrawn = !0), this.useWebWorkers) {
        this.drawing = !0;
        const {
          characterSize: t,
          width: r,
          height: i,
          config: { fontSize: n }
        } = this;
        this.webWorkers.drawFrame.postMessage({
          data: e.data,
          characterSize: t,
          width: r,
          height: i,
          fontSize: n
        });
      } else {
        this.drawing = !0, this.clearDisplay();
        const {
          config: { fontSize: t },
          characterSize: [r, i],
          ctx: n,
          width: a
        } = this;
        n.textAlign = "left", n.textBaseline = "top";
        for (let s = 0; s < this.width; s++)
          for (let l = 0; l < this.height; l++) {
            const o = l * this.width + s, h = e.data[o];
            if (!h || !(h instanceof v)) continue;
            const { value: c, color: u, fontWeight: f, backgroundColor: p } = h;
            p && (n.beginPath(), n.fillStyle = p, n.fillRect(
              s * r,
              l * i,
              r + Math.max(1 / a, 1),
              i
            ), n.closePath()), n.beginPath(), n.font = `${f || "normal"} ${t} monospace`, n.fillStyle = u || "#FFFFFF", n.fillText(c, s * r, l * i), n.closePath(), this.drawing = !1;
          }
        e.state = "current";
      }
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
      i.forEach((n, a) => {
        n && (t[a] = n);
      });
    }
    return new $(t);
  }
  /**
   * Code that runs when the render is created.
   */
  __onCreated() {
    this.__intializeDisplay(), this.__rescaleDisplay(), window.addEventListener("resize", () => this.__rescaleDisplay());
  }
}
class se extends de {
  /**
   * A core object that modifies the behavior of a GameObject. Behaviors need an `onTick` method that will run every frame right before their `GameObject`'s `onTick`.
   * @param {GameObject} gameObject The game object to append this behavior to.
   * @param {boolean} enabledByDefault Whether the Behavior starts out enabled. Default: `true`.
   */
  constructor(e, t = !0) {
    super(e.scene), this.gameObject = e, e.behaviors.push(this), this.enabled = t;
  }
}
const Z = {
  line: [
    ["┌", "─", "┐"],
    ["│", " ", "│"],
    ["└", "─", "┘"]
  ],
  double: [
    ["╔", "═", "╗"],
    ["║", " ", "║"],
    ["╚", "═", "╝"]
  ]
};
class oe extends D {
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
    if (!j(t))
      throw new TypeError(
        "Expected a plain object for Box constructor config parameter."
      );
    const {
      x: r,
      y: i,
      width: n,
      height: a,
      color: s = "#ffffff",
      backgroundColor: l,
      style: o = "double",
      layer: h
    } = t;
    if (super(e, r, i, h), this.__rawWidth = n, this.__rawHeight = a, this.color = s, this.backgroundColor = l, !Object.keys(Z).includes(o))
      throw new Error(
        `Invalid box style "${o}" provided. Must be one of: ${T(
          Object.keys(Z)
        )}`
      );
    this.style = o;
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
    return oe.asPixelMesh(e, t, r, i, n);
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
    const a = Z[n], s = [];
    for (let l = 0; l < t; l++) {
      const o = [];
      for (let h = 0; h < e; h++) {
        let c = 0, u = 0;
        h === e - 1 ? c = 2 : h > 0 && (c = 1), l === t - 1 ? u = 2 : l > 0 && (u = 1);
        let f = a[u][c];
        o.push(
          new v({
            value: f,
            color: r,
            backgroundColor: i,
            solid: !1
          })
        );
      }
      s.push(o);
    }
    return new L({ data: s });
  }
}
class te extends D {
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
    if (!j(t))
      throw new TypeError(
        "Expected a plain object for Text constructor config parameter."
      );
    const {
      x: r,
      y: i,
      value: n = "Hello, world!",
      wrap: a = !0,
      color: s = "#ffffff",
      backgroundColor: l,
      fontWeight: o = 400,
      maxWidth: h = e.runtime.renderer.width,
      layer: c
    } = t;
    if (super(e, r, i, c), h && (typeof h != "number" || !Number.isInteger(h) || h < 1))
      throw new TypeError(
        "Invalid config.maxWidth value provided to Text. Expected an integer greater than 0."
      );
    if (typeof n != "string")
      throw new Error(
        `Provided text value "${n}" is not of type "string".`
      );
    this.__rawValue = n, this.wrap = a, this.color = s, this.backgroundColor = l, this.fontWeight = o, this.maxWidth = h;
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
    const { wrap: e, value: t, maxWidth: r, color: i, backgroundColor: n, fontWeight: a } = this, s = t.split(`
`), l = [];
    for (const o of s)
      if (!e && o.length > r)
        l.push(
          o.substring(0, r).split("").map(
            (h) => new v({
              value: h,
              color: i,
              backgroundColor: n,
              fontWeight: a
            })
          )
        );
      else {
        let h = [], c = 0;
        for (const u of o) {
          if (c >= r)
            if (e)
              l.push(
                h.map(
                  (f) => new v({
                    value: f,
                    color: i,
                    backgroundColor: n,
                    fontWeight: a
                  })
                )
              ), h = [], c = 0;
            else
              break;
          h.push(u), c++;
        }
        h.length > 0 && l.push(
          h.map(
            (u) => new v({
              value: u,
              color: i,
              backgroundColor: n,
              fontWeight: a
            })
          )
        );
      }
    return new L({ data: l });
  }
  set renderable(e) {
  }
}
class $e extends D {
  /**
   * A list of user input options that can be rendered on screen.
   * @param {Scene} scene The scene this Object is a part of.
   * @param {Object} config The `Menu`'s config object.
   * @param {number} config.x This `Menu` object's x-coordinate.
   * @param {number} config.y This `Menu` object's y-coordinate.
   * @param {Object} config.options An object of key value pairs, the values representing option labels, and the keys being what is returned when an object is selected.
   * @param {function} config.callback A callback function that is called when a menu option is selected. Passed the key of the selected option.
   * @param {string} config.title Optional menu title.
   * @param {string} config.layer The label of the layer to start the `Menu` on.
   */
  constructor(e, t) {
    if (!j(t))
      throw new TypeError(
        "Expected a plain object for Menu constructor config parameter."
      );
    const {
      x: r,
      y: i,
      title: n,
      options: a,
      callback: s = (o) => console.log(o),
      layer: l
    } = t;
    if (super(e, r, i, l), this.options = a, this.callback = s, this.index = 0, this.longestOption = this.determineLongestOption(), n && typeof n != "string")
      throw new Error(
        `Provided menu title "${n}" is not of type "string".`
      );
    this.title = n, e.inputManager.addEventListener(this.handleInput.bind(this)), this.__inputMode = "keyboard";
  }
  handleInput(e) {
    if (!(!this.isOnScreen || !this.visible))
      if (e.type === "keydown") {
        this.__inputMode = "keyboard";
        const {
          keys: { up: t, down: r, enter: i }
        } = e;
        r && this.index++, t && this.index--, i && this.callback(Object.keys(this.options)[this.index]);
        const n = Object.keys(this.options).length - 1;
        this.index < 0 && (this.index = n), this.index > n && (this.index = 0);
      } else if (e.type === "mousemove") {
        const { onLayer: t } = e, [r, i] = t[this.layer.label], [n, a] = [r - this.x, i - this.y], s = Math.floor(a - 1.5);
        s >= 0 && s < Object.keys(this.options).length && n >= 0 && n <= this.width && (this.__inputMode = "mouse", this.index = s);
      } else e.type === "mousedown" && this.__inputMode === "mouse" && this.index >= 0 && this.index < Object.keys(this.options).length && this.callback(Object.keys(this.options)[this.index]);
  }
  get width() {
    const {
      runtime: {
        renderer: { width: e }
      }
    } = this, t = Math.round(this.longestOption + 2), r = this.title ? this.title.length + 4 : 0;
    return Math.max(t, r, e / 4);
  }
  get height() {
    const {
      runtime: {
        renderer: { height: e }
      }
    } = this;
    return Math.min(
      Math.round(Object.keys(this.options).length + 4),
      e
    );
  }
  determineLongestOption() {
    const { options: e } = this;
    let t = 0;
    return Object.values(e).forEach((r) => {
      const i = r;
      i.length > t && (t = i.length);
    }), t;
  }
  get renderable() {
    const {
      options: e,
      scene: t,
      runtime: {
        renderer: { width: r, height: i }
      },
      title: n
    } = this, a = r - 2, s = [];
    if (e) {
      const o = Object.values(e);
      let h = o;
      if (o.length + 4 > i) {
        const c = Math.min(o.length, i - 4);
        this.index < Math.floor(c / 2) ? h = o.slice(0, c) : this.index > o.length - Math.ceil(c / 2) ? h = o.slice(
          o.length - c
        ) : this.index >= Math.floor(c / 2) && (h = o.slice(
          this.index - Math.floor(c / 2),
          this.index + Math.ceil(c / 2)
        ));
      }
      h.forEach((c) => {
        if (!c || typeof c != "string") return;
        const u = c.slice(0, a), f = this.width - 1 - u.length, p = o.indexOf(c), m = new te(t, {
          x: 0,
          y: 0,
          value: `${" ".repeat(
            Math.floor(f) / 2
          )}${u}${" ".repeat(Math.ceil(f) / 2)}`,
          wrap: !1,
          // color: index === this.index ? "#000000" : "#ffffff",
          // backgroundColor:
          // 	index === this.index ? "#ffffff" : "#000000",
          // fontWeight: index === this.index ? "800" : "400",
          color: p === this.index ? "#ffffff" : "grey",
          fontWeight: p === this.index ? "800" : "100",
          backgroundColor: "#000000"
        }).renderable.data[0];
        s.push(m);
      });
    }
    const l = new oe(t, {
      x: 0,
      y: 0,
      width: this.width,
      height: Object.keys(e).length + 4,
      backgroundColor: "#000000"
    }).renderable.data;
    s.unshift(l[1]), s.unshift(l[0]), s.push(l[1]), s.push(l[l.length - 1]);
    for (let o = 2; o < s.length - 2; o++)
      s[o].unshift(l[o][0]), s[o][this.width - 1] = l[o][l[o].length - 1];
    if (n) {
      const o = new te(t, {
        x: 0,
        y: 0,
        value: n.slice(0, a - 2),
        wrap: !1,
        color: "#ffffff",
        backgroundColor: "#000000"
      }).renderable.data[0], h = Math.floor((this.width - o.length) / 2);
      for (let c = 0; c < o.length; c++)
        s[0][c + h] = o[c];
    }
    return new L({ data: s });
  }
  set renderable(e) {
  }
}
class De extends te {
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
   * @param {number} config.maxLength An optional maximum input length.
   * @param {string} config.layer The label of the layer to start the `TextInput` on.
   */
  constructor(e, t) {
    if (!j(t))
      throw new TypeError(
        "Expected a plain object for TextInput constructor config parameter."
      );
    t.wrap = !1, t.maxWidth || (t.maxWidth = 8), super(e, t);
    const {
      activeColor: r = "black",
      backgroundColor: i = "transparent",
      backgroundColorActive: n = "white",
      onChange: a,
      onKeyDown: s,
      maxLength: l
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
    if (a) {
      if (typeof a != "function")
        throw new TypeError(
          "Expected a function for TextInput config.onChange value."
        );
      this.onChange = a;
    }
    if (s) {
      if (typeof s != "function")
        throw new TypeError(
          "Expected a function for TextInput config.onKeyDown value."
        );
      this.onKeyDown = s;
    }
    if (l) {
      if (typeof l != "number" || !Number.isInteger(l) || l < 0)
        throw new TypeError(
          "Invalid config.maxLength value provided to TextInput. Expected an integer greater than or equal to 0."
        );
      this.maxLength = l;
    }
    this.scroll = 0, this.focused = !!t.autoFocus, this.caret = t.value ? t.value.length : 0, e.inputManager.addOnClick(this, this.onClick.bind(this)), e.inputManager.addEventListener(this.eventListener.bind(this));
  }
  /**
   * Listens to click events.
   */
  onClick() {
    this.focused = !0;
  }
  /**
   * Listen to other input events.
   */
  eventListener(e) {
    const { caret: t } = this;
    if (e.type === "click" && !e.target.map(({ gameObject: r }) => r.id).includes(this.id))
      this.focused = !1;
    else if (e.type === "keydown" && this.focused) {
      const { key: r } = e;
      for (/^[\x20-\x7E]$/.test(r) && (typeof this.maxLength != "number" || this.value.length < this.maxLength) ? (this.value = this.value.slice(0, this.caret) + r + this.value.slice(this.caret), this.caret++) : r === "Backspace" ? (this.value = this.value.slice(0, t - 1) + this.value.slice(t), this.caret !== this.value.length && this.caret--) : r === "Delete" ? this.value = this.value.slice(0, t) + this.value.slice(t + 1) : r === "Tab" ? (this.value += "    ", this.caret += 4) : r === "Escape" ? this.focused = !1 : r === "ArrowLeft" ? this.caret-- : r === "ArrowRight" && this.caret++; this.caret < this.scroll; ) this.scroll--;
      for (; this.caret > this.scroll + this.maxWidth - 2; ) this.scroll++;
      this.onChange && this.onChange({ target: this }), this.onKeyDown && this.onKeyDown({ target: this, key: r });
    }
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
      activeColor: a,
      backgroundColor: s,
      backgroundColorActive: l,
      focused: o
    } = this, h = [], c = e.length - r + 1;
    this.scroll > c && (this.scroll = c), this.scroll < 0 && (this.scroll = 0);
    const { scroll: u } = this, f = e.substring(u, u + r).padEnd(r, " ").split("");
    for (let p = 0; p < f.length; p++) {
      const m = f[p], w = p + u === i && o;
      h.push(
        new v({
          value: m,
          color: w ? a : n,
          backgroundColor: w ? l : s,
          fontWeight: t
        })
      );
    }
    return new L({ data: [h] });
  }
}
class He extends se {
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
        origin: [n, a]
      },
      scene: {
        camera: s,
        runtime: {
          renderer: { width: l, height: o }
        }
      }
    } = this;
    s.x = e - n + r / 2 - l / 2, s.y = t - a + i / 2 - o / 2;
  }
}
class ue extends se {
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
    g(this, "simulateControlUp", () => {
      if (this.gameObject.paused) return;
      const {
        gameObject: { x: t, y: r }
      } = this;
      this.__tryToMoveToPosition(t, r - 1);
    });
    /**
     * Attempt to move `GameObject` down.
     */
    g(this, "simulateControlDown", () => {
      if (this.gameObject.paused) return;
      const {
        gameObject: { x: t, y: r }
      } = this;
      this.__tryToMoveToPosition(t, r + 1);
    });
    /**
     * Attempt to move `GameObject` left.
     */
    g(this, "simulateControlLeft", () => {
      if (this.gameObject.paused) return;
      const {
        gameObject: { x: t, y: r }
      } = this;
      this.__tryToMoveToPosition(t - 1, r);
    });
    /**
     * Attempt to move `GameObject` right.
     */
    g(this, "simulateControlRight", () => {
      if (this.gameObject.paused) return;
      const {
        gameObject: { x: t, y: r }
      } = this;
      this.__tryToMoveToPosition(t + 1, r);
    });
    ue.validateConfig(i);
    const { defaultControls: n = !0 } = i;
    n && scene.inputManager.addEventListener(this.handleInput.bind(this));
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
  handleInput(t) {
    if (!this.gameObject.paused && t.type === "keydown") {
      const {
        keys: { up: r, down: i, left: n, right: a }
      } = t;
      r && this.simulateControlUp(), i && this.simulateControlDown(), n && this.simulateControlLeft(), a && this.simulateControlRight();
    }
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
        height: a,
        origin: [s, l]
      },
      scene: { layerManager: o }
    } = this;
    if (n <= 1 && a <= 1) {
      const m = o.solidAtPosition(t, r);
      (!m || m.gameObject === i) && (i.x = t, i.y = r);
      return;
    }
    let h = !0;
    const c = t > i.x, u = t < i.x, f = r > i.y, p = r < i.y;
    if (c || u) {
      const m = i.y - l, w = m + a - 1;
      for (let b = m; b <= w; b++) {
        const x = c ? t + n - 1 - s : t - s, y = o.solidAtPosition(x, b);
        if (y && y.gameObject !== i) {
          h = !1;
          break;
        }
      }
    } else if (f || p) {
      const m = i.x - s, w = m + n - 1;
      for (let b = m; b <= w; b++) {
        const x = f ? r + a - 1 - l : r - l, y = o.solidAtPosition(b, x);
        if (y && y.gameObject !== i) {
          h = !1;
          break;
        }
      }
    }
    h && (i.x = t, i.y = r);
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
  constructor(e = v.fromString("#"), t) {
    if (!e || !(e instanceof v) && !(e instanceof L))
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
class ae {
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
    ae.validateConfig(e);
    const {
      label: t = "Unnamed Animation",
      animationFrames: r,
      speed: i = 12,
      loop: n = !1,
      repeatCount: a = 1,
      pingPong: s = !1
    } = e;
    this.label = t, this.animationFrames = r, this.speed = i, this.loop = n, this.repeatCount = a, this.pingPong = s;
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
class fe extends se {
  /**
   * Animate a `GameObject`.
   * @param {GameObject} gameObject The game object to append this behavior to.
   * @param {boolean} enabledByDefault Whether the Behavior starts out enabled. Default: `true`.
   * @param {Object} config The configuration for this `Animate`.
   * @param {Array<Animation>} config.animations The animations for this behavior.
   * @param {string} config.initialAnimation The label of the animation to start on.
   * @param {number} config.initialFrame The frame of the animation to start on.
   * @param {boolean} config.overwriteObjectRenderable Whether or not to force the GameObject's `renderable` property to return this `Animate` instance's `renderable` property. Default `false`.
   */
  constructor(e, t = !0, r) {
    super(e, t), fe.validateConfig(r);
    const {
      animations: i,
      initialFrame: n = 0,
      initialAnimation: a,
      overwriteObjectRenderable: s = !1
    } = r;
    this.animations = i, this.currentAnimationLabel = void 0, this.__rawCurrentAnimationFrameIndex = n, this.playing = !1, this.repeats = 0, this.speed = 0, s && this.__overwriteObjectRenderable(), a && (this.currentAnimation = a), this.currentAnimation && (this.playing = !0);
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
      if (!(t instanceof ae))
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
  Ge as AdvMath,
  fe as Animate,
  ae as Animation,
  Be as AnimationFrame,
  se as Behavior,
  oe as Box,
  de as Core,
  $ as Frame,
  D as GameObject,
  ce as Layer,
  $e as Menu,
  v as Pixel,
  L as PixelMesh,
  X as Scene,
  He as ScrollTo,
  te as Text,
  De as TextInput,
  ue as TopDownMovement,
  Le as __AudioManager,
  Ae as __Camera,
  Pe as __InputManager,
  Te as __LayerManager,
  je as __Noise,
  ne as __Renderer,
  Oe as __Sound,
  We as dataUtils,
  Se as default
};
