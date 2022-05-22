const fs = require('fs');
const path = require('path');

fs.readdir(path.join(__dirname, 'secret-folder'), { withFileTypes: true }, (err, files) => {
  files.forEach((file) => {
    if (file.isFile()) {
      const filePath = path.join(__dirname, 'secret-folder', file.name);
      const fileInfo = path.parse(filePath);
      fs.promises.stat(filePath).then((stats) => {
        process.stdout.write(`${fileInfo.name} - ${fileInfo.ext.slice(1)} - ${stats.size}b \n`);
      });
    }
  });
});
