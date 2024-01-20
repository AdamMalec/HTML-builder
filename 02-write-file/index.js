const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;

const filePath = path.join(__dirname, 'text.txt');
const ws = fs.createWriteStream(filePath, 'utf-8');

function sayBye() {
  console.log('Nice to meet you. Come again.');
  process.exit();
}

stdout.write('Hey, press the buttons, enter some info...\n');

stdin.on('data', (data) => {
  if (data.toString().toLowerCase().trim() === 'exit') {
    sayBye();
  }
  ws.write(data);
});

process.on('SIGINT', () => sayBye());
