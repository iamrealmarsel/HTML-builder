const fs = require('fs');
const path = require('path');

class MyWebpack {
  constructor({ dist, assets, styles, components, htmlBundle, styleBundle }) {
    this.root = __dirname;
    this.dist = dist;
    this.assets = assets;
    this.styles = styles;
    this.components = components;
    this.htmlBundle = htmlBundle;
    this.styleBundle = styleBundle;
  }

  async removeAllFiles(dir) {
    const files = await fs.promises.readdir(dir, { withFileTypes: true });

    for (const file of files) {
      if (file.isFile()) {
        await fs.promises.unlink(path.join(dir, file.name));
      } else {
        await this.clearDirectory(path.join(dir, file.name));
      }
    }
  }

  async removeAllDirectories(dir) {
    const files = await fs.promises.readdir(dir, { withFileTypes: true });

    for (const file of files) {
      if (file.isDirectory()) {
        await this.removeAllDirectories(path.join(dir, file.name));
        await fs.promises.rmdir(path.join(dir, file.name));
      }
    }
  }

  async clearDirectory(dir) {
    await this.removeAllFiles(dir);
    await this.removeAllDirectories(dir);
  }

  async copyDirectory(src, dest) {
    const files = await fs.promises.readdir(src, { withFileTypes: true });

    for (const file of files) {
      if (file.isDirectory()) {
        await fs.promises.mkdir(path.join(dest, file.name));
        await this.copyDirectory(path.join(src, file.name), path.join(dest, file.name));
      } else {
        await fs.promises.copyFile(path.join(src, file.name), path.join(dest, file.name));
      }
    }
  }

  async parseDirectory(dir, ext) {
    const files = await fs.promises.readdir(dir, { withFileTypes: true });
    const result = {};

    for (const file of files) {
      if (file.isFile() && path.extname(file.name) === `.${ext}`) {
        const filename = path.basename(file.name, `.${ext}`);
        result[filename] = await this.parseFile(path.join(dir, file.name));
      }
    }

    return result;
  }

  parseFile(path) {
    return new Promise((resolve) => {
      let data = '';
      const readStream = fs.createReadStream(path, 'utf-8');
      readStream.on('data', (chunk) => (data += chunk));
      readStream.on('end', () => {
        resolve(data);
      });
    });
  }

  writeToFile(path, text) {
    const writeStream = fs.createWriteStream(path);
    writeStream.write(text);
  }

  async build() {
    await fs.promises.mkdir(path.join(this.root, this.dist), { recursive: true });

    let template = await this.parseFile(path.join(this.root, 'template.html'));
    const directoryHtmlContent = await this.parseDirectory(
      path.join(this.root, this.components),
      'html'
    );

    Object.entries(directoryHtmlContent).forEach(([key, value]) => {
      template = template.replaceAll(`{{${key}}}`, value);
    });

    this.writeToFile(path.join(this.root, this.dist, this.htmlBundle), template);

    const directoryCssContent = await this.parseDirectory(path.join(this.root, this.styles), 'css');
    const cssText = Object.values(directoryCssContent).join('\n');

    this.writeToFile(path.join(this.root, this.dist, this.styleBundle), cssText);

    await fs.promises.mkdir(path.join(this.root, this.dist, this.assets), { recursive: true });
    await this.clearDirectory(path.join(this.root, this.dist, this.assets));

    await this.copyDirectory(
      path.join(this.root, this.assets),
      path.join(this.root, this.dist, this.assets)
    );

    process.stdout.write(
      'Надеюсь уличная магия Дэвида Блейна сработала и проект собрался без ошибок :)\n'
    );
  }
}

const config = {
  dist: 'project-dist',
  assets: 'assets',
  styles: 'styles',
  components: 'components',
  htmlBundle: 'index.html',
  styleBundle: 'style.css',
};

const project = new MyWebpack(config);
project.build();
