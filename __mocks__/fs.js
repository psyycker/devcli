// __mocks__/fs.js
'use strict';

const fs = jest.genMockFromModule('fs');

// This is a custom function that our tests can use during setup to specify
// what the files on the "mock" filesystem should look like when any of the
// `fs` APIs are used.
let mockFiles = [];

function __resetMockFiles() {
  mockFiles = [];
}

function findItemGenerator(name) {
  return function findItem(item) {
    return item.name === name;
  }
}

function __addMockFile(path, isDirectory, current) {
  if (current === undefined) {
    current = mockFiles;
  }
  if (typeof path === 'string') {
    __addMockFile(path.split('/'), isDirectory);
    return;
  }
  if (path.length === 1) {
    current.push({
      name: path[0],
      stats: {
        isDirectory: () => isDirectory
      },
      dir: isDirectory ? [] : undefined
    })
    return;
  }
  const currentPath = path[0];
  let currentFile = current.find(findItemGenerator(currentPath));
  if (currentFile == null) {
    currentFile = {
      name: currentPath,
      stats: {
        isDirectory: () => true
      },
      dir: []
    }
    current.push(currentFile)
  }
  __addMockFile(path.slice(1), isDirectory, currentFile.dir)
}

function __getMockFiles() {
  return mockFiles;
}

/**
 *
 * @param path in format 'file/subFile/subFile2
 * @param current
 * @private
 */
function __getMockFile(path, current = mockFiles) {
  if (typeof path === 'string') {
    return __getMockFile(path.split('/'));
  }
  const currentItem = current.find(findItemGenerator(path[0]))
  if (currentItem == null) {
    return undefined;
  }
  if (path.length === 1) {
    return currentItem;
  }
  if (currentItem.dir == null) {
    return undefined;
  }
  return __getMockFile(path.slice(1), currentItem.dir)
}

function __removeFile(path, current) {
  if (typeof path === 'string') {
    return __removeFile(path.split('/'));
  }
  if (path.length === 1) {
    if (current == null) {
      mockFiles = mockFiles.filter((item) => item.name !== path[0])
    } else {
      current.dir = current.dir.filter((item) => item.name !== path[0])
    }
    return;
  }
  let currentItem;
  if (current == null) {
    currentItem = mockFiles.find(findItemGenerator(path[0]))
  } else {
    currentItem = current.dir.find(findItemGenerator(path[0]))
  }
  if (currentItem.dir == null) {
    throw new Error('File does not exists')
  }
  __removeFile(path.slice(1), currentItem)
}

// A custom version of `readdirSync` that reads from the special mocked out
// file list set via __setMockFiles
function readdirSync(directoryPath) {
  return __getMockFile(directoryPath).dir.map(item => item.name)
}

function unlinkSync(directoryPath) {
  let itemToDelete = __getMockFile(directoryPath);
  if (itemToDelete == null) {
    throw new Error('Item ' + directoryPath + ' does not exists' )
  }
  if (itemToDelete.stats.isDirectory() === true) {
    throw new Error('This is a directory')
  }
  __removeFile(directoryPath);
}

function lstatSync(directoryPath) {
  const element = __getMockFile(directoryPath);
  return element.stats;
}

function rmdirSync(directoryPath) {
  let itemToDelete = __getMockFile(directoryPath);
  if (itemToDelete == null) {
    throw new Error('Item ' + directoryPath + ' does not exists' )
  }
  if (itemToDelete.stats.isDirectory() === false) {
    throw new Error('This is not a directory')
  }

  if (itemToDelete.dir.length > 0) {
    throw new Error('Directory is not empty')
  }
  __removeFile(directoryPath);
}

function existsSync(directoryPath) {
  return __getMockFile(directoryPath) != null;
}

fs.readdirSync = readdirSync;
fs.__addMockFile = __addMockFile;
fs.__getMockFiles = __getMockFiles;
fs.__getMockFile = __getMockFile;
fs.unlinkSync = unlinkSync;
fs.rmdirSync = rmdirSync;
fs.lstatSync = lstatSync;
fs.existsSync = existsSync;
fs.__resetMockFiles = __resetMockFiles
fs.statSync = lstatSync;

module.exports = fs;
