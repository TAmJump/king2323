# Bell SFX assets

Drop the Bell ringing sound files here:

- `bell_2323.mp3` — primary format (≤ 200 KB recommended, 3–10 sec)
- `bell_2323.ogg` — fallback for browsers that prefer Ogg Vorbis (optional but recommended)

The `play.html` page references both via:

```html
<audio id="bell-audio" preload="auto">
  <source src="assets/sounds/bell_2323.mp3" type="audio/mpeg">
  <source src="assets/sounds/bell_2323.ogg" type="audio/ogg">
</audio>
```

## How playback works

- Triggered automatically at the moment Bell rings (when `/game/bell-status`
  returns `phase: "phase1"` for the first time in this session).
- User can mute via the 🔔 toggle in `play.html`; preference persists in
  `localStorage.bell_sfx_enabled`.
- Will NOT play twice within the same Cycle (guarded by
  `localStorage.bell_last_played_cycle`).

## If files are missing

Browsers will simply log a 404 in the console and skip playback silently.
No game-breaking behavior — `play.html` keeps working without sound.
