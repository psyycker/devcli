const fs = require('fs');
const removeFilePatternRecursive = require('../remove-file-pattern-recursive')

jest.mock('fs');

describe('Testing of function removeFilePatternRecursivePathArray', () => {
  beforeEach(() => {
    fs.__resetMockFiles();
  })

  it('Should remove all node_modules folders', () => {
    fs.__addMockFile('test/test2/node_modules', true);
    fs.__addMockFile('test/test2/node_modules/file1', false);
    fs.__addMockFile('test/test2/node_modules/file2', false);
    fs.__addMockFile('test/test3/node_modules', true);
    fs.__addMockFile('test/test3/node_modules/file1', false);
    fs.__addMockFile('test/test3/node_modules/file2', false);

    const isFirstNull = fs.__getMockFile('test/test2/node_modules') == null;
    const isSecondNull = fs.__getMockFile('test/test3/node_modules') == null;

    expect(isFirstNull).toBe(false);
    expect(isSecondNull).toBe(false);
    removeFilePatternRecursive('test', 'node_modules');
    expect(fs.__getMockFile('test/test2/node_modules')).toBeUndefined();
    expect(fs.__getMockFile('test/test3/node_modules')).toBeUndefined();
  })

  it('Should remove all node_modules folders using regexp', () => {
    fs.__addMockFile('test/test2/node_modules', true);
    fs.__addMockFile('test/test2/node_modules/file1', false);
    fs.__addMockFile('test/test2/node_modules/file2', false);
    fs.__addMockFile('test/test3/node_modules', true);
    fs.__addMockFile('test/test3/node_modules/file1', false);
    fs.__addMockFile('test/test3/node_modules/file2', false);

    const isFirstNull = fs.__getMockFile('test/test2/node_modules') == null;
    const isSecondNull = fs.__getMockFile('test/test3/node_modules') == null;

    expect(isFirstNull).toBe(false);
    expect(isSecondNull).toBe(false);
    removeFilePatternRecursive('test', /node_modules/);
    expect(fs.__getMockFile('test/test2/node_modules')).toBeUndefined();
    expect(fs.__getMockFile('test/test3/node_modules')).toBeUndefined();
  })

  it('Should not remove anything', () => {
    fs.__addMockFile('test/test2/node_modules', true);
    fs.__addMockFile('test/test2/node_modules/file1', false);
    fs.__addMockFile('test/test2/node_modules/file2', false);
    fs.__addMockFile('test/test3/node_modules', true);
    fs.__addMockFile('test/test3/node_modules/file1', false);
    fs.__addMockFile('test/test3/node_modules/file2', false);

    const isFirstNull = fs.__getMockFile('test/test2/node_modules') == null;
    const isSecondNull = fs.__getMockFile('test/test3/node_modules') == null;

    expect(isFirstNull).toBe(false);
    expect(isSecondNull).toBe(false);
    removeFilePatternRecursive('test', 'randomString');
    expect(fs.__getMockFile('test/test2/node_modules')).not.toBeUndefined();
    expect(fs.__getMockFile('test/test3/node_modules')).not.toBeUndefined();
  })

})
