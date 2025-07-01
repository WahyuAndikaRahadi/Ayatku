import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
  const { postId } = req.query;

  if (!postId) {
    return res.status(400).json({ error: 'postId is required' });
  }

  if (req.method === 'GET') {
    try {
      const result = await pool.query(
        'SELECT * FROM blog_comments WHERE post_id = $1 ORDER BY created_at DESC',
        [postId]
      );
      res.status(200).json(result.rows);
    } catch (err) {
      console.error('Error fetching comments:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else if (req.method === 'POST') {
    const { commenterName, commentText } = req.body;
    if (!commenterName || !commentText) {
      return res.status(400).json({ error: 'Missing commenterName or commentText' });
    }

    try {
      const result = await pool.query(
        'INSERT INTO blog_comments (post_id, commenter_name, comment_text) VALUES ($1, $2, $3) RETURNING *',
        [postId, commenterName, commentText]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error('Error adding comment:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
