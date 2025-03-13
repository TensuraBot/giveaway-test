// data.js
const fs = require("fs");
const path = require("path");

const dataFilePath = path.join(process.cwd(), "data.json");

function readData() {
  try {
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
