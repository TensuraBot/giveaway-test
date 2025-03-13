// pages/api/sessions.js
const { sessions } = require("../../data");

export default function handler(req, res) {
  if (req.method === "GET") {
    // Mengembalikan seluruh session yang ada
    res.status(200).json(Object.values(sessions));
  } else if (req.method === "POST") {
    // Hanya developer yang boleh membuat session
    const { authorization } = req.headers;
    if (authorization !== "Bearer dev123") {
      return res.status(403).json({ error: "Unauthorized" });
    }
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ error: "Session id required" });
    }
    if (sessions[id]) {
      return res.status(400).json({ error: "Session already exists" });
    }
    sessions[id] = { id, names: [] };
    res.status(200).json(sessions[id]);
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
