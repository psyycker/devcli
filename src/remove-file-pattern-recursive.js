const fs =  require('fs');
const deleteFolderRecursive = require('./delete-folder-recursive')

function removeFilePatternRecursivePathArray(array, pattern, path) {
  array.forEach((item) => {
    const subPath = path + '/' + item
    const stats = fs.statSync(subPath);
    if (item === pattern) {
      deleteFolderRecursive(subPath);
      return;
    }
    if (pattern instanceof RegExp && item.match(pattern)) {
      deleteFolderRecursive(subPath);
      return;
    }
    if (stats.isDirectory()) {
      const items = fs.readdirSync(subPath);
      removeFilePatternRecursivePathArray(items, pattern, subPath)
    }
  })
}

module.exports = function removeFilePatternRecursive (path, pattern) {
  const files = fs.readdirSync(path);
  removeFilePatternRecursivePathArray(files, pattern, path);
}
