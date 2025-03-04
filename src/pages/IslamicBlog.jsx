import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import Swal from 'sweetalert2';

// Google configuration
const GOOGLE_SHEET_ID = '1L1IhSAiVgGLN6hspPVSJ9gzTxTKRzNyQJfupIs0PFGw';
const GOOGLE_SHEET_TAB_NAME = 'DataArtikel';
const GOOGLE_FORM_URL = 'https://forms.gle/HAQhE7oSPvkzaz4dA';

// Konfigurasi untuk komentar
const COMMENT_FORM_ID = '1FAIpQLScTWPdpsFkbKthbJI7LSFDlSu2RM1QGkNi3xmi2ZGFsAio3CA'; 
const COMMENT_SHEET_ID = '1L1IhSAiVgGLN6hspPVSJ9gzTxTKRzNyQJfupIs0PFGw'; 
const COMMENT_SHEET_TAB = 'DataKomentar';

// Entry IDs for comment form (pastikan ini sesuai dengan ID di form Google)
const ENTRY_ID_FOR_TITLE = '1894675344'; // ID untuk field judul artikel
const ENTRY_ID_FOR_NAME = '559272181';   // ID untuk field nama komentator
const ENTRY_ID_FOR_COMMENT = '1321687060'; // ID untuk field komentar

// Using public CORS proxies to bypass CORS restrictions
const CORS_PROXY = 'https://api.cors.lol/?url=';

// URLs for Google Sheets with CORS proxy
const SHEET_CSV_URL = `${CORS_PROXY}${encodeURIComponent(`https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${GOOGLE_SHEET_TAB_NAME}`)}`;
const COMMENT_CSV_URL = `${CORS_PROXY}${encodeURIComponent(`https://docs.google.com/spreadsheets/d/${COMMENT_SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${COMMENT_SHEET_TAB}`)}`;

const IslamicBlog = () => {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [titleMapping, setTitleMapping] = useState({}); // Track title variants
  const [lastCommentFetch, setLastCommentFetch] = useState(null); // Track when comments were last fetched
  
  // Improved CSV parser that handles quoted values correctly
  const parseCSVRow = (row) => {
    const result = [];
    let insideQuote = false;
    let currentValue = '';
    
    for (let i = 0; i < row.length; i++) {
      const char = row[i];
      
      if (char === '"') {
        // Toggle inside quote flag, but only add quote to value if it's escaped
        if (i + 1 < row.length && row[i + 1] === '"') {
          currentValue += '"';
          i++; // Skip next quote
        } else {
          insideQuote = !insideQuote;
        }
      } else if (char === ',' && !insideQuote) {
        result.push(currentValue);
        currentValue = '';
      } else {
        currentValue += char;
      }
    }
    
    // Add the last value
    result.push(currentValue);
    
    return result;
  };
  
  // Normalize title for consistent matching
  const normalizeTitle = (title) => {
    return title.trim().toLowerCase();
  };
  
  // Function to fetch comments - made reusable and separate
  const fetchComments = useCallback(async () => {
    try {
      const commentsResponse = await axios.get(COMMENT_CSV_URL);
      console.log('Comments data fetched:', commentsResponse.data);
      
      // Parse CSV data for comments
      const commentsRows = commentsResponse.data.split('\n');
      const commentsHeaders = parseCSVRow(commentsRows[0]);
      
      const commentsMap = {};
      
      // Start from index 1 to skip headers
      for (let i = 1; i < commentsRows.length; i++) {
        if (commentsRows[i].trim()) {
          const values = parseCSVRow(commentsRows[i]);
          
          // Create a map for easier field access
          const commentFieldMap = {};
          commentsHeaders.forEach((header, index) => {
            commentFieldMap[header.trim()] = values[index] || '';
          });
          
          // Debug log
          console.log(`Comment row ${i} field map:`, commentFieldMap);
          
          // Look for various possible field names
          const articleTitle = 
            commentFieldMap['Judul Artikel'] ||
            commentFieldMap['Pilih Judul Artikel'] || 
            values[commentsHeaders.findIndex(h => h.includes('Judul') || h.includes('judul'))] || 
            '';
            
          const commenterName = 
            commentFieldMap['Nama Komentator'] || 
            commentFieldMap['Nama'] || 
            values[commentsHeaders.findIndex(h => h.includes('Nama'))] || 
            'Anonim';
            
          const commentText = 
            commentFieldMap['Komentar'] || 
            commentFieldMap['Isi Komentar'] || 
            values[commentsHeaders.findIndex(h => h.includes('Komentar') || h.includes('komentar'))] || 
            '';
            
          const commentTime = 
            commentFieldMap['Timestamp'] || 
            values[0] || // Usually timestamp is the first column
            new Date().toISOString();
          
          if (articleTitle) {
            // Use normalized title as the key for comments
            const normalizedCommentTitle = normalizeTitle(articleTitle);
            if (!commentsMap[normalizedCommentTitle]) {
              commentsMap[normalizedCommentTitle] = [];
            }
            
            commentsMap[normalizedCommentTitle].push({
              id: `comment-${i}`,
              author: {
                name: commenterName,
                avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(commenterName)}&background=random`
              },
              text: commentText,
              createdAt: commentTime
            });
          }
        }
      }
      
      // Sort comments by timestamp (newest first)
      Object.keys(commentsMap).forEach(title => {
        commentsMap[title].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      });
      
      console.log('Processed comments:', commentsMap);
      setComments(commentsMap);
      setLastCommentFetch(new Date()); // Update last fetch time
      return commentsMap; // Return for use in other functions
    } catch (commentsErr) {
      console.error('Error fetching comments:', commentsErr);
      // Continue even if comments fail
      return null;
    }
  }, []);
  
  // Simulate data for development if fetching fails
  const loadSampleData = () => {
    const samplePosts = [
      {
        id: 1,
        title: "Pentingnya Shalat dalam Kehidupan Muslim",
        body: "Shalat merupakan tiang agama dan ibadah wajib bagi setiap muslim. Allah SWT berfirman dalam Al-Quran: \"Sesungguhnya shalat itu mencegah dari (perbuatan) keji dan mungkar.\" (QS. Al-Ankabut: 45).\n\nShalat lima waktu adalah kewajiban yang tidak boleh ditinggalkan dalam kondisi apapun selama seseorang masih sadar. Nabi Muhammad SAW pun menekankan pentingnya shalat hingga akhir hayat beliau.",
        createdAt: "2023-11-15T07:30:00Z",
        author: {
          login: "Ahmad Fadli",
          avatarUrl: "https://ui-avatars.com/api/?name=Ahmad+Fadli&background=random"
        },
        labels: {
          nodes: [
            { name: "Ibadah", color: "16a34a" },
            { name: "Fiqh", color: "0891b2" }
          ]
        }
      },
      {
        id: 2,
        title: "Akhlak dalam Pandangan Islam",
        body: "Akhlak memiliki posisi sangat penting dalam Islam. Rasulullah SAW diutus untuk menyempurnakan akhlak manusia. Beliau bersabda: \"Sesungguhnya aku diutus untuk menyempurnakan akhlak yang mulia.\" (HR. Ahmad).\n\nKaum muslimin diajarkan untuk memiliki akhlak yang baik terhadap Allah SWT, sesama manusia, dan seluruh makhluk. Dengan akhlak yang baik, seorang muslim dapat mencerminkan ajaran Islam yang rahmatan lil 'alamin.",
        createdAt: "2023-11-10T09:15:00Z",
        author: {
          login: "Fatimah Azzahra",
          avatarUrl: "https://ui-avatars.com/api/?name=Fatimah+Azzahra&background=random"
        },
        labels: {
          nodes: [
            { name: "Akhlak", color: "8b5cf6" },
            { name: "Adab", color: "ef4444" }
          ]
        }
      }
    ];
    
    const sampleComments = {
      "pentingnya shalat dalam kehidupan muslim": [
        {
          id: "comment-1",
          author: {
            name: "Abdullah",
            avatarUrl: "https://ui-avatars.com/api/?name=Abdullah&background=random"
          },
          text: "Jazakallah khair atas ilmunya, sangat bermanfaat",
          createdAt: "2023-11-16T10:30:00Z"
        }
      ]
    };
    
    const sampleTitleMapping = {
      "pentingnya shalat dalam kehidupan muslim": "Pentingnya Shalat dalam Kehidupan Muslim",
      "akhlak dalam pandangan islam": "Akhlak dalam Pandangan Islam"
    };
    
    setPosts(samplePosts);
    setComments(sampleComments);
    setTitleMapping(sampleTitleMapping);
    setLoading(false);
  };

  // Fetch posts and comments from Google Sheets
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch posts
        const postsResponse = await axios.get(SHEET_CSV_URL);
        console.log('Posts data fetched:', postsResponse.data);
        
        // Parse CSV data for posts
        const postsRows = postsResponse.data.split('\n');
        const postsHeaders = parseCSVRow(postsRows[0]);
        
        const processedPosts = [];
        const titleMappingObj = {}; // Track original titles and their normalized versions
        
        // Start from index 1 to skip headers
        for (let i = 1; i < postsRows.length; i++) {
          if (postsRows[i].trim()) {
            const values = parseCSVRow(postsRows[i]);
            
            // Create a map for easier field access
            const fieldMap = {};
            postsHeaders.forEach((header, index) => {
              fieldMap[header.trim()] = values[index] || '';
            });
            
            // Log the field map for debugging
            console.log(`Row ${i} field map:`, fieldMap);
            
            // Get title and store mapping
            const originalTitle = fieldMap['Judul Artikel'] || 'Artikel Tanpa Judul';
            const normalizedTitle = normalizeTitle(originalTitle);
            titleMappingObj[normalizedTitle] = originalTitle;
            
            // Map specific fields using direct matching
            const post = {
              id: i,
              title: originalTitle,
              body: fieldMap['Isi Artikel'] || '',
              createdAt: fieldMap['Timestamp'] || new Date().toISOString(),
              author: {
                login: fieldMap['Nama Penulis'] || 'Anonim',
                avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(fieldMap['Nama Penulis'] || 'Anonim')}&background=random`
              },
              labels: { 
                nodes: [] 
              }
            };
            
            // Handle tags specifically
            const tagsField = fieldMap['Tag'] || '';
            if (tagsField) {
              post.labels.nodes = tagsField.split(',').map(tag => ({
                name: tag.trim(),
                color: getRandomColor()
              }));
            }
            
            processedPosts.push(post);
          }
        }
        
        // Sort by timestamp (newest first)
        processedPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        console.log('Processed posts:', processedPosts);
        
        setPosts(processedPosts);
        setTitleMapping(titleMappingObj);
        
        // Fetch comments using the separate function
        await fetchComments();
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching posts:', err);
        console.log('Falling back to sample data');
        // Fall back to sample data if fetching fails
        loadSampleData();
        
        setError('Gagal memuat artikel dari Google Sheets. Menampilkan data sample.');
        Swal.fire({
          title: 'Peringatan',
          text: 'Gagal memuat data dari Google Sheets. Menampilkan data contoh sebagai fallback.',
          icon: 'warning',
          confirmButtonText: 'OK',
          confirmButtonColor: '#16a34a'
        });
      }
    };

    fetchData();
  }, [fetchComments]);

  // Generate random color for tags
  const getRandomColor = () => {
    const colors = ['16a34a', '0891b2', '8b5cf6', 'ef4444', 'f59e0b', '6366f1', 'ec4899'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Redirect to Google Form
  const handleAddArticleClick = () => {
    window.open(GOOGLE_FORM_URL, '_blank');
    
    Swal.fire({
      title: 'Formulir Terbuka',
      text: 'Formulir untuk menambahkan artikel baru telah dibuka di tab baru',
      icon: 'success',
      confirmButtonText: 'OK',
      confirmButtonColor: '#16a34a'
    });
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    try {
      return new Date(dateString).toLocaleDateString('id-ID', options);
    } catch (e) {
      return dateString;
    }
  };

  // Handle comment submission - ENHANCED VERSION
  const handleAddComment = async (articleTitle) => {
    // Menggunakan formId yang sudah benar
    const formId = COMMENT_FORM_ID; // Menggunakan konstanta yang sudah didefinisikan
    
    // Pastikan judul artikel ada dan terkode dengan benar
    const encodedTitle = encodeURIComponent(articleTitle);
    
    // Membangun URL Google Forms dengan format yang benar
    // Format URL Google Forms: https://docs.google.com/forms/d/e/{formId}/viewform?entry.{entryId}={value}
    const prefillFormUrl = `https://docs.google.com/forms/d/e/${formId}/viewform?` +
      `entry.${ENTRY_ID_FOR_TITLE}=${encodedTitle}`;
    
    console.log('Opening comment form with URL:', prefillFormUrl);
    
    // Open form in a new tab
    const newWindow = window.open(prefillFormUrl, '_blank');
    
    // Show the dialog about refreshing comments
    Swal.fire({
      title: 'Formulir Komentar Terbuka',
      text: 'Formulir untuk menambahkan komentar telah dibuka di tab baru. Setelah mengirim komentar, klik "Refresh Komentar" untuk melihat komentar baru.',
      icon: 'success',
      showCancelButton: true,
      confirmButtonText: 'Refresh Komentar',
      cancelButtonText: 'Tutup',
      confirmButtonColor: '#16a34a'
    }).then((result) => {
      if (result.isConfirmed) {
        // Refresh comments when user clicks the button
        refreshComments(articleTitle);
      }
    });
  };
  
  // Function to refresh comments
  const refreshComments = async (currentArticleTitle = null) => {
    try {
      // Show loading indicator
      Swal.fire({
        title: 'Memuat Komentar',
        text: 'Sedang memperbarui data komentar...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
      
      // Fetch comments
      const updatedComments = await fetchComments();
      
      Swal.close();
      
      // Show success message
      Swal.fire({
        title: 'Komentar Diperbarui',
        text: 'Data komentar telah berhasil diperbarui',
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#16a34a'
      }).then(() => {
        // If we have a current article open, reopen it with updated comments
        if (currentArticleTitle) {
          const matchingPost = posts.find(post => post.title === currentArticleTitle);
          if (matchingPost) {
            handleReadMore(matchingPost);
          }
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
  };
  
  // Get comments for a post, handling case insensitivity
  const getCommentsForPost = (post) => {
    const normalizedTitle = normalizeTitle(post.title);
    return comments[normalizedTitle] || [];
  };

  // Handle "Baca Selengkapnya" button click - IMPROVED VERSION
  const handleReadMore = (post) => {
    try {
      const title = post.title || 'Artikel';
      const bodyContent = post.body || '';
      const postComments = getCommentsForPost(post);
      
      // Create comments HTML
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
        // Show message when no comments exist
        commentsHTML += `
          <div class="mt-6 pt-6 border-t border-gray-200">
            <h3 class="text-lg font-bold mb-4">Komentar</h3>
            <p class="text-gray-500 italic">Belum ada komentar. Jadilah yang pertama berkomentar!</p>
          </div>
        `;
      }
      
      // Add buttons: Add Comment and Refresh Comments
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
      
      // Show when comments were last fetched
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
          // Add event listener to the buttons
          document.getElementById('addCommentBtn').addEventListener('click', () => {
            Swal.close();
            handleAddComment(title);
          });
          
          document.getElementById('refreshCommentsBtn').addEventListener('click', () => {
            Swal.close();
            refreshComments(title);
          });
        }
      });
    } catch (error) {
      console.error('Error showing article:', error);
      alert('Tidak dapat menampilkan artikel. Silakan coba lagi nanti.');
    }
  };

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

  return (
    <div className="container-custom py-8">
      {error && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10 text-center"
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Artikel Islami</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Berbagi pemikiran, ilmu, dan pengalaman seputar Islam. Bergabunglah dalam artikel islami dan berkontribusi untuk saling menginspirasi.
        </p>
      </motion.div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 w-full">
      <button
        onClick={() => refreshComments()}
        className="btn-secondary flex items-center justify-center w-full sm:w-auto px-4 py-2 rounded"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Refresh Komentar
      </button>
      
      <button
        onClick={handleAddArticleClick}
        className="btn-primary flex items-center justify-center w-full sm:w-auto px-4 py-2 rounded"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Tulis Artikel
      </button>
    </div>
      {/* Last update indicator */}
      {lastCommentFetch && (
        <div className="text-center text-sm text-gray-500 mb-6">
          Komentar terakhir diperbarui: {formatDate(lastCommentFetch)} {new Date(lastCommentFetch).toLocaleTimeString('id-ID')}
        </div>
      )}

      {/* No results message when no posts */}
      {posts.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-xl font-medium mb-2">Belum ada artikel yang ditemukan</h3>
          <p className="text-gray-600 mb-4">
            Jadilah yang pertama menulis artikel
          </p>
        </div>
      )}

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => {
          // Get comment count for this post using the normalized title
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
                    <div className="text-gray-500 text-sm">{formatDate(post.createdAt)}</div>
                  </div>
                </div>
                
                <h2 className="text-xl font-bold mb-3 text-gray-800 hover:text-green-600">
                  {post.title}
                </h2>
                
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.body}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
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
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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