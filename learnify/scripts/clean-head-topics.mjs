import fs from 'fs/promises';
import path from 'path';

const dataDir = path.resolve('learnify', 'src', 'ipu', 'data');

const files = [
  'cse/sem1.json','cse/sem2.json','cse/sem3.json','cse/sem4.json','cse/sem5.json','cse/sem6.json','cse/sem7.json','cse/sem8.json',
  'bca/sem1.json','bca/sem2.json','aids/sem1.json','aids/sem2.json','it/sem1.json','it/sem2.json','mca/sem1.json','mca/sem2.json',
  'branches.json','cse/quizBank.json'
];

async function cleanFile(rel) {
  const p = path.join(dataDir, rel);
  try {
    const raw = await fs.readFile(p, 'utf8');
    const data = JSON.parse(raw);
    if (!Array.isArray(data)) return false;
    let changed = false;
    for (const subj of data) {
      if (!subj.units || !Array.isArray(subj.units)) continue;
      for (const unit of subj.units) {
        if (!unit.topics || !Array.isArray(unit.topics)) continue;
        const before = unit.topics.length;
        unit.topics = unit.topics.filter(topic => {
          if (!topic || !topic.title) return true;
          const normalize = s => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '');
          const ut = normalize(unit.title || '');
          const tt = normalize(topic.title || '');
          if (!ut || !tt) return true;
          // remove if exact match or one contains the other (catches concatenated headings)
          return !(tt === ut || tt.includes(ut) || ut.includes(tt));
        });
        if (unit.topics.length !== before) changed = true;
      }
    }
    if (changed) {
      await fs.writeFile(p, JSON.stringify(data, null, 2) + '\n', 'utf8');
      console.log('Cleaned:', rel);
    }
    return changed;
  } catch (err) {
    console.warn('Skip file', rel, err.message);
    return false;
  }
}

async function main() {
  let any = false;
  for (const f of files) {
    const changed = await cleanFile(f);
    any = any || changed;
  }
  if (!any) console.log('No head-topic matches found.');
}

main().catch(err => {
  console.error(err);
  process.exitCode = 1;
});
