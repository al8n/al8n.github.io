import { mkdir, writeFile } from 'node:fs/promises';
import { profile, skills } from '../src/data/profile.ts';
import { experience } from '../src/data/experience.ts';
await mkdir('tmp', { recursive: true });
await writeFile('tmp/public-resume.json', JSON.stringify({ profile, skills, experience }, null, 2));
console.log('Exported shared public CV data.');
