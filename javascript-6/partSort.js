const fsPromises = require('fs/promises');
const mergeSort = require('./sort');


async function generateSortedFile(inputFile, outputFile) {
  const readFileHandle = await fsPromises.open(inputFile);
  const contents = await readFileHandle.readFile();
  const numbers = new Uint32Array(contents.buffer);
  const sortedNumbers = mergeSort(numbers);

  readFileHandle.close();

  const writeFileHandle = await fsPromises.open(outputFile, 'w');

  await writeFileHandle.write(Buffer.from(sortedNumbers.buffer));

  writeFileHandle.close();

  return outputFile;
}


module.exports = generateSortedFile;
