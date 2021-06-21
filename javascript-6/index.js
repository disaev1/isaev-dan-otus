const fs = require('fs');
const generateSortedFile = require('./partSort');
const yargs = require('yargs');

const argv = yargs
  .option('inFile', {
    alias: 'i',
    description: 'Specify input file path',
    type: 'string',
  })
  .demandOption('inFile')
  .option('outFile', {
    alias: 'o',
    description: 'Specify output file path',
    type: 'string',
  })
  .demandOption('outFile')
  .help()
  .alias('help', 'h')
  .argv;


const maxPartSizeMb = 25;
const maxPartSize = maxPartSizeMb * 1024**2;


const inputFile = argv.inFile;
const outputFile = argv.outFile;

class SortedPartFileReader {
  constructor() {
    this.ended = false;
  }

  isEnded() {
    return this.ended;
  }

  init(filename) {
    this.reader = fs.createReadStream(filename);

    this.reader.on('end', () => {
      this.ended = true;
    });
  }

  pause() {
    this.reader.pause();
  }

  resume() {
    this.reader.resume();
  }
}

class PartInfo {
  constructor(start, end) {
    this.start = start;
    this.end = end;
    this.sortedFileReader = new SortedPartFileReader();
  }

  setNumbersChunk(chunk) {
    this.numbersChunk = new Uint32Array(chunk.buffer);
    this.currentIndex = 0;
  }

  clearData() {
    this.numbersChunk = null;
    this.currentIndex = 0;
  }

  getCurrentNumber() {
    return this.numbersChunk[this.currentIndex];
  }

  sortedFileReaderIsEnded() {
    return this.sortedFileReader.isEnded();
  }

  initSortedFileReader(filename) {
    this.sortedFileReader.init(filename);
  }
}

class PartsPool {
  constructor(count, maxPartSize, totalSize) {
    this.parts = new Array(count).fill(0).map((__, index, info) => {
      const start = index * maxPartSize;
      let end;
  
      if (index === info.length - 1) {
        end = totalSize;
      } else {
        end = (index * maxPartSize) + maxPartSize;
      }

      return new PartInfo(start, end);
    });
  }

  getSortedFilesReaders() {
    return this.parts.map(part => part.sortedFileReader);
  }

  get allSortedFilesReadersEnded() {
    return this.parts.every(part => {
      const reader = part.sortedFileReader;

      if (!reader) {
        return true;
      }

      return reader.isEnded();
    })
  }

  getInputPartFilename(index) {
    return `part${index + 1}.tmp`;
  }

  getSortedPartFilename(index) {
    return `part${index + 1}_sorted.tmp`;
  }

  getActiveParts() {
    return this.parts.filter(part => !part.sortedFileReaderIsEnded());
  }

  get activePartsAllFilled() {
    const activeParts = this.getActiveParts();

    return activeParts.every(item => item.numbersChunk);
  }

  async createPartsFiles() {
    await Promise.all(
        this.parts.map(async (item, index) => {
          return new Promise((resolve, reject) => {
            const reader = fs.createReadStream(inputFile, { encoding: null, start: item.start, end: item.end - 1 });
            const writer = fs.createWriteStream(this.getInputPartFilename(index));
            const pipe = reader.pipe(writer);

            pipe.on('error', reject);
            pipe.on('finish', resolve);
          });
          
        })
      );
  }

  async createSortedPartsFiles({ skipGeneration = false } = {}) {
    await Promise.all(this.parts.map(async (part, index) => {
      if (!skipGeneration)
       await generateSortedFile(this.getInputPartFilename(index), this.getSortedPartFilename(index));
      
      part.initSortedFileReader(this.getSortedPartFilename(index));
    }));
  }

  async mergeSortedParts() {
    this.outStream = fs.createWriteStream(outputFile);

    return new Promise(resolve => {
      this.outStream.on('finish', () => {
        resolve();
      });

      this.parts.forEach(part => {
        part.sortedFileReader.reader.on('end', () => {
          if (this.allSortedFilesReadersEnded) {
            this.outStream.end();
          }
        });

        part.sortedFileReader.reader.on('data', chunk => {
          const doIfActivePartsFilled = () => {
            const sumLength = this.parts.reduce((acc, part, index) => {
              if (part.sortedFileReader.isEnded()) {
                return acc;
              }
    
              return part.numbersChunk.length + acc;
            }, 0);
    
            let sumCounter = 0;
            const sumArray = new Uint32Array(sumLength);
    
            while (sumCounter < sumLength) {
              const minValuePartIndex = this.parts.reduce((acc, part, index) => {
                if (part.sortedFileReader.isEnded() || part.currentIndex >= part.numbersChunk.length) {
                  return acc;
                }
    
                const currentValue = part.getCurrentNumber();
                const previousValue = this.parts[acc].getCurrentNumber();
    
                if (currentValue < previousValue || !previousValue) {
                  return index;
                }
    
                return acc;
              }, 0);

              sumArray[sumCounter++] = this.parts[minValuePartIndex].getCurrentNumber();
              this.parts[minValuePartIndex].currentIndex++;
            }
    
            this.parts.forEach(part => {
              if (part.sortedFileReader.isEnded()) {
                return;
              }
    
              part.clearData();
              part.sortedFileReader.resume();
            });
    
            this.outStream.write(Buffer.from(sumArray.buffer));
    
            if (this.allSortedFilesReadersEnded) {
              this.outStream.end();
            }
          }
    
          if (!this.activePartsAllFilled) {
            part.setNumbersChunk(chunk);
            part.sortedFileReader.pause();
          }
    
          if (this.activePartsAllFilled) {
            doIfActivePartsFilled();
          }
        });
      });
    });
  }
}


async function main() {
  const inputFileStats = await fs.promises.stat(inputFile);
  const size = inputFileStats.size;
  const partsCount = Math.ceil(size / maxPartSize);
  const partsPool = new PartsPool(partsCount, maxPartSize, size);

  await partsPool.createPartsFiles();
  await partsPool.createSortedPartsFiles();
  await partsPool.mergeSortedParts();
};

main();
