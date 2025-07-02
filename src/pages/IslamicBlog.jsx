import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';

// Komponen utama blog
const IslamicBlog = () => {
  // State untuk menyimpan postingan blog
  const [posts, setPosts] = useState([]);
  // State untuk menyimpan komentar, diorganisir berdasarkan judul postingan yang dinormalisasi
  const [comments, setComments] = useState({});
  // State untuk status loading saat mengambil data
  const [loading, setLoading] = useState(true);
  // State untuk pesan error jika terjadi masalah pengambilan data
  const [error, setError] = useState(null);
  // State untuk mengontrol tampilan formulir tambah artikel
  const [showAddArticleForm, setShowAddArticleForm] = useState(false);
  // State untuk data artikel baru yang akan ditambahkan
  const [newArticle, setNewArticle] = useState({
    title: '',
    body: '',
    authorName: '',
    tags: ''
  });
  // State untuk mengontrol tampilan formulir tambah komentar
  const [showAddCommentForm, setShowAddCommentForm] = useState(false);
  // State untuk data komentar baru yang akan ditambahkan
  const [newComment, setNewComment] = useState({
    postId: null, // ID postingan tempat komentar akan ditambahkan
    commenterName: '',
    commentText: ''
  });
  // State untuk melacak kapan komentar terakhir diambil
  const [lastCommentFetch, setLastCommentFetch] = useState(null);
  // State untuk melacak status pengiriman artikel (untuk menonaktifkan tombol)
  const [isSubmittingArticle, setIsSubmittingArticle] = useState(false);
  // State untuk melacak status pengiriman komentar (untuk menonaktifkan tombol)
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);


  // Fungsi utilitas untuk menormalisasi judul (mengubah ke huruf kecil dan menghapus spasi di awal/akhir)
  const normalizeTitle = (title) => {
    return title.trim().toLowerCase();
  };

  // Callback untuk mengambil komentar dari backend
  // PERHATIAN: Sekarang menerima 'currentPosts' sebagai argumen
  const fetchComments = useCallback(async (currentPosts, postId = null) => { // MENAMBAHKAN currentPosts sebagai parameter
    try {
      let commentsData = [];
      if (postId) {
        // Ambil komentar untuk postingan spesifik jika postId diberikan
        const response = await fetch(`/api/posts/${postId}/comments`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        commentsData = await response.json();
      } else {
        // Jika tidak ada postId, ambil komentar untuk semua postingan yang sudah ada
        // Menggunakan currentPosts yang DILEWATKAN sebagai argumen, bukan dari closure state
        const allCommentsPromises = currentPosts.map(p =>
          fetch(`/api/posts/${p.id}/comments`)
            .then(res => {
              if (!res.ok) throw new Error(`HTTP error! status: ${res.status} for post ${p.id}`);
              return res.json();
            })
            .then(data => ({ postId: p.id, comments: data }))
            .catch(err => {
              console.error(`Error fetching comments for post ${p.id}:`, err);
              return { postId: p.id, comments: [] }; // Kembalikan array kosong jika ada error
            })
        );
        const allCommentsResults = await Promise.all(allCommentsPromises);

        // Gabungkan semua komentar menjadi satu array datar
        commentsData = allCommentsResults.flatMap(item =>
          item.comments.map(comment => ({ ...comment, postId: item.postId }))
        );
      }

      const commentsMap = {};
      commentsData.forEach(comment => {
        // Temukan postingan yang sesuai untuk mengasosiasikan komentar
        const correspondingPost = currentPosts.find(p => p.id === comment.post_id || p.id === comment.postId); // Menggunakan currentPosts dari argumen
        if (correspondingPost) {
          const normalizedPostTitle = normalizeTitle(correspondingPost.title);
          if (!commentsMap[normalizedPostTitle]) {
            commentsMap[normalizedPostTitle] = [];
          }
          commentsMap[normalizedPostTitle].push({
            id: comment.id,
            author: {
              name: comment.commenter_name,
              avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.commenter_name)}&background=random`
            },
            text: comment.comment_text,
            createdAt: comment.created_at
          });
        }
      });

      // Urutkan komentar berdasarkan tanggal (terbaru dahulu)
      Object.keys(commentsMap).forEach(title => {
        commentsMap[title].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      });

      setComments(commentsMap);
      setLastCommentFetch(new Date()); // Perbarui waktu pengambilan terakhir
      return commentsMap;
    } catch (commentsErr) {
      console.error('Error fetching comments:', commentsErr);
      return null;
    }
  }, []); // <--- Dependency array sekarang KOSONG karena 'posts' dilewatkan sebagai argumen

  // Fungsi untuk menghasilkan warna acak untuk tag
  const getRandomColor = useCallback(() => { // Tambahkan useCallback jika ini dependency
    const colors = ['16a34a', '0891b2', '8b5cf6', 'ef4444', 'f59e0b', '6366f1', 'ec4899'];
    return colors[Math.floor(Math.random() * colors.length)];
  }, []); // Dependensi kosong karena tidak ada yang berubah

  // Fungsi untuk memuat data sampel jika pengambilan dari API gagal
  const loadSampleData = useCallback(() => { // Tambahkan useCallback untuk stabilitas
    const samplePosts = [
      {
        id: 1,
        title: "Pentingnya Shalat dalam Kehidupan Muslim",
        body: "Shalat merupakan tiang agama dan ibadah wajib bagi setiap muslim. Allah SWT berfirman dalam Al-Quran: \"Sesungguhnya shalat itu mencegah dari (perbuatan) keji dan mungkar.\" (QS. Al-Ankabut: 45).\n\nShalat lima waktu adalah kewajiban yang tidak boleh ditinggalkan dalam kondisi apapun selama seseorang masih sadar. Nabi Muhammad SAW pun menekankan pentingnya shalat hingga akhir hayat beliau.",
        created_at: "2023-11-15T07:30:00Z",
        author_name: "Ahmad Fadli",
        tags: "Ibadah, Fiqh"
      },
      {
        id: 2,
        title: "Akhlak dalam Pandangan Islam",
        body: "Akhlak memiliki posisi sangat penting dalam Islam. Rasulullah SAW diutus untuk menyempurnakan akhlak manusia. Beliau bersabda: \"Sesungguhnya aku diutus untuk menyempurnakan akhlak yang mulia.\" (HR. Ahmad).\n\nKaum muslimin diajarkan untuk memiliki akhlak yang baik terhadap Allah SWT, sesama manusia, dan seluruh makhluk. Dengan akhlak yang baik, seorang muslim dapat mencerminkan ajaran Islam yang rahmatan lil 'alamin.",
        created_at: "2023-11-10T09:15:00Z",
        author_name: "Fatimah Azzahra",
        tags: "Akhlak, Adab"
      }
    ];

    const sampleComments = {
      "pentingnya shalat dalam kehidupan muslim": [
        {
          id: 1,
          post_id: 1,
          commenter_name: "Abdullah",
          comment_text: "Jazakallah khair atas ilmunya, sangat bermanfaat",
          created_at: "2023-11-16T10:30:00Z"
        }
      ]
    };

    setPosts(samplePosts.map(post => ({
        ...post,
        author: { login: post.author_name, avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author_name)}&background=random` },
        labels: { nodes: post.tags.split(',').map(tag => ({ name: tag.trim(), color: getRandomColor() })) }
    })));
    setComments(sampleComments);
    setLoading(false);
  }, [getRandomColor]); // getRandomColor adalah dependensi loadSampleData

  // Fungsi untuk memformat tanggal
  const formatDate = useCallback((dateString) => { // Tambahkan useCallback untuk stabilitas
    if (!dateString) return '';

    if (dateString instanceof Date) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return dateString.toLocaleDateString('id-ID', options);
    }

    if (typeof dateString !== 'string') {
      try {
        dateString = String(dateString);
      } catch (e) {
        console.error('Cannot convert to string:', dateString);
        return '';
      }
    }

    try {
      let date;
      if (/^\d{10}$/.test(dateString) || /^\d{13}$/.test(dateString)) {
        date = new Date(parseInt(dateString) * (/^\d{10}$/.test(dateString) ? 1000 : 1));
      } else if (/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z?/.test(dateString) || dateString.includes('GMT') || dateString.includes('UTC')) {
          date = new Date(dateString);
      } else {
        date = new Date(dateString);
      }

      if (isNaN(date.getTime())) {
        console.error('Invalid date:', dateString);
        return dateString;
      }

      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return date.toLocaleDateString('id-ID', options);
    } catch (e) {
      console.error('Date parsing error:', e, 'Original input:', dateString);
      return dateString;
    }
  }, []); // Dependensi kosong

  // Fungsi untuk mengambil semua data (postingan dan komentar)
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Ambil postingan dari backend API
      const postsResponse = await fetch('/api/posts');
      if (!postsResponse.ok) {
        throw new Error(`HTTP error! status: ${postsResponse.status}`);
      }
      const postsData = await postsResponse.json();

      const processedPosts = postsData.map(post => ({
          id: post.id,
          title: post.title,
          body: post.body,
          created_at: post.created_at,
          author: {
              login: post.author_name,
              avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author_name)}&background=random`
          },
          labels: {
              nodes: post.tags ? post.tags.split(',').map(tag => ({
                  name: tag.trim(),
                  color: getRandomColor()
              })) : []
          }
      }));

      processedPosts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      setPosts(processedPosts); // Ini akan memicu re-render

      // Panggil fetchComments dengan 'processedPosts' yang baru saja diambil
      await fetchComments(processedPosts); // MELEWATKAN processedPosts ke fetchComments

      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      loadSampleData(); // Fallback ke data sampel jika pengambilan gagal
      setError('Gagal memuat artikel dari server. Menampilkan data sampel.');
      Swal.fire({
        title: 'Peringatan',
        text: 'Gagal memuat data dari server. Menampilkan data contoh sebagai fallback.',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: '#16a34a'
      });
    }
  }, [fetchComments, getRandomColor, loadSampleData]); // fetchData bergantung pada fetchComments (yang stabil), getRandomColor, dan loadSampleData

  // useEffect utama untuk memanggil fetchData saat komponen dimuat
  useEffect(() => {
    fetchData();
  }, [fetchData]); // Hanya bergantung pada fetchData (yang sudah stabil berkat useCallback)


  // Menangani klik tombol "Tulis Artikel" untuk menampilkan formulir
  const handleAddArticleClick = useCallback(() => {
    setShowAddArticleForm(true);
  }, []);

  // Menangani perubahan input di formulir artikel
  const handleArticleFormChange = useCallback((e) => {
    const { name, value } = e.target;
    setNewArticle(prev => ({ ...prev, [name]: value }));
  }, []);

  // Menangani pengiriman formulir artikel baru
  const handleArticleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setIsSubmittingArticle(true);
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newArticle),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! status: ${response.status}, details: ${errorData.error || 'Unknown error'}`);
      }

      const addedPost = await response.json();

      setPosts(prevPosts => {
        const updatedPosts = [
            {
                ...addedPost,
                author: { login: addedPost.author_name, avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(addedPost.author_name)}&background=random` },
                labels: { nodes: addedPost.tags ? addedPost.tags.split(',').map(tag => ({ name: tag.trim(), color: getRandomColor() })) : [] }
            },
            ...prevPosts
        ];
        return updatedPosts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      });

      setNewArticle({ title: '', body: '', authorName: '', tags: '' });
      setShowAddArticleForm(false);
      // Setelah menambahkan artikel, panggil fetchData untuk me-refresh semua data
      await fetchData(); // Menggunakan fetchData untuk me-refresh
      Swal.fire('Berhasil!', 'Artikel berhasil ditambahkan.', 'success');
    } catch (err) {
      console.error('Error submitting article:', err);
      Swal.fire('Gagal!', `Gagal menambahkan artikel: ${err.message}`, 'error');
    } finally {
      setIsSubmittingArticle(false);
    }
  }, [newArticle, fetchData, getRandomColor]); // Dependensi newArticle, fetchData, getRandomColor

  // Menangani klik tombol "Tambah Komentar" pada modal artikel
  const handleAddCommentClick = useCallback((postId) => {
    setNewComment({ postId, commenterName: '', commentText: '' });
    setShowAddCommentForm(true);
  }, []);

  // Menangani perubahan input di formulir komentar
  const handleCommentFormChange = useCallback((e) => {
    const { name, value } = e.target;
    setNewComment(prev => ({ ...prev, [name]: value }));
  }, []);

  // Menangani pengiriman formulir komentar baru
  const handleCommentSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!newComment.postId) return;
    setIsSubmittingComment(true);

    try {
      const response = await fetch(`/api/posts/${newComment.postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          commenterName: newComment.commenterName,
          commentText: newComment.commentText
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! status: ${response.status}, details: ${errorData.error || 'Unknown error'}`);
      }

      const addedComment = await response.json();

      const correspondingPost = posts.find(p => p.id === newComment.postId);
      if (correspondingPost) {
        const normalizedPostTitle = normalizeTitle(correspondingPost.title);
        setComments(prevComments => ({
          ...prevComments,
          [normalizedPostTitle]: [
            {
              id: addedComment.id,
              author: {
                name: addedComment.commenter_name,
                avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(addedComment.commenter_name)}&background=random`
              },
              text: addedComment.comment_text,
              createdAt: addedComment.created_at
            },
            ...(prevComments[normalizedPostTitle] || [])
          ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        }));
      }

      setNewComment({ postId: null, commenterName: '', commentText: '' });
      setShowAddCommentForm(false);
      Swal.fire('Berhasil!', 'Komentar berhasil ditambahkan.', 'success');
    } catch (err) {
      console.error('Error submitting comment:', err);
      Swal.fire('Gagal!', `Gagal menambahkan komentar: ${err.message}`, 'error');
    } finally {
      setIsSubmittingComment(false);
    }
  }, [newComment, posts, normalizeTitle]); // Dependensi newComment, posts, normalizeTitle

  // Fungsi untuk me-refresh komentar
  const refreshComments = useCallback(async (currentArticlePost = null) => {
    try {
      Swal.fire({
        title: 'Memuat Komentar',
        text: 'Sedang memperbarui data komentar...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      // Panggil fetchData untuk me-refresh semua postingan dan komentar
      await fetchData(); // Menggunakan fetchData untuk refresh semua data

      Swal.close();

      Swal.fire({
        title: 'Komentar Diperbarui',
        text: 'Data komentar telah berhasil diperbarui',
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#16a34a'
      }).then(() => {
        if (currentArticlePost) {
          handleReadMore(currentArticlePost);
        }
      });
    } catch (error) {
      console.error("Error refreshing comments:", error);
      Swal.fire({
        title: 'Error',
        text: 'Gagal memperbarui komentar. Silakan coba lagi.',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#16a34a'
      });
    }
  }, [fetchData, handleReadMore]); // fetchData dan handleReadMore adalah dependensi

  // Mengambil komentar untuk postingan tertentu (berdasarkan judul yang dinormalisasi)
  const getCommentsForPost = useCallback((post) => {
    const normalizedTitle = normalizeTitle(post.title);
    return comments[normalizedTitle] || [];
  }, [comments, normalizeTitle]);

  // Menangani klik tombol "Baca Selengkapnya" (menampilkan modal artikel)
  const handleReadMore = useCallback((post) => { // useCallback untuk handleReadMore
    try {
      const title = post.title || 'Artikel';
      const bodyContent = post.body || '';
      const postComments = getCommentsForPost(post);

      let commentsHTML = '';

      if (postComments.length > 0) {
        commentsHTML += '<div class="mt-6 pt-6 border-t border-gray-200">';
        commentsHTML += '<h3 class="text-lg font-bold mb-4">Komentar</h3>';

        postComments.forEach(comment => {
          commentsHTML += `
            <div class="mb-4 pb-4 border-b border-gray-100">
              <div class="flex items-center mb-2">
                <img src="${comment.author.avatarUrl}" alt="${comment.author.name}" class="w-8 h-8 rounded-full mr-2">
                <span class="font-medium">${comment.author.name}</span>
                <span class="text-gray-500 text-xs ml-2">${formatDate(comment.createdAt)}</span>
              </div>
              <p class="text-gray-700">${comment.text}</p>
            </div>
          `;
        });

        commentsHTML += '</div>';
      } else {
        commentsHTML += `
          <div class="mt-6 pt-6 border-t border-gray-200">
            <h3 class="text-lg font-bold mb-4">Komentar</h3>
            <p class="text-gray-500 italic">Belum ada komentar. Jadilah yang pertama berkomentar!</p>
          </div>
        `;
      }

      const actionButtons = `
        <div class="mt-4 text-center flex justify-center space-x-4">
          <button
            id="addCommentBtn"
            class="py-2 px-4 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
          >
            Tambah Komentar
          </button>
          <button
            id="refreshCommentsBtn"
            class="py-2 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Refresh Komentar
          </button>
        </div>
      `;

      const lastUpdateInfo = lastCommentFetch ?
        `<div class="text-center text-xs text-gray-500 mt-2">
          Komentar terakhir diperbarui: ${formatDate(lastCommentFetch)} ${new Date(lastCommentFetch).toLocaleTimeString('id-ID')}
        </div>` : '';

      Swal.fire({
        title: title,
        html: `
          <div class="text-left">
            ${bodyContent.replace(/\n/g, '<br>')}
            ${commentsHTML}
            ${actionButtons}
            ${lastUpdateInfo}
          </div>
        `,
        width: 800,
        showConfirmButton: true,
        confirmButtonText: 'Tutup',
        confirmButtonColor: '#16a34a',
        didOpen: () => {
          document.getElementById('addCommentBtn').addEventListener('click', () => {
            Swal.close();
            handleAddCommentClick(post.id);
          });

          document.getElementById('refreshCommentsBtn').addEventListener('click', () => {
            Swal.close();
            refreshComments(post);
          });
        }
      });
    } catch (error) {
      console.error('Error showing article:', error);
      Swal.fire('Error', 'Tidak dapat menampilkan artikel. Silakan coba lagi nanti.', 'error');
    }
  }, [getCommentsForPost, formatDate, lastCommentFetch, handleAddCommentClick, refreshComments]); // Dependensi

  // Tampilan loading saat data sedang diambil
  if (loading) {
    return (
      <div className="container-custom flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4 mx-auto border-t-primary animate-spin"></div>
          <h3 className="text-xl font-medium">Memuat Artikel</h3>
        </div>
      </div>
    );
  }

  // Tampilan error jika tidak ada postingan yang dimuat dan terjadi error
  if (error && posts.length === 0) {
    return (
      <div className="container-custom flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-2">Error</h2>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary mt-4"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  // Render utama komponen blog
  return (
    <div className="container-custom py-8">
      {/* Pesan error jika ada (misalnya, data sampel dimuat karena gagal fetch) */}
      {error && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2-2v-992zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Bagian judul dan deskripsi blog */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10 text-center"
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Artikel Islami</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Berbagi pemikiran, ilmu, dan pengalaman seputar Islam. Bergabunglah dalam artikel Islami dan berkontribusi untuk saling menginspirasi.
        </p>
      </motion.div>

      {/* Tombol Refresh Komentar dan Tulis Artikel */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 w-full">
        <button
          onClick={() => refreshComments()}
          className="btn-secondary flex items-center justify-center w-full sm:w-auto px-4 py-2 rounded"
        >
          <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh Komentar
        </button>

        <button
          onClick={handleAddArticleClick}
          className="btn-primary flex items-center justify-center w-full sm:w-auto px-4 py-2 rounded"
        >
          <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Tulis Artikel
        </button>
      </div>

      {/* Indikator Terakhir Diperbarui */}
      {lastCommentFetch && (
        <div className="text-center text-sm text-gray-500 mb-6">
          Komentar terakhir diperbarui: {formatDate(lastCommentFetch)} {new Date(lastCommentFetch).toLocaleTimeString('id-ID')}
        </div>
      )}

      {/* Formulir Tambah Artikel */}
      {showAddArticleForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md p-6 mb-8"
        >
          <h2 className="text-2xl font-bold mb-4">Tambah Artikel Baru</h2>
          <form onSubmit={handleArticleSubmit}>
            <div className="mb-4">
              <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">Judul Artikel:</label>
              <input
                type="text"
                id="title"
                name="title"
                value={newArticle.title}
                onChange={handleArticleFormChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="body" className="block text-gray-700 text-sm font-bold mb-2">Isi Artikel:</label>
              <textarea
                id="body"
                name="body"
                value={newArticle.body}
                onChange={handleArticleFormChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32 bg-white"
                required
              ></textarea>
            </div>
            <div className="mb-4">
              <label htmlFor="authorName" className="block text-gray-700 text-sm font-bold mb-2">Nama Penulis:</label>
              <input
                type="text"
                id="authorName"
                name="authorName"
                value={newArticle.authorName}
                onChange={handleArticleFormChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white"
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="tags" className="block text-gray-700 text-sm font-bold mb-2">Tag (pisahkan dengan koma):</label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={newArticle.tags}
                onChange={handleArticleFormChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white"
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmittingArticle}
              >
                {isSubmittingArticle ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Mengirim...
                  </span>
                ) : (
                  'Kirim Artikel'
                )}
              </button>
              <button
                type="button"
                onClick={() => setShowAddArticleForm(false)}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmittingArticle}
              >
                Batal
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Formulir Tambah Komentar */}
      {showAddCommentForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md p-6 mb-8"
        >
          <h2 className="text-2xl font-bold mb-4">Tambah Komentar</h2>
          <form onSubmit={handleCommentSubmit}>
            <div className="mb-4">
              <label htmlFor="commenterName" className="block text-gray-700 text-sm font-bold mb-2">Nama Anda:</label>
              <input
                type="text"
                id="commenterName"
                name="commenterName"
                value={newComment.commenterName}
                onChange={handleCommentFormChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="commentText" className="block text-gray-700 text-sm font-bold mb-2">Komentar:</label>
              <textarea
                id="commentText"
                name="commentText"
                value={newComment.commentText}
                onChange={handleCommentFormChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-24 bg-white"
                required
              ></textarea>
            </div>
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmittingComment}
              >
                {isSubmittingComment ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Mengirim...
                  </span>
                ) : (
                  'Kirim Komentar'
                )}
              </button>
              <button
                type="button"
                onClick={() => setShowAddCommentForm(false)}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmittingComment}
              >
                Batal
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Pesan jika tidak ada artikel ditemukan */}
      {posts.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <svg className="h-16 w-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-xl font-medium mb-2">Belum ada artikel yang ditemukan</h3>
          <p className="text-gray-600 mb-4">
            Jadilah yang pertama menulis artikel
          </p>
        </div>
      )}

      {/* Grid Postingan Blog */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => {
          const postComments = getCommentsForPost(post);
          const commentCount = postComments.length;

          return (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <img
                    src={post.author.avatarUrl}
                    alt={post.author.login}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <div>
                    <div className="font-medium text-gray-800">{post.author.login}</div>
                    <div className="text-gray-500 text-sm">{formatDate(post.created_at)}</div>
                  </div>
                </div>

                <h2 className="text-xl font-bold mb-3 text-gray-800 hover:text-green-600">
                  {post.title}
                </h2>

                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.body}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                 {/* Render tag */}
                 {post.labels.nodes.map((label, index) => (
                  <span
                    key={index}
                    className={`text-xs inline-block py-1 px-2.5 leading-none text-center whitespace-nowrap align-baseline font-medium rounded-full bg-opacity-90`}
                    style={{ backgroundColor: `#${label.color}`, color: 'white' }}
                  >
                    {label.name}
                  </span>
                ))}
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 flex items-center">
                    <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    {commentCount} Komentar
                  </span>

                  <button
                    onClick={() => handleReadMore(post)}
                    className="btn-sm-primary"
                  >
                    Baca Selengkapnya
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default IslamicBlog;