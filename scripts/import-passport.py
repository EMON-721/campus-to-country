"""Import recovered static teaching materials; never reads browser/account stores."""
import json, shutil, pathlib, subprocess, hashlib
root=pathlib.Path('/workspace/sites/passport-source-recovery'); out=pathlib.Path('public/ielts-content');out.mkdir(exist_ok=True)
subprocess.run(['node','scripts/extract-passport.mjs',str(root)],check=True)
export=json.load(open('/tmp/passport-export.json'))
def write(name,data): (out/name).write_text(json.dumps(data,ensure_ascii=False))
for src,dst in [('vocabulary1000.json','vocabulary-1000.json'),('premium-vocabulary-full.json','vocabulary-full.json')]:write(dst,json.load(open(root/'lib'/src)))
notes=json.load(open(root/'public/legacy/skill-upload46-data.json'))
for n in notes:
 if n.get('diagram'):n['diagram']='/ielts-content/charts/'+pathlib.Path(n['diagram']).name
for n in export['LESSONS']:notes.append(dict(id='lesson-'+n['id'],skill=n['skill'].lower(),title=n['subskill'],question=n['english'],answer='\n\n'.join(str(n.get(k,'')) for k in ['bangla','strategy','example','mistake']),source='Original Passport Band skill lesson'))
for n in export['TRANSITION_NOTES46']:notes.append(dict(id='transition-'+str(n['page']),skill='writing',title=n['title'],question=n['text'],source='Uploaded transition notes · page '+str(n['page'])))
notes.append(dict(id='tense-chart',skill='grammar',title='12 tenses · English and Bangla',question='\n\n'.join(' · '.join(n) for n in export['TENSE_CHART46']),source='Original tense chart'))
for m in export['MOCK41']+export['extraMocks45']:
 for w in m['writing']:
  notes.append(dict(id=w['id'],skill='writing',title=m['title']+' · '+w['kind'],question=w['prompt']+'\n\n'+('\n'.join(' | '.join(map(str,r)) for r in w.get('rows',[]))),answer=w.get('model',''),grammar=w.get('plan',''),source='Original Passport Band practice set'))
 sp=m['speaking'];notes.append(dict(id=sp['id'],skill='speaking',title=m['title']+' · speaking parts 1–3',question='Part 1\n'+'\n'.join(sp['part1'])+'\n\nPart 2\n'+sp['part2']+'\n\nPart 3\n'+'\n'.join(sp['part3']),source='Original Passport Band speaking set'))
for u in export['UNITS45']:notes.append(dict(id=u['id'],skill=u['skill'].lower(),title=u['title'],question=u['concept']+'\n\n'+u['context']+'\n\n'+u['question'],answer=u['answer']+'\n\n'+u['explanation'],grammar=u['strategy']+'\n'+u['mistake'],source='Original Passport Band learning unit'))
for u in export['UPLOADED_PRACTICE46']:notes.append(dict(id=u['id'],skill='writing',title=u['title'],question=u['question'],source='Uploaded practice worksheet'))
write('notes.json',notes)
grammar=json.load(open(root/'lib/basic-grammar-course.json'))
for n in grammar['entries']:
 n['image']=n['image'].replace('/protected-basic-grammar/','/ielts-content/sheets/')
 for k in ['originalOcrText','originalTitle']:n.pop(k,None)
write('grammar.json',grammar)
shutil.copytree(root/'public/protected-basic-grammar',out/'sheets',dirs_exist_ok=True)
shutil.copytree(root/'public/legacy/skill-upload46-charts',out/'charts',dirs_exist_ok=True)
mocks={'reading':export['MOCK41'],'listening':export['LISTENING42'],'extra':export['extraMocks45'],'units':export['UNITS45'],'uploadedPractice':export['UPLOADED_PRACTICE46']}
for skill in ['reading','listening']:
 for mock in mocks[skill]:
  for part in mock[skill]:
   for q in part['questions']:
    q.pop('context',None)
    if q.get('audio'):
     asset=q['audio']; (out/'audio').mkdir(exist_ok=True)
     shutil.copy2(root/'public/legacy'/asset,out/'audio'/pathlib.Path(asset).name)
     q['audio']='/ielts-content/audio/'+pathlib.Path(asset).name
write('mocks.json',mocks)
write('provenance.json',{'sourceCommit':subprocess.check_output(['git','-C',str(root),'rev-parse','HEAD'],text=True).strip(),'vocabularyLists':[1000,3003],'uploadedSkillMaterials':159,'notesIncludingLessons':len(notes),'worksheets':len(grammar['entries']),'sources':grammar['sources'],'readingMocks':3,'listeningMocks':3,'handwriting':'Excluded from typed worksheet text; original source sheets available for reference.'})
print('Imported',len(notes),'notes,',len(grammar['entries']),'worksheets, both vocabulary lists and original mocks.')
