const fs = require('fs');
const path = require('path');

const output = fs.createWriteStream(path.join(__dirname, 'wishes.txt'));
process.stdout.write('Приветствую тебя, Student #1. Загадай три желания и я исполню их!\n');

process.stdin.on('data', (data) => {
  if (data.toString().trim() === 'exit') process.exit();

  output.write(data);
});

process.on('SIGINT', () => {
  process.exit();
});

process.on('exit', () => {
  process.stdout.write('\nАбракадабра, трах-тибидох, исполнено! Главное верить :)\n');
});
