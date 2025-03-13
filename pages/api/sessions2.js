// pages/api/sessions2.js
import redis from '../../lib/upstash';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Ambil semua session ID dari set "sessions_list"
    const sessionIds = await redis.smembers('sessions_list');
    const sessions = [];
    for (const id of sessionIds) {
      const sessionStr = await redis.get(`session:${id}`);
      if (sessionStr) {
        sessions.push(JSON.parse(sessionStr));
      }
    }
    return res.status(200).json(sessions);
  } else if (req.method === 'POST') {
    // Hanya developer yang diizinkan (contoh: password dev123)
    const { authorization } = req.headers;
    if (authorization !== "Bearer dev123") {
      return res.status(403).json({ error: "Unauthorized" });
    }
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ error: "Session id required" });
    }
    // Cek apakah session sudah ada
    const exists = await redis.exists(`session:${id}`);
    if (exists) {
      return res.status(400).json({ error: "Session already exists" });
    }
    const newSession = { id, names: [] };
    await redis.set(`session:${id}`, JSON.stringify(newSession));
    await redis.sadd('sessions_list', id);
    return res.status(200).json(newSession);
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
