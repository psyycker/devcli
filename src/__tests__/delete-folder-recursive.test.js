const fs = require('fs');
const deleteFolderRecursive = require('../delete-folder-recursive')

jest.mock('fs');

describe('Testing of delete a folder recursively', () => {
  it('Should throw an error by trying to delete the root folder', () => {
    expect(() => deleteFolderRecursive('/')).toThrow();
  })

  it('Should remove files', () => {
    // fs.__addMockFile('test/test2/myFile', false);
    fs.__addMockFile('test/test2/node_modules', true);
    fs.__addMockFile('test/test2/node_modules/file1', false);
    // fs.__addMockFile('test/test2/node_modules/file2', false);
    // fs.__addMockFile('test/test2/node_modules/file3', false);
    console.log(JSON.stringify(fs.__getMockFiles(), undefined, 2))
    // const result = fs.__getMockFile('test/test2/node_modules/file3')
    // console.log(result)
    // fs.unlinkSync('test/test2/node_modules/file3')
  })
})
