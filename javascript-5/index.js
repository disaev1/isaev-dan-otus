const path = require('path');
const tree = require('./tree');

const relPath = process.argv[2];

if (!relPath) {
  console.error('Please set the directory: -- <relative path>');
  process.exit(1);
}

const result = { files: [], folders: [] };
const currentDir = path.resolve('.');

tree(path.resolve(relPath), currentDir, result)
  .then(() => {
      result.files.sort();
      result.folders.sort();
      console.log(result);
    })
  .catch(err => {
    console.error(err);
  });
