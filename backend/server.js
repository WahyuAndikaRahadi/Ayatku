// Memuat variabel lingkungan dari file .env
require('dotenv').config();
const express = require('express'); // Framework web untuk Node.js
const { Pool } = require('pg');     // Klien PostgreSQL untuk Node.js
const cors = require('cors');       // Middleware untuk mengizinkan permintaan lintas asal

const app = express();
// Mengatur port server, menggunakan variabel lingkungan PORT jika tersedia, jika tidak, gunakan 5000
const port = process.env.PORT || 5000;

// Konfigurasi koneksi database untuk Neon Postgres
const pool = new Pool({
    connectionString: process.env.DATABASE_URL, // Mengambil connection string dari .env
    ssl: {
        // 'rejectUnauthorized: false' diperlukan untuk koneksi ke Neon (untuk sertifikat SSL)
        rejectUnauthorized: false
    }
});

// Middleware
// Mengaktifkan CORS untuk mengizinkan permintaan dari domain frontend Anda
app.use(cors());
// Mengaktifkan parsing JSON untuk body permintaan HTTP
app.use(express.json());

// --- Rute API untuk Blog Posts (DIUPDATE DENGAN PREFIKS /api/) ---

/**
 * @route GET /api/posts
 * @description Mengambil semua postingan blog dari database, diurutkan berdasarkan tanggal dibuat terbaru.
 * (Rute disesuaikan untuk menyertakan '/api/')
 * @access Public
 */
app.get('/api/posts', async (req, res) => { // DIUBAH KEMBALI KE /api/posts
    try {
        const result = await pool.query('SELECT * FROM blog_posts ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching posts:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * @route POST /api/posts
 * @description Menambahkan postingan blog baru ke database.
 * (Rute disesuaikan untuk menyertakan '/api/')
 * @access Public
 * @body {string} title - Judul postingan blog.
 * @body {string} body - Isi postingan blog.
 * @body {string} authorName - Nama penulis postingan.
 * @body {string} [tags] - Tag postingan, dipisahkan koma (opsional).
 */
app.post('/api/posts', async (req, res) => { // DIUBAH KEMBALI KE /api/posts
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

// --- Rute API untuk Komentar Blog (DIUPDATE DENGAN PREFIKS /api/) ---

/**
 * @route GET /api/posts/:postId/comments
 * @description Mengambil semua komentar untuk postingan blog tertentu.
 * (Rute disesuaikan untuk menyertakan '/api/')
 * @access Public
 * @param {number} postId - ID dari postingan blog.
 */
app.get('/api/posts/:postId/comments', async (req, res) => { // DIUBAH KEMBALI KE /api/posts/:postId/comments
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

/**
 * @route POST /api/posts/:postId/comments
 * @description Menambahkan komentar baru ke postingan blog tertentu.
 * (Rute disesuaikan untuk menyertakan '/api/')
 * @access Public
 * @param {number} postId - ID dari postingan blog.
 * @body {string} commenterName - Nama komentator.
 * @body {string} commentText - Isi komentar.
 */
app.post('/api/posts/:postId/comments', async (req, res) => { // DIUBAH KEMBALI KE /api/posts/:postId/comments
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

// Memulai server untuk mendengarkan permintaan pada port yang ditentukan
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
