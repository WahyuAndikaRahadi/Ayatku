import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const result = await pool.query('SELECT * FROM blog_posts ORDER BY created_at DESC');
      res.status(200).json(result.rows);
    } catch (err) {
      console.error('Error fetching posts:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else if (req.method === 'POST') {
    const { title, body, authorName, tags } = req.body;
    if (!title || !body || !authorName) {
      return res.status(400).json({ error: 'Title, body, and author name are required' });
    }

    try {
      const result = await pool.query(
        'INSERT INTO blog_posts (title, body, author_name, tags) VALUES ($1, $2, $3, $4) RETURNING *',
        [title, body, authorName, tags || '']
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error('Error adding post:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
