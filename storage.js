const fs = require('fs');
const path = require('path');

function read(file, valid) {
  try { const value = JSON.parse(fs.readFileSync(file, 'utf8')); return valid(value) ? value : null; }
  catch { return null; }
}

function load(file, valid = Array.isArray) {
  // The primary is authoritative, including an explicitly emptied leaderboard.
  for (const suffix of ['', '.tmp', '.bak', '.previous']) {
    const value = read(file + suffix, valid);
    if (value !== null) return value;
  }
  if (['', '.tmp', '.bak', '.previous'].some(s => fs.existsSync(file + s))) {
    throw new Error('Uložená data jsou poškozená. Původní soubory byly zachovány pro obnovu.');
  }
  return null;
}

function durableWrite(file, text) {
  let fd;
  try {
    fd = fs.openSync(file, 'w');
    fs.writeFileSync(fd, text, 'utf8');
    fs.fsyncSync(fd);
  } finally { if (fd !== undefined) fs.closeSync(fd); }
}

function save(file, value, valid = Array.isArray) {
  if (!valid(value)) throw new Error('Neplatná data');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const old = load(file, valid); // Never overwrite all damaged copies with an empty board.
  if (old !== null) durableWrite(file + '.previous', JSON.stringify(old));
  const text = JSON.stringify(value, null, 1);
  durableWrite(file + '.tmp', text);
  fs.renameSync(file + '.tmp', file);
  // Independent, flushed copy of the latest committed state.
  durableWrite(file + '.bak.tmp', text);
  fs.renameSync(file + '.bak.tmp', file + '.bak');
  return true;
}

module.exports = { load, save };
