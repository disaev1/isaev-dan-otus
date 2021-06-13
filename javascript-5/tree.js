const path = require('path');
const fs = require('fs');

function tree(dirName, dirPath, result) {
  const currentDir = path.resolve('.');

  result.folders.push(path.relative(currentDir, path.resolve(dirPath, dirName)));

  return new Promise((resolve, reject) => {
    fs.readdir(path.resolve(dirPath, dirName), { withFileTypes: true }, (err, entries) => {
      if (err) {
        reject(err);
        return;
      }

      Promise.all(
        entries.map(entry => {
          if (entry.isDirectory()) {
            return tree(entry.name, path.resolve(dirPath, dirName), result);
          } else {
            result.files.push(path.relative(currentDir, path.resolve(dirPath, dirName, entry.name)));
            
            return Promise.resolve();
          }
        })
      )
        .then(resolve);
    });
  });
}

module.exports = tree;
