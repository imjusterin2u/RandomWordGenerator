# Keep candidates that are real English words (wordfreq Zipf >= 2.0, about 1 per 10 million words or more),
# minus names, misspellings, word fragments and words not suited to a middle-school game.
import json, sys
from wordfreq import zipf_frequency as z
BLOCK = set('''actes adsense amit apel appel agressive couse covent cutty demeter dict fect fess filles mand mandal
mander mandy mendes mendy mit mits mitty pel pelly pels pender posen puter rect rectal spector struct sumer vict
vokes testes venter lecter lector sister spect mittal'''.split())
c = json.load(open(sys.argv[1]))
real = sorted({w for w in c if len(w) > 2 and w not in BLOCK and z(w, 'en') >= float(sys.argv[2])})
json.dump(real, open(sys.argv[3], 'w'))
print(len(real))
