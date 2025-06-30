// Memuat variabel lingkungan dari file .env
require('dotenv').config();
const express = require('express'); // Framework web untuk Node.js
const { Pool } = require('pg');     // Klien PostgreSQL untuk Node.js
const cors = require('cors');       // Middleware untuk mengizinkan permintaan lintas asal

const app = express();
// Mengatur port server, menggunakan variabel lingkungan PORT jika tersedia, jika tidak, gunakan 5000
const port = process.env.PORT || 5000;

// Log saat serverless function dimulai
console.log('Serverless function backend/server.js starting...');
console.log('DATABASE_URL is set:', !!process.env.DATABASE_URL); // Cek apakah env var terbaca

// Konfigurasi koneksi database untuk Neon Postgres
const pool = new Pool({
    connectionString: process.env.DATABASE_URL, // Mengambil connection string dari .env
    ssl: {
        rejectUnauthorized: false
    }
});

// Middleware
app.use(cors());
app.use(express.json());

// Log setiap permintaan yang masuk
app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    next();
});

// --- Rute API untuk Blog Posts (TANPA PREFIKS /api/) ---

app.get('/posts', async (req, res) => {
    console.log('GET /posts hit!');
    try {
        const result = await pool.query('SELECT * FROM blog_posts ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching posts:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/posts', async (req, res) => {
    console.log('POST /posts hit!');
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
});

// --- Rute API untuk Komentar Blog (TANPA PREFIKS /api/) ---

app.get('/posts/:postId/comments', async (req, res) => {
    console.log(`GET /posts/${req.params.postId}/comments hit!`);
    const { postId } = req.params;
    try {
        const result = await pool.query(
            'SELECT * FROM blog_comments WHERE post_id = $1 ORDER BY created_at DESC',
            [postId]
        );
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching comments:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/posts/:postId/comments', async (req, res) => {
    console.log(`POST /posts/${req.params.postId}/comments hit!`);
    const { postId } = req.params;
    const { commenterName, commentText } = req.body;
    if (!commenterName || !commentText) {
        return res.status(400).json({ error: 'Commenter name and comment text are required' });
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
});

// Middleware penanganan 404 (jika tidak ada rute yang cocok)
app.use((req, res, next) => {
    console.warn(`404 Not Found: ${req.method} ${req.url}`);
    res.status(404).send('404: Not Found (from backend)');
});

// Middleware penanganan error umum
app.use((err, req, res, next) => {
    console.error('Unhandled backend error:', err);
    res.status(500).send('500: Internal Server Error (from backend)');
});

// Memulai server untuk mendengarkan permintaan pada port yang ditentukan
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
