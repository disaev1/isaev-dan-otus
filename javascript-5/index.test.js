import { expect } from 'chai';
import tree from './tree';

it('tree working correctly', (done) => {
  const expected = {
    files: [
      'javascript-5/test/d.txt',
      'javascript-5/test/a/b/e.ini',
      'javascript-5/test/a/b/mes.txt',
      'javascript-5/test/a/b/c/mes2.txt',
    ],
    folders: [
      'javascript-5/test',
      'javascript-5/test/a',
      'javascript-5/test/a/b',
      'javascript-5/test/a/b/c',
    ],
  };

  const result = { files: [], folders: [] };

  tree('javascript-5/test', '.', result)
    .then(() => {
      expect(result).to.eql(expected);
      done();
    });
});

it('tree fails when dir path does not exist', (done) => {
  const result = { files: [], folders: [] };

  tree('wrong', '.', result)
    .catch(err => {
      expect(err).to.exist;
      done();
    });
});
