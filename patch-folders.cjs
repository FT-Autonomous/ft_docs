const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// Customize how filenames are matched to folders
const categoryMap = {
  path: 'path-planning',
  control: 'control',
  hardware: 'hardware',
  simulation: 'simulation',
  perception: 'perception',
  state: 'state-estimation',
};

const baseDir = path.join(__dirname, 'src', 'content', 'departments');

// Loop through all .mdoc files in departments/
fs.readdirSync(baseDir).forEach(file => {
  if (!file.endsWith('.mdoc')) return;

  const fullPath = path.join(baseDir, file);
  const baseName = path.basename(file, '.mdoc').toLowerCase();

  // Match the filename to a category
  const category = Object.keys(categoryMap).find(key => baseName.includes(key));
  if (!category) {
    console.warn(`❌ Could not categorize: ${file}`);
    return;
  }

  const folderName = categoryMap[category];
  const folderPath = path.join(baseDir, folderName);
  const newFilePath = path.join(folderPath, file);

  // Read and update frontmatter
  const raw = fs.readFileSync(fullPath, 'utf8');
  const parsed = matter(raw);

  parsed.data.slug = `${folderName}/${baseName}`;
  if (!parsed.data.title) {
    parsed.data.title = baseName.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }

  // Create folder if needed and move file
  if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath);
  fs.writeFileSync(newFilePath, matter.stringify(parsed.content, parsed.data));
  fs.unlinkSync(fullPath);

  console.log(`✅ Moved ${file} → ${folderName}/, slug: ${parsed.data.slug}`);
});
