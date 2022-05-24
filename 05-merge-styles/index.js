const fs = require('fs');
const path = require('path');

async function getCssPaths(folder) {
  const files = await fs.promises.readdir(folder, { withFileTypes: true });
  const paths = [];

  files.forEach((file) => {
    if (file.isFile() && path.extname(file.name) === '.css') {
      paths.push(path.join(folder, file.name));
    }
  });

  return paths;
}

function getStyles(paths) {
  const styles = paths.map((path) => {
    return parseFile(path);
  });

  return styles;
}

function parseFile(path) {
  return new Promise((resolve) => {
    let data = '';
    const readStream = fs.createReadStream(path, 'utf-8');
    readStream.on('data', (chunk) => (data += chunk));
    readStream.on('end', () => {
      resolve(data);
    });
  });
}

function createStyleBundle(path, data) {
  const writeStream = fs.createWriteStream(path);
  writeStream.write(data, () => {
    process.stdout.write('Ахалай-махалай, сим-салабим, бандл создан!\n');
  });
}

async function init() {
  const cssPaths = await getCssPaths(path.join(__dirname, 'styles'));
  const stylesPromises = getStyles(cssPaths);
  const styles = (await Promise.all(stylesPromises)).join('\n');

  createStyleBundle(path.join(__dirname, 'project-dist', 'bundle.css'), styles);
}

init();
