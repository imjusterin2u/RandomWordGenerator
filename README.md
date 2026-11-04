# Word Slots

A morpheme slot machine. Three reels (prefix, base, suffix) build a word; the student decides whether it's a **real word**, a **could-be word** (follows the rules and can be defined from its parts), or **no way**.

Live page: https://imjusterin2u.github.io/RandomWordGenerator/

## Word parts
- Wilson prefixes, Latin bases and suffixes through Substep 6.2 (3.1, 3.2, 5.1, 5.5 prefixes; 2.4, 2.5, 4.1 Latin bases; 1.6, 3.5, 4.4, 6.1 suffixes), matching the Word Battle Royale card config
- Free bases, Greek forms, number prefixes and science endings
- Every group can be turned on or off under **Teacher**

## How it plays
- Pull the lever, tap SPIN or press Space. Hold a reel with its HOLD button or keys 1, 2, 3.
- Spelling rules are shown when they change the word: drop the e, doubling, Greek connecting o.
- Chameleon prefixes: if con + lect is spun, the page points out that it becomes **collect**.
- Coins: real word called right +10, could-be word defined +5, "no way" on a non-word +3.
- Notebook keeps invented words with their definitions, and real words found.
- Teacher can mark a word "real" when it isn't in the list; it's saved on that iPad.
- Everything saves on the device (no account or database).

## Editing word parts
`index.html` is built from `tools/`. Edit `tools/core.js`, then from `tools/`:

    node realwords.js > cands.json && python3 score.py cands.json 2.0 realwords.json && python3 build.py

The real-word list comes from the wordfreq English frequency list (`pip install wordfreq`), minus a blocklist in `score.py`.
