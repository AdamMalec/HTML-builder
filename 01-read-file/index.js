const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'text.txt');
const rs = fs.createReadStream(filePath, 'utf-8');

rs.on('readable', () => {
  const buffer = rs.read();
  if (buffer) process.stdout.write(buffer);
});
