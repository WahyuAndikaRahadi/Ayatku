import { useState, useEffect } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Swal from 'sweetalert2'
import { motion } from 'framer-motion'

const DoaDetail = () => {
  const { category, id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  
  // Try to get the prayer from state (passed during navigation)
  const prayerFromState = location.state?.prayer
  const categoryName = location.state?.categoryName || category
  
  const [prayer, setPrayer] = useState(prayerFromState || null)
  const [loading, setLoading] = useState(!prayerFromState)
  const [error, setError] = useState(null)
  const [categoryPrayers, setCategoryPrayers] = useState([])
  const [nextPrayer, setNextPrayer] = useState(null)
  const [prevPrayer, setPrevPrayer] = useState(null)
  const [totalPrayers, setTotalPrayers] = useState(0)

  useEffect(() => {
    const fetchPrayerData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Fetch all prayers for this category to determine navigation
        const categoryResponse = await axios.get(
          `https://api.myquran.com/v2/doa/sumber/${category}`
        )
        
        if (categoryResponse.data.data && Array.isArray(categoryResponse.data.data)) {
          const allPrayers = categoryResponse.data.data
          setCategoryPrayers(allPrayers)
          setTotalPrayers(allPrayers.length)
          
          // Find current prayer index
          const currentIndex = parseInt(id)
          
          // Set prayer if not already set from state
          if (!prayerFromState) {
            const foundPrayer = allPrayers[currentIndex]
            if (foundPrayer) {
              setPrayer(foundPrayer)
            } else {
              throw new Error('Doa tidak ditemukan')
            }
          }
          
          // Set next and previous prayers
          if (currentIndex < allPrayers.length - 1) {
            setNextPrayer({
              index: currentIndex + 1,
              title: allPrayers[currentIndex + 1]?.judul
            })
          } else {
            setNextPrayer(null)
          }
          
          if (currentIndex > 0) {
            setPrevPrayer({
              index: currentIndex - 1,
              title: allPrayers[currentIndex - 1]?.judul
            })
          } else {
            setPrevPrayer(null)
          }
        } else {
          throw new Error('Data doa tidak tersedia')
        }
        
        setLoading(false)
      } catch (err) {
        console.error('Error fetching prayer data:', err)
        setError(err.message || 'Terjadi kesalahan saat memuat data doa')
        setLoading(false)
        Swal.fire({
          title: 'Error!',
          text: err.message || 'Tidak dapat memuat data doa',
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#16a34a'
        })
      }
    }
    
    fetchPrayerData()
  }, [category, id, prayerFromState])

  const handlePreviousPrayer = () => {
    if (prevPrayer) {
      navigate(`/doa/${category}/${prevPrayer.index}`, {
        state: {
          prayer: categoryPrayers[prevPrayer.index],
          categoryName: categoryName
        }
      })
    } else {
      Swal.fire({
        title: 'Informasi',
        text: 'Ini adalah doa pertama dalam kategori ini',
        icon: 'info',
        confirmButtonText: 'OK',
        confirmButtonColor: '#16a34a'
      })
    }
  }

  const handleNextPrayer = () => {
    if (nextPrayer) {
      navigate(`/doa/${category}/${nextPrayer.index}`, {
        state: {
          prayer: categoryPrayers[nextPrayer.index],
          categoryName: categoryName
        }
      })
    } else {
      Swal.fire({
        title: 'Informasi',
        text: 'Ini adalah doa terakhir dalam kategori ini',
        icon: 'info',
        confirmButtonText: 'OK',
        confirmButtonColor: '#16a34a'
      })
    }
  }

  const handleBackToList = () => {
    navigate('/doa')
  }

  if (loading) {
    return (
      <div className="container-custom flex justify-center items-center min-h-[60vh]">
        <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4 border-t-primary animate-spin"></div>
      </div>
    )
  }

  if (error || !prayer) {
    return (
      <div className="container-custom flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-2">Error</h2>
          <p>{error || 'Doa tidak ditemukan'}</p>
          <button 
            onClick={handleBackToList} 
            className="btn-primary mt-4"
          >
            Kembali ke Daftar Doa
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container-custom py-8">
      <div className="mb-6">
        <button 
          onClick={handleBackToList} 
          className="flex items-center text-primary font-medium hover:underline"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Kembali ke Daftar Doa
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="mb-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold">
              {categoryName} - Doa No. {parseInt(id) + 1}
            </h1>
            <div className="text-sm text-gray-500">
              {totalPrayers > 0 && `Total: ${totalPrayers} doa`}
            </div>
          </div>

          <div className="mb-4 text-center">
            <h2 className="text-xl font-semibold mb-2">{prayer.judul}</h2>
          </div>

          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-bold mb-4 text-right leading-relaxed">{prayer.arab}</h2>
          </div>

          {prayer.latin && (
            <div className="mb-4">
              <h3 className="font-semibold text-lg mb-2">Latin:</h3>
              <p className="text-gray-700 italic leading-relaxed">{prayer.latin}</p>
            </div>
          )}

          <div className="mb-4">
            <h3 className="font-semibold text-lg mb-2">Arti:</h3>
            <p className="text-gray-700 leading-relaxed">{prayer.indo}</p>
          </div>
          
          {prayer.source && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Sumber: {prayer.source}
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-between mt-6">
          <button
            onClick={handlePreviousPrayer}
            disabled={!prevPrayer}
            className={`px-4 py-2 rounded-md flex items-center ${
              !prevPrayer
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-primary text-white hover:bg-primary-dark'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Doa Sebelumnya {prevPrayer && `(${prevPrayer.title})`}
          </button>
          <button
            onClick={handleNextPrayer}
            disabled={!nextPrayer}
            className={`px-4 py-2 rounded-md flex items-center ${
              !nextPrayer
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-primary text-white hover:bg-primary-dark'
            }`}
          >
            Doa Selanjutnya {nextPrayer && `(${nextPrayer.title})`}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default DoaDetail