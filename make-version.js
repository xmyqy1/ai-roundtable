// 生成 version.json：node make-version.js "更新说明"
const fs = require('fs'); const path = require('path');
const root = __dirname;
const skip = new Set(['version.json', '.git', 'node_modules']);
const files = [];
(function walk(dir) {
  for (const n of fs.readdirSync(path.join(root, dir))) {
    if (skip.has(n) || n.startsWith('.')) continue;
    const rel = dir ? dir + '/' + n : n;
    if (fs.statSync(path.join(root, rel)).isDirectory()) walk(rel); else files.push(rel);
  }
})('');
const version = JSON.parse(fs.readFileSync(path.join(root, 'manifest.json'), 'utf8')).version;
fs.writeFileSync(path.join(root, 'version.json'), JSON.stringify({ version, notes: process.argv[2] || '', files }, null, 1));
console.log(version, files.length, 'files');
