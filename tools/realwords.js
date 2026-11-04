// Lists every possible spin (and chameleon spelling) as JSON lines: {"w": word}
const { ALL, BLANK, join, chameleons } = require('./core.js');
const P = [BLANK.prefix, ...ALL.filter(x => x.reel === 'prefix')];
const B = ALL.filter(x => x.reel === 'base');
const S = [BLANK.suffix, ...ALL.filter(x => x.reel === 'suffix')];
const words = new Set();
for (const p of P) for (const b of B) for (const s of S) {
  words.add(join(p, b, s).word);
  for (const c of chameleons(p, b, s)) words.add(c.word);
}
console.log(JSON.stringify([...words]));
console.error(P.length, B.length, S.length, P.length*B.length*S.length, 'spins;', words.size, 'words');
