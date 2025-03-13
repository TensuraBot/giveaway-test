// pages/api/sessions2/[id].js
import redis from '../../../lib/upstash';

export default async function handler(req, res) {
  const { id } = req.query;
  if (req.method === 'DELETE') {
    const { authorization } = req.headers;
    if (authorization !== "Bearer dev123") {
      return res.status(403).json({ error: "Unauthorized" });
    }
    const exists = await redis.exists(`session:${id}`);
    if (!exists) {
      return res.status(404).json({ error: "Session not found" });
    }
    await redis.del(`session:${id}`);
    await redis.srem('sessions_list', id);
    return res.status(200).json({ message: "Session deleted" });
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
