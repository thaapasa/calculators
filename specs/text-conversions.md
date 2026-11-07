# Text conversions

A pipeline that runs input through a chain of steps, such as Base64 decode, then JSON
pretty, then SHA-256. Each step takes the output of the step before it. The data can be
text or binary at any point.

On the main page the card has one pipeline. On its own page the user can run several
pipelines side by side and store them as setups.

## Input

- [x] User can type or paste text as the input.
- [x] User can load a file as the input, by choosing it or dropping it on the input. The
      file is read in the browser as binary.
- [x] User can fetch a URL as the input. The browser fetches it directly, so the request
      goes only to that URL. If the fetch fails, the page shows why.
- [x] User can generate a random string or random bytes as the input, choose the length,
      and generate again.

## Steps

- [x] User can add a step from a list of operations grouped by category: display,
      encoding, text, format, hash and compression.
- [x] User can remove steps and reorder them by dragging.
- [x] Some steps have settings, such as the number of rotations for ROT-N or the indent
      for JSON pretty. The settings take effect at once.
- [x] Display steps show the data at that point in the chain without changing it, for
      example as text, a hex dump, an image or statistics.
- [x] If a step fails, it shows an error and passes its input on unchanged. The steps
      after it still run.
- [x] The pipeline runs again whenever the input or a step changes. If the chain has a
      slow step, such as bcrypt or Argon2, it waits until the user pauses typing.
- [x] Steps that need a key or a salt, such as HMAC and PBKDF2, can take it as text, hex,
      Base64, or the output of another pipeline on the same page.

## Output

- [x] The page shows the output of the last step, with its length in characters or
      bytes. If the last step fails, the page shows the output of the last step that
      worked.
- [x] User can copy the output to the clipboard or download it as a file.

## Several pipelines

These apply to the card on its own page.

- [x] User can add, rename and remove pipelines. The last pipeline cannot be removed.
- [x] User can store the current pipelines as a named setup, with their steps and
      settings but without their input.
- [x] User can load a stored setup, which replaces the current pipelines, and remove a
      stored setup.
- [x] Stored setups are kept in the browser and restored when the user comes back.
- [x] User can reset the page back to one empty pipeline.
