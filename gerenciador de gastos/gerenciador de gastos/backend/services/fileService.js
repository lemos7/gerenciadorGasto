const fs = require('fs').promises;
const path = require('path');

const dataFile = path.resolve(__dirname, '../data/gastos.json');

async function ensureFile() {
  try {
    await fs.access(dataFile);
  } catch {
    await fs.mkdir(path.dirname(dataFile), { recursive: true });
    await fs.writeFile(dataFile, '[]', 'utf8');
  }
}

async function readData() {
  await ensureFile();
  const content = await fs.readFile(dataFile, 'utf8');
  return JSON.parse(content);
}

function backupName() {
  const now = new Date();
  const p = n => n.toString().padStart(2, '0');
  return `gastos_${now.getFullYear()}${p(now.getMonth() + 1)}${p(now.getDate())}_${p(now.getHours())}${p(now.getMinutes())}${p(now.getSeconds())}.json`;
}

async function writeData(data) {
  await ensureFile();
  const backupDir = path.resolve(__dirname, '../backup');
  await fs.mkdir(backupDir, { recursive: true });
  const backupPath = path.join(backupDir, backupName());
  await fs.copyFile(dataFile, backupPath).catch(() => {});
  await fs.writeFile(dataFile, JSON.stringify(data, null, 2), 'utf8');
}

module.exports = { readData, writeData }; 