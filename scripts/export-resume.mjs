import { mkdir, writeFile } from 'node:fs/promises';
import { profile, skills } from '../src/data/profile.ts';
import { experience } from '../src/data/experience.ts';
import { featured } from '../src/data/projects.ts';
await mkdir('tmp', { recursive: true });
await writeFile('tmp/public-resume.json', JSON.stringify({ profile, skills, experience, projects: featured }, null, 2));
console.log('Exported shared public CV data.');
