// pages/api/names.js
const { getSessions, saveData, data } = require("../../data");

export default function handler(req, res) {
  if (req.method === "GET") {
    const { sessionId } = req.query;
    if (!sessionId || !data.sessions[sessionId]) {
      return res.status(404).json({ error: "Session not found" });
    }
    res.status(200).json(data.sessions[sessionId].names);
  } else if (req.method === "POST") {
    const { sessionId, name } = req.body;
    if (!sessionId || !data.sessions[sessionId]) {
      return res.status(404).json({ error: "Session not found" });
    }
    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }
    data.sessions[sessionId].names.push(name);
    saveData();
    res.status(200).json({ message: "Name added" });
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
