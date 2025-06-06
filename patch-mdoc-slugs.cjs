const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const contentDir = path.join(__dirname, 'src', 'content');
const collections = ['departments', 'equipment', 'guidelines', 'resources', 'tutorials'];

function toTitleCase(slug) {
  return slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase());
}

for (const folder of collections) {
  const dirPath = path.join(contentDir, folder);
  if (!fs.existsSync(dirPath)) continue;

  const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.mdoc'));

  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    const raw = fs.readFileSync(fullPath, 'utf-8');
    const { data, content } = matter(raw);

    const baseSlug = file.replace(/\.mdoc$/, '').replace(/ /g, '-').toLowerCase();
    const correctSlug = `${folder}/${baseSlug}`;
    const titleFromFilename = toTitleCase(baseSlug.split('/').pop());

    let changed = false;

    if (data.slug !== correctSlug) {
      data.slug = correctSlug;
      changed = true;
    }

    if (!data.title || typeof data.title !== 'string') {
      data.title = titleFromFilename;
      changed = true;
    }

    if (changed) {
      const updated = matter.stringify(content, data);
      fs.writeFileSync(fullPath, updated, 'utf-8');
      console.log(`✅ Patched: ${file} — title="${data.title}", slug="${data.slug}"`);
    }
  }
}
