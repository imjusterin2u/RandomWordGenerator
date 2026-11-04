# Builds ../index.html (one self-contained file for GitHub Pages) from page.html + core.js + realwords.json.
# To change word parts: edit core.js, then run
#   node realwords.js > cands.json && python3 score.py cands.json 2.0 realwords.json && python3 build.py
import json, os
here = os.path.dirname(os.path.abspath(__file__))
page = open(os.path.join(here, 'page.html')).read()
core = open(os.path.join(here, 'core.js')).read()
real = json.load(open(os.path.join(here, 'realwords.json')))
out = page.replace('/*CORE*/', core).replace('/*REALWORDS*/', json.dumps(real, separators=(',', ':')))
open(os.path.join(here, '..', 'index.html'), 'w').write(out)
print('index.html', len(out), 'bytes,', len(real), 'real words')
