import { readFileSync, readdirSync } from 'node:fs';
import { createRequire } from 'node:module';

const yaml = createRequire(import.meta.resolve('astro/package.json'))('yaml');
const content = new URL('../../src/content/', import.meta.url);
function load(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap(file => {
    const url = new URL(file.name, directory);
    if (file.isDirectory()) return load(new URL(`${file.name}/`, directory));
    if (!/\.mdx?$/.test(file.name)) return [];
    const source = readFileSync(url, 'utf8');
    return [{ data: yaml.parse(source.match(/^---\r?\n([\s\S]*?)\r?\n---/)[1]) }];
  });
}
export const collections = Object.fromEntries(['writing', 'projects', 'research', 'teaching'].flatMap(section => [
  [section, load(new URL(`${section}/`, content))],
  [`${section}Zh`, load(new URL(`${section}-zh/`, content))],
]));
