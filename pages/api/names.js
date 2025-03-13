// pages/api/names.js
import redis from '../../lib/upstash';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { sessionId } = req.query;
    if (!sessionId) {
      return res.status(400).json({ error: "Session id required" });
    }
    const sessionStr = await redis.get(`session:${sessionId}`);
    if (!sessionStr) {
      return res.status(404).json({ error: "Session not found" });
    }
    const session = JSON.parse(sessionStr);
    return res.status(200).json(session.names);
  } else if (req.method === 'POST') {
    const { sessionId, name } = req.body;
    if (!sessionId || !name) {
      return res.status(400).json({ error: "Session id and name are required" });
    }
    const sessionStr = await redis.get(`session:${sessionId}`);
    if (!sessionStr) {
      return res.status(404).json({ error: "Session not found" });
    }
    const session = JSON.parse(sessionStr);
    session.names.push(name);
    await redis.set(`session:${sessionId}`, JSON.stringify(session));
    return res.status(200).json({ message: "Name added" });
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
