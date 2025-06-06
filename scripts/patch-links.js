import fs from 'fs';
import path from 'path';

const CONTENT_DIR = path.resolve('./src/content');

const collectionPrefixes = {
  departments: '/departments/',
  tutorials: '/tutorials/',
  equipment: '/equipment/',
  guidelines: '/guidelines/',
  resources: '/resources/'
};

function walk(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  return files.flatMap((file) => {
    const res = path.resolve(dir, file.name);
    if (file.isDirectory()) return walk(res);
    if (res.endsWith('.mdoc')) return [res];
    return [];
  });
}

function patchLinks(content, prefix) {
  // Match links like (/something) but not already starting with /departments/ etc.
  return content.replace(/\]\(\/(?!departments\/|tutorials\/|equipment\/|guidelines\/|resources\/)([^)]+)\)/g, `](${prefix}$1)`);
}

function processFile(filePath, collection) {
  const original = fs.readFileSync(filePath, 'utf8');
  const patched = patchLinks(original, collectionPrefixes[collection]);

  if (patched !== original) {
    fs.writeFileSync(filePath, patched, 'utf8');
    console.log(`✅ Patched: ${filePath}`);
  }
}

function main() {
  for (const [collection, prefix] of Object.entries(collectionPrefixes)) {
    const folder = path.join(CONTENT_DIR, collection);
    if (!fs.existsSync(folder)) continue;

    const files = walk(folder);
    for (const file of files) {
      processFile(file, collection);
    }
  }
}

main();
