# `AudioManager`

Controls audio playback.

---

## Constructor

`new AudioManager(runtime)`

### Arguments

-   `runtime` &mdash; `Runtime` The game's runtime object.

---

## Properties

### playing

Get all currently playing tracks.

---

## Methods

### `preload(src, label, onReady)`

Load an audio file to be played at a later time.

#### Arguments

-   `src` &mdash; `string` The URL of the audio file to preload.
-   `label` &mdash; `string` An identifier to use to play this audio later.
-   `onReady` &mdash; `function` An optional method to call when the audio file is ready to play. Passed the sound object.

### `unload(label, stop)`

Unload a preloaded audio file.

#### Arguments

-   `label` &mdash; `string` The identifier of the audio to unload.
-   `stop` &mdash; `boolean` Whether to stop the audio immediately. If `false`, the audio will be unloaded after playback has completed (if it is currently playing).

### `play(label, config)`

Play a preloaded audio file.

#### Arguments

-   `label` &mdash; `string` The identifier of the audio to play.
-   `config` &mdash; `Object` Playback configuration.

### `playNotPreloaded(src)`

Play a sound that has not been preloaded. (not recommended)

#### Arguments

-   `src` &mdash; `string` The URL of the audio file to play.
