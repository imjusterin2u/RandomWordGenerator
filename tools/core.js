/* Word Slots core: word parts, meanings and joining rules.
   Shared by the page (inlined into index.html by tools/build.py)
   and by tools/realwords.js, which lists every possible spin so the
   real-word list can be generated from the same rules.

   Wilson parts and substeps follow the card config in
   imjusterin2u/word-battle-royale (js/config.js). */

const GROUPS = [
  // id, reel, label, short tag shown on the tile, on by default
  ['w3.1',  'prefix', 'Wilson 3.1 prefixes',  '3.1',  true],
  ['w3.2',  'prefix', 'Wilson 3.2 prefixes',  '3.2',  true],
  ['w5.1',  'prefix', 'Wilson 5.1 prefixes',  '5.1',  true],
  ['w5.5',  'prefix', 'Wilson 5.5 prefix',    '5.5',  true],
  ['num',   'prefix', 'Number prefixes',      'Number', true],
  ['grkP',  'prefix', 'Greek forms (front)',  'Greek', true],
  ['w2.4',  'base',   'Wilson 2.4 Latin bases', '2.4', true],
  ['w2.5',  'base',   'Wilson 2.5 Latin bases', '2.5', true],
  ['w4.1',  'base',   'Wilson 4.1 Latin bases', '4.1', true],
  ['free',  'base',   'Free bases',           'Free', true],
  ['grkB',  'base',   'Greek forms (middle)', 'Greek', true],
  ['w1.6',  'suffix', 'Wilson 1.6 suffixes',  '1.6',  true],
  ['w3.5',  'suffix', 'Wilson 3.5 suffixes',  '3.5',  true],
  ['w4.4',  'suffix', 'Wilson 4.4 suffix',    '4.4',  true],
  ['w6.1',  'suffix', 'Wilson 6.1 suffixes',  '6.1',  true],
  ['sci',   'suffix', 'Science endings',      'Science', true],
];

// [text, meaning, greek?]
const PARTS = {
  'w3.1': [['mid','middle'],['mis','wrong, badly'],['non','not'],['trans','across'],['un','not, opposite of']],
  'w3.2': [['ab','away from'],['ad','to, toward'],['con','with, together'],['com','with, together'],['ex','out'],
           ['ob','against, in the way'],['dis','not, apart'],['en','in, make'],['em','in, make'],
           ['in','in, or not'],['im','in, or not'],['sub','under']],
  'w5.1': [['co','together'],['de','down, away, remove'],['e','out'],['pre','before'],['pro','forward, for'],['re','again, back']],
  'w5.5': [['a','on, in, or not']],
  'num':  [['uni','one'],['mono','one',1],['bi','two'],['di','two',1],['tri','three'],['quad','four'],
           ['penta','five',1],['hexa','six',1],['octo','eight',1],['deca','ten',1],['centi','hundred'],
           ['kilo','thousand',1],['milli','thousand'],['semi','half'],['multi','many'],['poly','many',1]],
  'grkP': [['photo','light',1],['bio','life',1],['geo','earth',1],['micro','small',1],['tele','far',1],
           ['therm','heat',1],['hydro','water',1],['chron','time',1],['auto','self',1]],

  'w2.4': [['fess','admit, tell'],['gress','step'],['mand','order'],['mit','send'],['pel','push, drive'],
           ['pend','hang'],['press','push down'],['rupt','break'],['sent','feel'],['sist','stand'],
           ['stant','stand'],['sult','jump'],['tend','stretch'],['tent','stretch, hold'],['vent','come']],
  'w2.5': [['dict','say'],['duct','lead'],['fect','make, do'],['flect','bend'],['flict','strike'],
           ['ject','throw'],['lect','choose, read'],['pact','press, fasten'],['rect','straight, right'],
           ['sect','cut'],['spect','look'],['struct','build'],['tact','touch'],['tract','pull'],['vict','conquer']],
  'w4.1': [['clude','shut'],['fuse','pour, melt'],['pose','put, place'],['pute','think'],['quire','ask, seek'],
           ['scribe','write'],['spire','breathe'],['sume','take'],['vise','see'],['voke','call']],
  'free': [['act','do'],['test','try, check'],['help','aid'],['mend','fix'],['plant','grow, put in'],
           ['pack','bundle'],['lock','fasten'],['kind','nice; a type'],['hope','wish'],['use','put to work'],
           ['cut','slice'],['fill','make full'],['rest','relax, stop'],['sense','feel, know'],['form','shape']],
  'grkB': [['graph','write, draw',1],['scope','look, see',1],['meter','measure',1],['phone','sound',1],
           ['sphere','ball',1],['cyte','cell',1],['therm','heat',1]],

  'w1.6': [['s','more than one'],['es','more than one']],
  'w3.5': [['ed','already happened'],['ing','happening now']],
  'w4.4': [['ive','tending to']],
  'w6.1': [['able','can be done'],['en','made of; to make'],['er','one who; more'],['est','the most'],
           ['ish','sort of, like'],['or','one who'],['y','full of, like'],['ful','full of'],['less','without'],
           ['ly','in a ___ way'],['ment','act or result of'],['ness','state of being'],['ty','state of being']],
  'sci':  [['ic','like, having to do with'],['al','having to do with'],['ist','one who studies'],
           ['oid','shaped like'],['ism','belief, practice'],['logy','study of',1],['meter','measure',1],
           ['scope','look, see',1],['graph','write, record',1],['sphere','ball',1],['cyte','cell',1],['phobia','fear of',1]],
};

// Build part objects: { id, t, m, greek, group, reel, tag }
const ALL = [];
for (const [gid, reel, , tag] of GROUPS) {
  for (const [t, m, g] of PARTS[gid]) ALL.push({ id: reel + ':' + gid + ':' + t, t, m, greek: !!g, group: gid, reel, tag });
}
const BLANK = { prefix: { id: 'prefix:blank', t: '', m: '', reel: 'prefix', blank: true, group: 'blank' },
                suffix: { id: 'suffix:blank', t: '', m: '', reel: 'suffix', blank: true, group: 'blank' } };

const VOW = /^[aeiouy]/, CONS = /^[bcdfghjklmnpqrstvwxz]/;
const DOUBLE = new Set(['mit', 'pel', 'cut']);   // 1-1-1 endings that double before a vowel suffix

/* Join a prefix, base and suffix.
   Returns { word, segs:[{text, role}], notes:[string] }  (role: prefix | base | link | suffix) */
function join(p, b, s) {
  const notes = [];
  const segs = [];
  if (p && !p.blank) segs.push({ text: p.t, role: 'prefix' });

  let base = b.t;
  // Greek + Greek joins with a connecting o:  therm + meter → therm·o·meter
  if (p && !p.blank && p.greek && b.greek && /[^aeiou]$/.test(p.t) && CONS.test(base)) {
    segs.push({ text: 'o', role: 'link' });
    notes.push(`Greek forms join with a connecting <b>o</b>: ${p.t} + ${b.t} → ${p.t}<u>o</u>${b.t}`);
  }

  if (s && !s.blank) {
    if (b.greek && s.greek) {
      if (base.endsWith('e')) base = base.slice(0, -1);
      segs.push({ text: base, role: 'base' });
      if (/[^aeiou]$/.test(base) && CONS.test(s.t)) {
        segs.push({ text: 'o', role: 'link' });
        notes.push(`Greek forms join with a connecting <b>o</b>: ${b.t} + ${s.t} → ${base}<u>o</u>${s.t}`);
      }
    } else if (VOW.test(s.t) && base.endsWith('e')) {
      base = base.slice(0, -1);
      segs.push({ text: base, role: 'base' });
      notes.push(`Drop the <b>e</b> before a vowel suffix: ${b.t} + ${s.t} → ${base}${s.t}`);
    } else if (VOW.test(s.t) && DOUBLE.has(base)) {
      segs.push({ text: base + base.slice(-1), role: 'base' });
      notes.push(`Double the last letter before a vowel suffix: ${b.t} + ${s.t} → ${base}${base.slice(-1)}${s.t}`);
    } else segs.push({ text: base, role: 'base' });
    segs.push({ text: s.t, role: 'suffix' });
  } else segs.push({ text: base, role: 'base' });

  return { word: segs.map(x => x.text).join(''), segs, notes };
}

/* Chameleon prefixes: spellings the prefix often changes into before this base.
   Returns [{ word, how }] — the page only shows the ones that are real words. */
const ASSIM = { ad: 'a', ob: 'o', sub: 'su', in: 'i', con: 'co', com: 'co', ex: 'e', dis: 'di' };
function chameleons(p, b, s) {
  if (!p || p.blank || p.greek) return [];
  const out = [];
  const first = b.t[0];
  const tail = j => j.word.slice(p.t.length);   // base + suffix part as spelled after joining
  const rest = tail(join(p, b, s));
  if (ASSIM[p.t] && CONS.test(first) && p.t.slice(-1) !== first) {
    const np = ASSIM[p.t] + first;
    out.push({ word: np + rest, how: `${p.t}- changes to <b>${np}-</b> before ${first}` });
  }
  if (['in', 'con', 'en'].includes(p.t) && /^[bmp]/.test(first)) {
    const np = { in: 'im', con: 'com', en: 'em' }[p.t];
    out.push({ word: np + rest, how: `${p.t}- changes to <b>${np}-</b> before b, m or p` });
  }
  if (p.t === 'ex' && first === 's') out.push({ word: 'ex' + rest.slice(1), how: `ex- swallows the <b>s</b>: ex + ${b.t} → ex${b.t.slice(1)}` });
  const seen = new Set();
  return out.filter(o => o.word !== p.t + rest && !seen.has(o.word) && seen.add(o.word));
}

if (typeof module !== 'undefined') module.exports = { GROUPS, PARTS, ALL, BLANK, join, chameleons };
