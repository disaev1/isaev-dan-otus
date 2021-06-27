const fs = require('fs');
const yargs = require('yargs');

const numbersCount = 1024 * 1024 * 25 // 100 Mb of 4-byte integers
const maxNumber = 1000; // Max randomly generated integer

const ws = fs.createWriteStream('random.bin');

const ar = new Uint32Array(numbersCount);

for (let i = 0; i < numbersCount; i++) {
  ar[i] = Math.round(Math.random() * maxNumber);
}

ws.write(Buffer.from(ar.buffer));
ws.close();
