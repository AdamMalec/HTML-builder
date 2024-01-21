const fs = require('fs').promises;
const path = require('path');

const sourcePath = path.join(__dirname, 'files');
const copyPath = path.join(__dirname, 'files-copy');

async function copyDirectory() {
  try {
    await fs.rm(copyPath, { recursive: true, force: true });
    await fs.mkdir(copyPath);
    const files = await fs.readdir(sourcePath, { withFileTypes: true });

    files.forEach((file) => {
      const fileSourcePath = path.join(sourcePath, file.name);
      const fileCopyPath = path.join(copyPath, file.name);

      fs.copyFile(fileSourcePath, fileCopyPath);
    });
  } catch (err) {
    console.log(err);
  }
}

copyDirectory();
