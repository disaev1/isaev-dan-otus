const fs = require('fs');
const yargs = require('yargs');

const argv = yargs
.option('inFile', {
  alias: 'i',
  description: 'Specify input file path',
  type: 'string',
})
.demandOption('inFile')
.help()
.alias('help', 'h')
.argv;

async function getNumbersFromStream(s) {
  return new Promise(resolve => {
    s.on('readable', () => {
      const buf1 = s.read(40);
      const buf2 = Buffer.alloc(40);
      buf1.copy(buf2);
  
      s.close();
      resolve(new Uint32Array(buf2.buffer));
    });
  });
}

async function main() {
  const inputFile = argv.inFile;
  
  const inputFileStats = await fs.promises.stat(inputFile);
  const fileSize = inputFileStats.size;
  const start = fs.createReadStream(inputFile, { encoding: null, start: 0 });
  const mid = fs.createReadStream(inputFile, { encoding: null, start: Math.round(fileSize / 2) });
  const end = fs.createReadStream(inputFile, { encoding: null, start: fileSize - 40 });

  const [startNumbers, midNumbers, endNumbers] = await Promise.all([
    getNumbersFromStream(start),
    getNumbersFromStream(mid),
    getNumbersFromStream(end)
  ]);
  
  console.log({ startNumbers, midNumbers,endNumbers });
}

main();