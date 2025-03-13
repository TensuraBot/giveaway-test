// pages/api/sessions/[id].js
const { sessions } = require("../../../data");

export default function handler(req, res) {
  const { id } = req.query;
  if (req.method === "DELETE") {
    const { authorization } = req.headers;
    if (authorization !== "Bearer dev123") {
      return res.status(403).json({ error: "Unauthorized" });
    }
    if (!sessions[id]) {
      return res.status(404).json({ error: "Session not found" });
    }
    delete sessions[id];
    res.status(200).json({ message: "Session deleted" });
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
