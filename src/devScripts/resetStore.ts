import fs from 'fs';
import path from 'path';

const inputPath = path.resolve(__dirname, '../../store.json');
const outputPath = path.resolve(__dirname, '../../devStore.json');

fs.readFile(inputPath, 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  fs.writeFile(outputPath, data, 'utf8', (err) => {
    if (err) {
      console.error(err);
    }
  });
});