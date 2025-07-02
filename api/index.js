import express from 'express';
import pg from 'pg';
import cors from 'cors';
import dotenv from 'dotenv';

// Muat variabel lingkungan dari .env jika bukan di lingkungan produksi
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const { Pool } = pg;

const app = express();

// Konfigurasi koneksi database PostgreSQL menggunakan Pool
// Connection string diambil dari variabel lingkungan DATABASE_URL
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // Diperlukan untuk koneksi ke database di Vercel/Render (saat SSL diaktifkan)
    ssl: {
        rejectUnauthorized: false
    }
});

// Middleware
// Mengizinkan permintaan lintas domain (Cross-Origin Resource Sharing)
app.use(cors());
// Mengizinkan Express untuk membaca payload JSON dari permintaan
app.use(express.json());

// Middleware kustom untuk membersihkan URL masuk
// Ini mengatasi prefiks '/api/' yang mungkin ditambahkan oleh platform deployment
// dan parameter query '?path=' yang ditambahkan oleh Vercel
app.use((req, res, next) => {
    console.log(`Original Incoming request: ${req.method} ${req.url}`);

    // Hapus prefiks /api/ jika ada
    if (req.url.startsWith('/api/')) {
        req.url = req.url.substring(4); // Menghapus '/api'
    }

    // Hapus parameter query '?path=' jika ada
    const queryParamIndex = req.url.indexOf('?path=');
    if (queryParamIndex !== -1) {
        req.url = req.url.substring(0, queryParamIndex);
    }

    console.log(`Cleaned Request URL for Express: ${req.method} ${req.url}`);
    next();
});

// Middleware untuk mencatat setiap permintaan yang masuk (setelah pembersihan URL)
app.use((req, res, next) => {
    console.log(`Incoming request (after cleanup): ${req.method} ${req.url}`);
    next();
});

// --- Rute API untuk Blog Posts ---

// GET: Mengambil semua postingan blog, diurutkan berdasarkan tanggal terbaru
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

// POST: Menambahkan postingan blog baru
app.post('/posts', async (req, res) => {
    console.log('POST /posts hit!');
    const { title, body, authorName, tags } = req.body;
    // Validasi input: pastikan judul, isi, dan nama penulis tidak kosong
    if (!title || !body || !authorName) {
        return res.status(400).json({ error: 'Title, body, and author name are required' });
    }
    try {
        const result = await pool.query(
            'INSERT INTO blog_posts (title, body, author_name, tags) VALUES ($1, $2, $3, $4) RETURNING *',
            [title, body, authorName, tags || ''] // Tags bisa kosong
        );
        res.status(201).json(result.rows[0]); // Mengirim kembali postingan yang baru ditambahkan
    } catch (err) {
        console.error('Error adding post:', err);
        res.status(500).json({ error: 'Internal server error', details: err.message });
    }
});

// --- Rute API untuk Komentar Blog ---

// GET: Mengambil semua komentar untuk postingan tertentu
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

// POST: Menambahkan komentar baru ke postingan tertentu
app.post('/posts/:postId/comments', async (req, res) => {
    console.log(`POST /posts/${req.params.postId}/comments hit!`);
    const { postId } = req.params;
    const { commenterName, commentText } = req.body;
    // Validasi input: pastikan nama pemberi komentar dan teks komentar tidak kosong
    if (!commenterName || !commentText) {
        return res.status(400).json({ error: 'Commenter name and comment text are required' });
    }
    try {
        const result = await pool.query(
            'INSERT INTO blog_comments (post_id, commenter_name, comment_text) VALUES ($1, $2, $3) RETURNING *',
            [postId, commenterName, commentText]
        );
        res.status(201).json(result.rows[0]); // Mengirim kembali komentar yang baru ditambahkan
    } catch (err) {
        console.error('Error adding comment:', err);
        res.status(500).json({ error: 'Internal server error', details: err.message });
    }
});

// Middleware penanganan 404 (jika tidak ada rute yang cocok ditemukan)
app.use((req, res, next) => {
    console.warn(`404 Not Found: ${req.method} ${req.url}`);
    res.status(404).send('404: Not Found (from backend)');
});

// Middleware penanganan error umum (catch-all untuk error yang tidak tertangkap)
app.use((err, req, res, next) => {
    console.error('Unhandled backend error:', err);
    res.status(500).send('500: Internal Server Error (from backend)');
});

// Export aplikasi Express untuk penggunaan di Vercel/lainnya
export default app;

// Jalankan server hanya jika file ini dieksekusi secara langsung (bukan diimpor)
if (import.meta.url === (await import('url')).pathToFileURL(process.argv[1]).href) {
    const port = process.env.PORT || 5000;
    app.listen(port, () => {
        console.log(`Server Express berjalan di http://localhost:${port}`);
    });
}