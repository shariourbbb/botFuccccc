import sys
sys.stdout.reconfigure(encoding='utf-8', errors='replace')
with open('C:\\\\Users\\\\Ahmed\\\\Desktop\\\\PY-NODExxxx\\\\StudyMart-Bot\\\\bot.py', encoding='utf-8') as f:
    lines = f.readlines()
print('bot.py total lines:', len(lines))
for nm in ['check_status','post_init','handle_application_error','main']:
    print(nm)
