import { pathToFileURL } from 'url';
import path from 'path';
import fs from 'fs/promises';

const ipuDataPath = path.resolve('learnify', 'src', 'data', 'ipuData.js');

function normalize(s){
  return String(s||'').toLowerCase().replace(/[^a-z0-9]+/g,'');
}

async function main(){
  const mod = await import(pathToFileURL(ipuDataPath).href);
  const ipuBranches = mod.default;
  let changed = false;
  for(const b of ipuBranches){
    if(!b.semesters) continue;
    for(const sem of b.semesters){
      if(!sem.subjects) continue;
      for(const subj of sem.subjects){
        if(!subj.units) continue;
        for(const unit of subj.units){
          if(!unit.topics || !unit.title) continue;
          const before = unit.topics.length;
          unit.topics = unit.topics.filter(t => {
            if(!t || !t.title) return true;
            const ut = normalize(unit.title);
            const tt = normalize(t.title);
            return !(tt === ut || tt.includes(ut) || ut.includes(tt));
          });
          if(unit.topics.length !== before) changed = true;
        }
      }
    }
  }
  if(!changed){
    console.log('No head-topic entries found in ipuData.js');
    return;
  }
  // write back ipuData.js with minimal header
  const out = `/** Auto-generated ipuData (cleaned head-topic entries) */\n\nconst ipuBranches = ${JSON.stringify(ipuBranches, null, 2)}\n\nexport const getBranch = (id) => ipuBranches.find((b) => b.id === id)\n\nexport default ipuBranches\n`;
  await fs.writeFile(ipuDataPath, out, 'utf8');
  console.log('Updated', ipuDataPath);
}

main().catch(err => { console.error(err); process.exitCode = 1 });
