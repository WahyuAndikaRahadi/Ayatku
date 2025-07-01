// Memuat variabel lingkungan dari file .env (hanya untuk lokal)
// Note: dotenv tidak support ESM langsung untuk `.config()` di root,
// jadi kita akan gunakan cara impor dinamis atau pastikan package.json TIDAK ADA "type": "module"
// atau gunakan dotenv-cli (node -r dotenv/config your-script.js)
// Untuk kesederhanaan, jika Anda memiliki "type": "module", variabel lingkungan Vercel akan bekerja
// dan untuk lokal Anda bisa menjalankan `node -r dotenv/config api/index.js`

import express from 'express';
import pg from 'pg'; // import Pool from 'pg';
import cors from 'cors';
import dotenv from 'dotenv'; // Import dotenv untuk penggunaan lokal

// Jika tidak ada "type": "module" di package.json, gunakan dotenv secara langsung.
// Jika ada "type": "module", maka pastikan variabel env diatur di Vercel atau
// untuk lokal jalankan dengan `node -r dotenv/config api/index.js`
if (process.env.NODE_ENV !== 'production') {
  dotenv.config(); // Hanya jalankan dotenv.config() jika bukan di produksi
}


const { Pool } = pg; // Destructure Pool dari pg


const app = express();

// Konfigurasi koneksi database untuk Neon Postgres
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
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

// --- Rute API untuk Blog Posts ---
app.get('/posts', async (req, res) => {
    console.log('GET /posts hit!');
    try {
        const result = await pool.query('SELECT * FROM blog_posts ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching posts:', err);
        res.status(500).json({ error: 'Internal server error', details: err.message });
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
        res.status(500).json({ error: 'Internal server error', details: err.message });
    }
});

// --- Rute API untuk Komentar Blog ---
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
        res.status(500).json({ error: 'Internal server error', details: err.message });
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
        res.status(500).json({ error: 'Internal server error', details: err.message });
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

// Ekspor aplikasi Express untuk Vercel
export default app;

// Jalankan server HANYA jika file ini dieksekusi langsung secara lokal
// (bukan saat diimpor oleh Vercel atau sebagai modul lain)
if (import.meta.url === (await import('url')).pathToFileURL(process.argv[1]).href) {
    const port = process.env.PORT || 5000;
    app.listen(port, () => {
        console.log(`Server Express berjalan di http://localhost:${port}`);
    });
}