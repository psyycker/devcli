const fs = require('fs');
const deleteFolderRecursive = require('../delete-folder-recursive')

jest.mock('fs');

describe('Testing of delete a folder recursively', () => {

  beforeEach(() => {
    fs.__resetMockFiles();
  })

  it('Should throw an error by trying to delete the root folder', () => {
    expect(() => deleteFolderRecursive('/')).toThrow();
  })

  it('Should remove files', () => {
    fs.__addMockFile('test/test2/node_modules', true);
    fs.__addMockFile('test/test2/node_modules/file1', false);
    fs.__addMockFile('test/test2/node_modules/file2', false);
    fs.__addMockFile('test/test2/node_modules/file3', false);
    fs.__addMockFile('test/test2/node_modules/dir1', true);
    fs.__addMockFile('test/test2/node_modules/dir1/subFile', false);
    expect(fs.__getMockFile('test/test2/node_modules/file1')).not.toBeUndefined();
    expect(fs.__getMockFile('test/test2/node_modules')).not.toBeUndefined();
    expect(fs.__getMockFile('test/test2/node_modules/dir1')).not.toBeUndefined();
    deleteFolderRecursive('test/test2/node_modules')
    expect(fs.__getMockFile('test/test2/node_modules/file1')).toBeUndefined();
    expect(fs.__getMockFile('test/test2/node_modules')).toBeUndefined();
    expect(fs.__getMockFile('test/test2/node_modules/dir1')).toBeUndefined();
  })

  it('Should not do anything as file does not exists', () => {
    fs.__addMockFile('test/test2/node_modules', true);
    fs.__addMockFile('test/test2/node_modules/file1', false);
    fs.__addMockFile('test/test2/node_modules/file2', false);
    deleteFolderRecursive('test/test3')
    expect(fs.__getMockFile('test/test2/node_modules/file1')).not.toBeUndefined();
    expect(fs.__getMockFile('test/test2/node_modules/file2')).not.toBeUndefined();
    expect(fs.__getMockFile('test/test2/node_modules')).not.toBeUndefined();
    expect(fs.__getMockFile('test/test3')).toBeUndefined();
  })
})
