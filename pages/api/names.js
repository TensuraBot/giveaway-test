// pages/api/names.js
const { sessions } = require("../../data");

export default function handler(req, res) {
  if (req.method === "GET") {
    // Mengambil sessionId dari query string
    const { sessionId } = req.query;
    if (!sessionId || !sessions[sessionId]) {
      return res.status(404).json({ error: "Session not found" });
    }
    res.status(200).json(sessions[sessionId].names);
  } else if (req.method === "POST") {
    const { sessionId, name } = req.body;
    if (!sessionId || !sessions[sessionId]) {
      return res.status(404).json({ error: "Session not found" });
    }
    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }
    sessions[sessionId].names.push(name);
    res.status(200).json({ message: "Name added" });
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
