# `Sound`

Manages loading and playback of an audio file.

---

## Constructor

```javascript
new Sound(audioManager, src, label, onReady);
```

### Arguments

-   `audioManager` &mdash; `AudioManager` The audio manager that will parent this Sound.
-   `src` &mdash; `string` The source of the audio.
-   `label` &mdash; `string` The unique label to identify this sound.
-   `onReady` &mdash; `function` An optional method to call when the audio file is ready to play. Passed the sound object.

---

## Methods

### `get playbackRate`

Get the audio's playback rate.

### `set playbackRate(value)`

Set the audio's playback rate.

### `get volume()`

Get the volume of playback.

### `set volume(value)`

Set the volume of playback.

#### Arguments

-   `value` &mdash; `number` The volume level to set. Must be between 0 and 1.

### `get playing()`

Get whether the audio is playing.

### `get muted()`

Get the mute state of the audio.

### `get loop()`

Get the loop value of the audio element.

### `set loop(value)`

Set the loop value of the audio element.

#### Arguments

-   `value` &mdash; `boolean` The loop state to set.

### `mute()`

Mute the audio without stopping playback.

### `play(config)`

Begin audio playback.

#### Arguments

-   `config` &mdash; `Object` Playback configuration data.
    -   `allowConcurrentPlayback` &mdash; `boolean` Whether to allow the sound to be played, even if it is already playing.
    -   `volume` &mdash; `number` Optionally overwrite the current volume level before playing.
    -   `loop` &mdash; `boolean` Whether to loop audio playback.

### `stop()`

Stop audio playback.
