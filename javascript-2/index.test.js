const container = document.getElementById('container');

it('getPath returns a correct selector', () => {
  const div = document.querySelector('#container .block-1 .to');

  expect(getPath(div)).to.equal('.block-1 > .to.fro');
});

it('getPath returns a unique selector', () => {
  const div = document.querySelector('#container .block-2:nth-child(3) .bar');

  expect(document.querySelectorAll(getPath(div)).length).to.equal(1);
});

it(`getContribution returns CSS selector contribution from the element in one of these forms (in priority):
id, concatenated classes or tag name`, () => {
  const block = document.querySelector('#container > .block-1');
  const item = document.querySelector('#container > .block-1 .to');

  expect(getContribution(block)).to.equal('.block-1');
  expect(getContribution(item)).to.equal('.to.fro');
  expect(getContribution(container)).to.equal('#container');
});

it(`getSiblingIndex returns the element's index among other siblings`, () => {
  const element = document.querySelector('.block-2 .bar:last-child');

  expect(getSiblingIndex(element)).to.equal(2);
});

it(`getCumulativeSelector returns correct selector`, () => {
  const cumulative = [
    { contribution: '.block-1', siblingIndex: 1 },
    { contribution: '.el', siblingIndex: 4 }
  ];

  expect(getCumulativeSelector(cumulative)).to.equal('.block-1:nth-child(2) > .el:nth-child(5)')
});