// data.js
const fs = require("fs");
const path = require("path");

// Gunakan direktori /tmp agar writable
const dataFilePath = path.join("/tmp", "data.json");

function initializeData() {
  if (!fs.existsSync(dataFilePath)) {
    const initialData = {
      sessions: {
        default: { id: "default", names: [] }
      }
    };
    fs.writeFileSync(dataFilePath, JSON.stringify(initialData, null, 2));
  }
}

function readData() {
  try {
    initializeData();
    const data = fs.readFileSync(dataFilePath, "utf8");
    return JSON.parse(data);
  } catch (err) {
    return { sessions: { default: { id: "default", names: [] } } };
  }
}

function writeData(data) {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
}

let data = readData();

function getSessions() {
  return data.sessions;
}

function saveData() {
  writeData(data);
}

module.exports = { getSessions, saveData, data };
