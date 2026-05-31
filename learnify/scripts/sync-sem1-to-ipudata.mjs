import { pathToFileURL } from 'url';
import path from 'path';
import fs from 'fs/promises';

const ipuDataPath = path.resolve('src', 'data', 'ipuData.js');
const semPath = path.resolve('src', 'ipu', 'data', 'cse', 'sem1.json');

async function main(){
  const semRaw = await fs.readFile(semPath, 'utf8');
  const semData = JSON.parse(semRaw);

  const mod = await import(pathToFileURL(ipuDataPath).href);
  const ipuBranches = mod.default;

  const branch = ipuBranches.find(b => b.id === 'cse');
  if(!branch) throw new Error('cse branch not found in ipuData.js');

  const semester = branch.semesters.find(s => s.semNumber === 1);
  if(!semester) throw new Error('Semester 1 not found in ipuData.js for cse');

  // sync all subjects present in sem1.json into ipuData.js (normalize topic.content to strings)
  const semSubjects = Array.isArray(semData) ? semData : [];

  const normalizeTopic = (t) => {
    const topic = { ...t };
    const c = topic.content;
    if (c && typeof c === 'object') {
      if (Array.isArray(c.theory)) {
        topic.content = c.theory.join('\n\n');
      } else if (Array.isArray(c)) {
        topic.content = c.join('\n\n');
      } else {
        topic.content = JSON.stringify(c);
      }
    } else if (Array.isArray(c)) {
      topic.content = c.join('\n\n');
    } else if (typeof c === 'undefined') {
      topic.content = '';
    }
    return topic;
  };

  for (const semSubj of semSubjects) {
    const normalizedUnits = (semSubj.units || []).map((u) => ({
      ...u,
      topics: (u.topics || []).map(normalizeTopic),
    }));

    let subj = semester.subjects.find(s => s.id === semSubj.id);
    if (!subj) {
      subj = {
        id: semSubj.id,
        name: semSubj.name || semSubj.title || semSubj.id,
        subjectCode: semSubj.subjectCode || semSubj.code || semSubj.code || 'BAS-000',
        credits: semSubj.credits || 0,
        type: semSubj.type || 'theory',
        description: semSubj.description || '',
        units: normalizedUnits,
      };
      semester.subjects.push(subj);
    } else {
      subj.units = normalizedUnits;
    }
  }

  const out = `/** Auto-synced ipuData.js — units copied from src/ipu/data/cse/sem1.json */\n\nconst ipuBranches = ${JSON.stringify(ipuBranches, null, 2)}\n\nexport const getBranch = (id) => ipuBranches.find((b) => b.id === id)\n\nexport default ipuBranches\n`;

  await fs.writeFile(ipuDataPath, out, 'utf8');
  console.log('Updated', ipuDataPath);
}

main().catch(err => { console.error(err); process.exitCode = 1 });
