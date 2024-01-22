const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

// source path variables
const sourceHtmlFilePath = path.join(__dirname, 'template.html');
const sourceComponentsFolderPath = path.join(__dirname, 'components');
const sourceAssetsFolderPath = path.join(__dirname, 'assets');
const sourceCssFolderPath = path.join(__dirname, 'styles');

// dist path variables
const distFolderPath = path.join(__dirname, 'project-dist');
const distHtmlFilePath = path.join(distFolderPath, 'index.html');
const distAssetsFolderPath = path.join(distFolderPath, 'assets');
const distCssFilePath = path.join(distFolderPath, 'style.css');

async function bundleHtml() {
  let htmlContent = await fsPromises.readFile(sourceHtmlFilePath, 'utf8');
  const htmlComponents = await fsPromises.readdir(sourceComponentsFolderPath, {
    withFileTypes: true,
  });

  for (const component of htmlComponents) {
    const componentPath = path.join(sourceComponentsFolderPath, component.name);
    const componentData = await fsPromises.readFile(componentPath, 'utf-8');

    htmlContent = htmlContent.replace(
      `{{${path.parse(componentPath).name}}}`,
      componentData,
    );
  }

  await fsPromises.writeFile(distHtmlFilePath, htmlContent);
}

async function bundleStyles() {
  const ws = fs.createWriteStream(distCssFilePath, 'utf-8');
  const files = await fsPromises.readdir(sourceCssFolderPath, {
    withFileTypes: true,
  });

  for (const file of files) {
    if (file.isFile() && path.extname(file.name) === '.css') {
      const filePath = path.join(sourceCssFolderPath, file.name);
      fs.readFile(filePath, 'utf-8', (err, fileData) => {
        if (err) console.log(err);
        ws.write(`${fileData}\n`);
      });
    }
  }
}

async function copyFolder(initPath, distPath) {
  // create new folder for copies 👇
  await fsPromises.mkdir(distPath);

  const files = await fsPromises.readdir(initPath, { withFileTypes: true });
  for (let file of files) {
    const assetsPath = path.join(initPath, file.name);
    const fileDistPath = path.join(distPath, file.name);
    if (file.isDirectory()) {
      await copyFolder(assetsPath, fileDistPath);
    } else {
      await fsPromises.copyFile(assetsPath, fileDistPath);
    }
  }
}

async function build() {
  await fsPromises.rm(distFolderPath, { recursive: true, force: true });
  await fsPromises.mkdir(distFolderPath);
  await bundleHtml();
  await bundleStyles();
  await copyFolder(sourceAssetsFolderPath, distAssetsFolderPath);
}

build();
