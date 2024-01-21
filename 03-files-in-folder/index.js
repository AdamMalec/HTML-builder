const fs = require('fs');
const path = require('path');

const folderPath = path.join(__dirname, 'secret-folder');

fs.readdir(folderPath, { withFileTypes: true }, (err, files) => {
  if (err) console.log(err);
  files.forEach((file) => {
    if (file.isFile()) {
      const filePath = path.join(folderPath, file.name);
      const fileExtension = path.extname(filePath).slice(1);
      const fileName = path.parse(filePath).name;

      fs.stat(filePath, (err, stats) => {
        if (err) console.log(err);
        const fileSize = stats.size;
        console.log(`${fileName} - ${fileExtension} - ${fileSize / 1000}kb`);
      });
    }
  });
});
