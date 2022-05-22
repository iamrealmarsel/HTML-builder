const fs = require('fs');
const path = require('path');

let data = '';

const input = fs.createReadStream(path.join(__dirname, 'text.txt'), 'utf-8');

input.on('data', (chunk) => (data += chunk));
input.on('end', () => process.stdout.write(data));
