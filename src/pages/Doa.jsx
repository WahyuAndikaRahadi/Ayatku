import { useState, useEffect } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const Doa = () => {
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [prayers, setPrayers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [totalPrayers, setTotalPrayers] = useState(0)
  const itemsPerPage = 20
  const navigate = useNavigate()

  // Category names in Indonesian for display
  const categoryNames = {
    quran: 'Doa dalam Al-Quran',
    hadits: 'Doa dalam Hadits',
    pilihan: 'Doa Pilihan',
    harian: 'Doa Harian',
    ibadah: 'Doa Ibadah',
    haji: 'Doa Haji & Umrah',
    lainnya: 'Doa Lainnya'
  }

  // Fetch available prayer categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        const response = await axios.get('https://api.myquran.com/v2/doa/sumber')
        setCategories(response.data.data)
        setLoading(false)
      } catch (err) {
        console.error('Error fetching categories:', err)
        // Show that we have no data from API
        setCategories([])
        setError('Tidak dapat memuat data kategori doa')
        setLoading(false)
        Swal.fire({
          title: 'Error!',
          text: 'Tidak dapat memuat data kategori doa',
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#16a34a'
        })
      }
    }

    fetchCategories()
  }, [])

  // Fetch prayers when a category is selected or page changes
  useEffect(() => {
    if (selectedCategory) {
      fetchPrayers()
    }
  }, [selectedCategory, page])

  const fetchPrayers = async () => {
    try {
      setLoading(true)
      const response = await axios.get(
        `https://api.myquran.com/v2/doa/sumber/${selectedCategory}`
      )
      
      if (response.data.data && Array.isArray(response.data.data)) {
        // Store the original prayers data
        setPrayers(response.data.data)
        setTotalPrayers(response.data.data.length)
      } else {
        // Handle empty data
        setPrayers([])
        setTotalPrayers(0)
      }
      
      setLoading(false)
    } catch (err) {
      console.error('Error fetching prayers:', err)
      setPrayers([])
      setError('Tidak dapat memuat data doa')
      setLoading(false)
      Swal.fire({
        title: 'Error!',
        text: 'Tidak dapat memuat data doa',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#16a34a'
      })
    }
  }

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId)
    setPage(1) // Reset to first page when selecting a new category
  }

  const handlePrayerClick = (index) => {
    // Calculate the actual array index based on pagination
    const actualIndex = (page - 1) * itemsPerPage + index
    const prayer = prayers[actualIndex]
    
    // Navigate to the prayer detail page with prayer data in state
    navigate(`/doa/${selectedCategory}/${actualIndex}`, {
      state: { 
        prayer, 
        categoryName: categoryNames[selectedCategory] || selectedCategory 
      }
    })
  }

  const handleBackToCategories = () => {
    setSelectedCategory(null)
  }

  const handleNextPage = () => {
    setPage(prevPage => prevPage + 1)
  }

  const handlePrevPage = () => {
    setPage(prevPage => Math.max(prevPage - 1, 1))
  }

  const getTotalPages = () => {
    return Math.ceil(prayers.length / itemsPerPage)
  }

  // Get paginated prayers
  const paginatedPrayers = prayers.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  )

  if (loading && categories.length === 0) {
    return (
      <div className="container-custom flex justify-center items-center min-h-[60vh]">
        <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4 border-t-primary animate-spin"></div>
      </div>
    )
  }

  // Rendering category selection when no category is selected
  // This will show even if API fails to load categories, with a message
  if (!selectedCategory) {
    return (
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <h1 className="text-3xl font-bold mb-2">Doa-Doa</h1>
          <p className="text-gray-600">
            Kumpulan doa-doa dari Al-Quran dan Sunnah
          </p>
        </motion.div>

        {categories.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <svg 
              className="w-16 h-16 text-gray-400 mx-auto mb-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <h3 className="text-xl font-medium mb-2">Tidak Ada Data Doa</h3>
            <p className="text-gray-600 mb-6">
              Maaf, kami tidak dapat memuat data doa saat ini. Silakan coba lagi nanti.
            </p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors"
            >
              Muat Ulang Halaman
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 cursor-pointer"
                onClick={() => handleCategorySelect(category)}
              >
                <h3 className="text-xl font-bold mb-2">{categoryNames[category] || category}</h3>
                <div className="mt-4 flex justify-end">
                  <button className="text-primary font-medium hover:underline">
                    Lihat Doa
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    )
  }

  // Calculate the proper range for displaying items
  const startItem = (page - 1) * itemsPerPage + 1
  const endItem = Math.min(page * itemsPerPage, prayers.length)

  return (
    <div className="container-custom">
      <div className="mb-6">
        <button 
          onClick={handleBackToCategories} 
          className="flex items-center text-primary font-medium hover:underline"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Pilih Kategori Lain
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">
          {categoryNames[selectedCategory] || selectedCategory}
        </h1>
        {prayers.length > 0 && (
          <p className="text-gray-600">
            Menampilkan doa {startItem}-{endItem} dari {prayers.length}
          </p>
        )}
      </motion.div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4 border-t-primary animate-spin"></div>
        </div>
      ) : (
        <>
          {prayers.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <svg 
                className="w-16 h-16 text-gray-400 mx-auto mb-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <h3 className="text-xl font-medium mb-2">Tidak Ada Data Doa</h3>
              <p className="text-gray-600 mb-6">
                Maaf, kami tidak dapat memuat data doa untuk kategori ini saat ini.
              </p>
              <button 
                onClick={handleBackToCategories} 
                className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors"
              >
                Kembali ke Daftar Kategori
              </button>
            </div>
          ) : (
            <>
              <div className="space-y-6">
                {paginatedPrayers.map((prayer, index) => (
                  <motion.div
                    key={index} // Using index as key since there's no ID
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 cursor-pointer"
                    onClick={() => handlePrayerClick(index)}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-bold">{prayer.judul}</h3>
                    </div>
                    <div className="mb-4">
                      <p className="text-right text-lg font-medium mb-2">
                        {prayer.arab && prayer.arab.length > 150 
                          ? `${prayer.arab.substring(0, 150)}...` 
                          : prayer.arab}
                      </p>
                      <p className="text-gray-700">
                        {prayer.indo && prayer.indo.length > 200 
                          ? `${prayer.indo.substring(0, 200)}...` 
                          : prayer.indo}
                      </p>
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
              {prayers.length > itemsPerPage && (
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
              )}
            </>
          )}
        </>
      )}
    </div>
  )
}

export default Doa