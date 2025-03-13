// pages/api/sessions2.js
const { getSessions, saveData, data } = require("../../data");

export default function handler(req, res) {
  if (req.method === "GET") {
    res.status(200).json(Object.values(getSessions()));
  } else if (req.method === "POST") {
    const { authorization } = req.headers;
    if (authorization !== "Bearer dev123") {
      return res.status(403).json({ error: "Unauthorized" });
    }
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ error: "Session id required" });
    }
    if (data.sessions[id]) {
      return res.status(400).json({ error: "Session already exists" });
    }
    data.sessions[id] = { id, names: [] };
    saveData();
    res.status(200).json(data.sessions[id]);
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
