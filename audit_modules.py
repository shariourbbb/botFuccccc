import os, sys, re
import py2js as P

sys.stdout.reconfigure(encoding='utf-8', errors='replace')

ROOT = r'C:\Users\Ahmed\Desktop\PY-NODExxxx\StudyMart-Bot'
NODE = r'C:\Users\Ahmed\Desktop\PY-NODExxxx\StudyMart-Bot-Node'
TOOLS = r'C:\Users\Ahmed\Desktop\PY-NODExxxx\tools\py2js'

sys.path.insert(0, TOOLS)
import ast

SRC = open(os.path.join(ROOT, 'bot.py'), encoding='utf-8').read()
t = ast.parse(SRC)

byfile = {}
for name, absmod in P.BOT_FUNC_MODULE.items():
    byfile.setdefault(absmod, []).append(name)

outpath = []
outpath.append('=== SOURCE FUNCTION MAP ===')
outpath.append(f'Total top-level defs in bot.py: {len(byfile) + (1 if "handle_admin_callback" not in {v for vs in byfile.values() for v in vs} else 0)}')
outpath.append('')

# Also note handle_admin_callback (not in BOT_FUNC_MODULE)
hac_src = [n for n in t.body if isinstance(n,(ast.FunctionDef,ast.AsyncFunctionDef)) and n.name=='handle_admin_callback']
if hac_src:
    lo = getattr(hac_src[0],'lineno',0)
    hi = getattr(hac_src[0],'end_lineno',lo)
    outpath.append(f'handle_admin_callback: lines {lo}-{hi} (NOT yet in a module)')

outpath.append('')
outpath.append('=== MODULE COVERAGE AUDIT ===')

for absmod, names in sorted(byfile.items()):
    modfile = os.path.basename(absmod) if absmod.startswith('./') else absmod
    fpath = os.path.join(NODE, modfile)
    if not os.path.exists(fpath):
        out = [f'*** {modfile} *** FILE MISSING']
        outpath.extend(out)
        continue
    js = open(fpath, encoding='utf-8').read()
    have = set(re.findall(r'^(?:export\s+)?function\s+([A-Za-z_][A-Za-z0-9_]*)', js, re.M))
    # also catch const arrows
    have |= set(re.findall(r'^(?:export\s+)?const\s+([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(?:async\s+)?\([^)]*\)\s*=>', js, re.M))
    missing = [n for n in names if n not in have]
    if not missing:
        outpath.append(f'{modfile:25s} ALL {len(names)}/{len(names)} present')
    else:
        outpath.append(f'{modfile:25s} MISSING {len(missing)} of {len(names)}: {missing}')

out = '\n'.join(outpath)
print(out)
with open(os.path.join(NODE, 'module_audit.txt'), 'w', encoding='utf-8') as f:
    f.write(out + '\n')
