// __mocks__/fs.js
'use strict';

const path = require('path');

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

function addMockFileInPath(pathArray, file, current = mockFiles) {
  const currentPath = pathArray[0];
  if (currentPath === file.name) {
    current.push(file);
    return;
  }
  if (current.find(findItemGenerator(currentPath)) == null) {
    current.push({
      name: currentPath,
      stats: {
        isDirectory: () => true
      },
      dir: []
    })
  }
  addMockFileInPath(pathArray.slice(1), file, current.find(findItemGenerator(currentPath)).dir);
}

function __addMockFile(path, isDirectory, current = mockFiles) {
  if (typeof path === 'string') {
    __addMockFile(path.split('/'), isDirectory);
    return;
  }
  if (path.length === 0) {
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
  __addMockFile(path.slice(1), currentFile.dir)

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

function __removeFile(path, current = mockFiles) {
  if (typeof path === 'string') {
    return __removeFile(path.split('/'));
  }
  const currentItem = current.find(findItemGenerator(path[0]))
  if (path.length === 1) {
    console.log(current);
    return;
  }
  if (currentItem.dir == null) {
    throw new Error('File does not exists')
  }
  __removeFile(path.slice(1), currentItem.dir)
}

// A custom version of `readdirSync` that reads from the special mocked out
// file list set via __setMockFiles
function readdirSync(directoryPath) {
  return mockFiles[directoryPath] || [];
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

fs.readdirSync = readdirSync;
fs.__addMockFile = __addMockFile;
fs.__getMockFiles = __getMockFiles;
fs.__getMockFile = __getMockFile;
fs.unlinkSync = unlinkSync;

module.exports = fs;
