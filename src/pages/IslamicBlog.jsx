import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import Swal from 'sweetalert2';

// Google configuration
const GOOGLE_SHEET_ID = '1L1IhSAiVgGLN6hspPVSJ9gzTxTKRzNyQJfupIs0PFGw';
const GOOGLE_SHEET_TAB_NAME = 'DataArtikel';
const GOOGLE_FORM_URL = 'https://forms.gle/HAQhE7oSPvkzaz4dA';

// URL to access data from Google Sheets as CSV
const SHEET_CSV_URL = `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${GOOGLE_SHEET_TAB_NAME}`;

const IslamicBlog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch posts from Google Sheets
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        
        const response = await axios.get(SHEET_CSV_URL);
        
        // Parse CSV data
        const rows = response.data.split('\n');
        const headers = parseCSVRow(rows[0]);
        
        const processedPosts = [];
        
        // Start from index 1 to skip headers
        for (let i = 1; i < rows.length; i++) {
          if (rows[i].trim()) {
            const values = parseCSVRow(rows[i]);
            const post = {};
            
            // Create a map for easier field access
            const fieldMap = {};
            headers.forEach((header, index) => {
              fieldMap[header.trim()] = values[index] || '';
            });
            
            // Map specific fields using direct matching
            post.id = i; 
            post.title = fieldMap['Judul Artikel'] || fieldMap[' Judul Artikel '] || 'Artikel Tanpa Judul';
            post.body = fieldMap['Isi Artikel'] || fieldMap[' Isi Artikel '] || '';
            post.createdAt = fieldMap['Timestamp'] || new Date().toISOString();
            
            const authorName = fieldMap['Nama Penulis'] || fieldMap[' Nama Penulis '] || 'Anonim';
            post.author = {
              login: authorName,
              avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=random`
            };
            
            // Handle tags specifically
            let tagsArray = [];
            const tagsField = fieldMap['Tag'] || fieldMap[' Tag'] || '';
            if (tagsField) {
              tagsArray = tagsField.split(',').map(tag => ({
                name: tag.trim(),
                color: getRandomColor()
              }));
            }
            post.labels = { nodes: tagsArray };
            
            processedPosts.push(post);
          }
        }
        
        // Sort by timestamp (newest first)
        processedPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        setPosts(processedPosts);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('Gagal memuat artikel. Silahkan coba lagi nanti.');
        setLoading(false);
        Swal.fire({
          title: 'Error!',
          text: 'Gagal memuat artikel dari Google Sheets',
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#16a34a'
        });
      }
    };

    fetchPosts();
  }, []);

  // Parse CSV row considering quoted values
  const parseCSVRow = (row) => {
    const result = [];
    let insideQuote = false;
    let currentValue = '';
    
    for (let i = 0; i < row.length; i++) {
      const char = row[i];
      
      if (char === '"') {
        insideQuote = !insideQuote;
      } else if (char === ',' && !insideQuote) {
        result.push(currentValue);
        currentValue = '';
      } else {
        currentValue += char;
      }
    }
    
    // Add the last value
    result.push(currentValue);
    
    // Remove quotes from values
    return result.map(value => value.replace(/^"(.*)"$/, '$1'));
  };

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

  // Handle "Baca Selengkapnya" button click
  const handleReadMore = (post) => {
    try {
      const title = post.title || 'Artikel';
      const bodyContent = post.body || '';
      
      Swal.fire({
        title: title,
        html: `<div class="text-left">${bodyContent.replace(/\n/g, '<br>')}</div>`,
        width: 800,
        confirmButtonText: 'Tutup',
        confirmButtonColor: '#16a34a'
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

  if (error) {
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

      <div className="flex justify-end mb-8">
        <button
          onClick={handleAddArticleClick}
          className="btn-primary flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Tulis Artikel
        </button>
      </div>

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
        {posts.map((post) => (
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
                {post.labels.nodes.map(label => (
                  <span 
                    key={label.name}
                    className="px-2 py-1 text-xs rounded-full"
                    style={{
                      backgroundColor: `#${label.color}20`,
                      color: `#${label.color}`,
                      border: `1px solid #${label.color}`
                    }}
                  >
                    {label.name}
                  </span>
                ))}
              </div>
              
              <button 
                className="block w-full mt-4 text-center py-2 bg-green-50 text-green-600 font-medium rounded-lg hover:bg-green-100 transition-colors"
                onClick={() => handleReadMore(post)}
              >
                Baca Selengkapnya
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default IslamicBlog;