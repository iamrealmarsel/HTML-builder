const fs = require('fs/promises');
const path = require('path');

const folderSrc = path.join(__dirname, 'files');
const folderCopy = path.join(__dirname, 'files-copy');

function clearFolder(folder) {
  return fs.readdir(folder).then((fileNames) => {
    fileNames.forEach((fileName) => {
      fs.unlink(path.join(folder, fileName));
    });
  });
}

function copyDir(src, dest) {
  fs.mkdir(dest, { recursive: true }).then(() => {
    clearFolder(dest).then(() => {
      fs.readdir(src).then((fileNames) => {
        fileNames.forEach((fileName) => {
          fs.copyFile(path.join(src, fileName), path.join(dest, fileName));
        });
      });
    });
  });
}

copyDir(folderSrc, folderCopy);
