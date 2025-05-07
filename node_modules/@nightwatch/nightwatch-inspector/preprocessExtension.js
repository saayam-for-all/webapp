const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const dir = 'dist';
const dirPath = path.join(__dirname, dir);

if (!fs.existsSync(dirPath)) {
  console.log(`⚠️ Warning: '${dirPath}' NOT found. Creating '${dirPath}' ...`);
  fs.mkdirSync(dirPath);
}

console.log('📂 Moving to src folder ...');
process.chdir('src');

console.log('🚀 Creating .crx file ...');

const archive = archiver('zip', { zlib: { level: 9 } });
const output = fs.createWriteStream(`../${dir}/extension.crx`);

archive.pipe(output);
archive.directory('.', false);
archive.finalize();

output.on('close', () => {
  console.log('✅ .crx file created successfully!');
});
