import { useState, useEffect } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const Hadith = () => {
  const [books, setBooks] = useState([])
  const [selectedBook, setSelectedBook] = useState(null)
  const [hadiths, setHadiths] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [totalHadiths, setTotalHadiths] = useState(0)
  const itemsPerPage = 20
  const navigate = useNavigate()
  
  // Fetch available hadith books on component mount
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true)
        const response = await axios.get('https://api.hadith.gading.dev/books')
        setBooks(response.data.data)
        setLoading(false)
      } catch (err) {
        setError('Terjadi kesalahan saat memuat data kitab hadist')
        setLoading(false)
        Swal.fire({
          title: 'Error!',
          text: 'Terjadi kesalahan saat memuat data kitab hadist',
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#16a34a'
        })
      }
    }

    fetchBooks()
  }, [])

  // Fetch hadiths when a book is selected or page changes
  useEffect(() => {
    if (selectedBook) {
      fetchHadiths()
    }
  }, [selectedBook, page])

  const fetchHadiths = async () => {
    try {
      setLoading(true)
      
      // Calculate start and end for the range based on current page
      const start = (page - 1) * itemsPerPage + 1
      const end = page * itemsPerPage
      
      const response = await axios.get(
        `https://api.hadith.gading.dev/books/${selectedBook}?range=${start}-${end}`
      )
      
      setHadiths(response.data.data.hadiths)
      
      // Set total hadiths for pagination if it's the first page
      if (page === 1) {
        // Get book info to know total available hadiths
        const selectedBookInfo = books.find(book => book.id === selectedBook)
        if (selectedBookInfo) {
          setTotalHadiths(selectedBookInfo.available)
        }
      }
      
      setLoading(false)
    } catch (err) {
      setError('Terjadi kesalahan saat memuat data hadist')
      setLoading(false)
      Swal.fire({
        title: 'Error!',
        text: 'Terjadi kesalahan saat memuat data hadist',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#16a34a'
      })
    }
  }

  const handleBookSelect = (bookName) => {
    setSelectedBook(bookName)
    setPage(1) // Reset to first page when selecting a new book
  }

  const handleHadithClick = (number) => {
    // Navigate to the hadith detail page
    navigate(`/hadith/${selectedBook}/${number}`)
  }

  const handleBackToBooks = () => {
    setSelectedBook(null)
  }

  const handleNextPage = () => {
    setPage(prevPage => prevPage + 1)
  }

  const handlePrevPage = () => {
    setPage(prevPage => Math.max(prevPage - 1, 1))
  }

  const getTotalPages = () => {
    return Math.ceil(totalHadiths / itemsPerPage)
  }

  if (loading && books.length === 0) {
    return (
      <div className="container-custom flex justify-center items-center min-h-[60vh]">
        <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4 border-t-primary animate-spin"></div>
      </div>
    )
  }

  if (error && books.length === 0) {
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
    )
  }

  // Rendering book selection when no book is selected
  if (!selectedBook) {
    return (
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <h1 className="text-3xl font-bold mb-2">Hadist</h1>
          <p className="text-gray-600">
            Baca Hadist dari berbagai Ahli hadist terpercaya
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 cursor-pointer"
              onClick={() => handleBookSelect(book.id)}
            >
              <h3 className="text-xl font-bold mb-2">{book.name}</h3>
              <p className="text-gray-600">Jumlah hadist: {book.available}</p>
              <div className="mt-4 flex justify-end">
                <button className="text-primary font-medium hover:underline">
                  Lihat Hadist
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    )
  }

  // Calculate the range of hadiths being displayed
  const startItem = (page - 1) * itemsPerPage + 1
  const endItem = Math.min(page * itemsPerPage, totalHadiths)

  // Rendering hadith list with pagination
  return (
    <div className="container-custom">
      <div className="mb-6">
        <button 
          onClick={handleBackToBooks} 
          className="flex items-center text-primary font-medium hover:underline"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Pilih Hadist Lain
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">
          {books.find(b => b.id === selectedBook)?.name}
        </h1>
        <p className="text-gray-600">
          Menampilkan hadist {startItem}-{endItem} dari {totalHadiths}
        </p>
      </motion.div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4 border-t-primary animate-spin"></div>
        </div>
      ) : (
        <>
          {hadiths.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium mb-2">Tidak ada hadist yang ditemukan</h3>
              <p className="text-gray-600">
                Tidak ada hadist yang tersedia untuk kitab ini
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-6">
                {hadiths.map((hadith) => (
                  <motion.div
                    key={hadith.number}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 cursor-pointer"
                    onClick={() => handleHadithClick(hadith.number)}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-bold">Hadist No. {hadith.number}</h3>
                    </div>
                    <div className="mb-4">
                      <p className="text-right text-lg font-medium mb-2">{hadith.arab.substring(0, 150)}...</p>
                      <p className="text-gray-700">{hadith.id.substring(0, 200)}...</p>
                    </div>
                    <div className="flex justify-end">
                      <button className="text-primary font-medium hover:underline">
                        Baca Selengkapnya
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Pagination controls */}
              <div className="mt-8 flex justify-between items-center">
                <button
                  onClick={handlePrevPage}
                  disabled={page <= 1}
                  className={`px-4 py-2 rounded-md flex items-center ${
                    page <= 1
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-primary text-white hover:bg-primary-dark'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Halaman Sebelumnya
                </button>
                
                <div className="text-center">
                  <span className="font-medium">
                    Halaman {page} dari {getTotalPages()}
                  </span>
                </div>
                
                <button
                  onClick={handleNextPage}
                  disabled={page >= getTotalPages()}
                  className={`px-4 py-2 rounded-md flex items-center ${
                    page >= getTotalPages()
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-primary text-white hover:bg-primary-dark'
                  }`}
                >
                  Halaman Selanjutnya
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}

export default Hadith