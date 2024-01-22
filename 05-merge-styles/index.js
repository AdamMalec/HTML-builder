const fs = require('fs');
const path = require('path');

const sourcePath = path.join(__dirname, 'styles');
const bundleFilePath = path.join(__dirname, 'project-dist', 'bundle.css');

fs.readdir(sourcePath, { withFileTypes: true }, (err, files) => {
  if (err) console.log(err.message);

  files.forEach((file) => {
    if (file.isFile() && path.extname(file.name) === '.css') {
      const filePath = path.join(sourcePath, file.name);
      const rs = fs.createReadStream(filePath, 'utf-8');

      rs.on('readable', () => {
        const fileContent = rs.read();
        if (fileContent) {
          fs.appendFile(bundleFilePath, fileContent, (err) => {
            if (err) console.log(err);
          });
        }
      });
    }
  });
});
