import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Swal from 'sweetalert2'
import { motion } from 'framer-motion'

const HadithDetail = () => {
  const { bookId, number } = useParams()
  const navigate = useNavigate()
  const [hadith, setHadith] = useState(null)
  const [bookInfo, setBookInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [availableNumbers, setAvailableNumbers] = useState([])
  const [nextNumber, setNextNumber] = useState(null)
  const [prevNumber, setPrevNumber] = useState(null)

  useEffect(() => {
    const fetchHadithData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Fetch book info first to get the total available hadiths
        const bookResponse = await axios.get('https://api.hadith.gading.dev/books')
        const currentBookInfo = bookResponse.data.data.find(book => book.id === bookId)
        setBookInfo(currentBookInfo)
        
        if (!currentBookInfo) {
          throw new Error('Buku hadith tidak ditemukan')
        }
        
        // Fetch list of all available hadith numbers for this book
        try {
          // Get a small range first to avoid large payloads
          // Note: Adjust range size based on API limitations
          const listResponse = await axios.get(`https://api.hadith.gading.dev/books/${bookId}?range=1-${Math.min(currentBookInfo.available, 300)}`)
          
          // Extract all available hadith numbers and sort them
          const availableHadiths = listResponse.data.data.hadiths
            .map(h => parseInt(h.number))
            .sort((a, b) => a - b)
          
          setAvailableNumbers(availableHadiths)
          
          // Find next and previous numbers based on current number
          const currentNum = parseInt(number)
          
          // Find the next available number (first number greater than current)
          const next = availableHadiths.find(num => num > currentNum)
          setNextNumber(next || null)
          
          // Find the previous available number (highest number less than current)
          const prev = availableHadiths
            .filter(num => num < currentNum)
            .sort((a, b) => b - a)[0]
          setPrevNumber(prev || null)
          
        } catch (listErr) {
          console.error('Error fetching hadith list:', listErr)
          // If we can't get the list, we'll handle navigation more conservatively
        }
        
        // Now fetch the current hadith
        try {
          const hadithResponse = await axios.get(`https://api.hadith.gading.dev/books/${bookId}/${number}`)
          setHadith(hadithResponse.data.data.contents)
        } catch (hadithErr) {
          console.error('Error fetching specific hadith:', hadithErr)
          
          // If current hadith not found, try to redirect to the closest available
          if (availableNumbers.length > 0) {
            const closestNumber = findClosestAvailableNumber(parseInt(number), availableNumbers)
            if (closestNumber && closestNumber !== parseInt(number)) {
              navigate(`/hadith/${bookId}/${closestNumber}`, { replace: true })
              return // Stop execution as we're redirecting
            }
          }
          
          throw new Error('Hadith tidak ditemukan')
        }
        
        setLoading(false)
      } catch (err) {
        console.error('Error in hadith detail:', err)
        setError(err.message || 'Terjadi kesalahan saat memuat data hadist')
        setLoading(false)
        Swal.fire({
          title: 'Error!',
          text: err.message || 'Terjadi kesalahan saat memuat data hadist',
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#16a34a'
        })
      }
    }

    if (bookId && number) {
      fetchHadithData()
    }
  }, [bookId, number, navigate])

  // Find the closest available hadith number
  const findClosestAvailableNumber = (current, available) => {
    if (!available || available.length === 0) return null
    
    // Find the exact match
    if (available.includes(current)) return current
    
    // Find the next available
    const next = available.find(num => num > current)
    
    // Find the previous available
    const prev = available
      .filter(num => num < current)
      .sort((a, b) => b - a)[0]
    
    // Return the closest (prefer next if both are equidistant)
    if (next && prev) {
      return (next - current) <= (current - prev) ? next : prev
    }
    
    // Return whichever exists
    return next || prev
  }

  const handlePreviousHadith = () => {
    if (prevNumber) {
      navigate(`/hadith/${bookId}/${prevNumber}`)
    } else {
      Swal.fire({
        title: 'Informasi',
        text: 'Ini adalah hadist pertama yang tersedia',
        icon: 'info',
        confirmButtonText: 'OK',
        confirmButtonColor: '#16a34a'
      })
    }
  }

  const handleNextHadith = () => {
    if (nextNumber) {
      navigate(`/hadith/${bookId}/${nextNumber}`)
    } else {
      Swal.fire({
        title: 'Informasi',
        text: 'Ini adalah hadist terakhir yang tersedia',
        icon: 'info',
        confirmButtonText: 'OK',
        confirmButtonColor: '#16a34a'
      })
    }
  }

  const handleBackToList = () => {
    navigate('/hadith')
  }

  if (loading) {
    return (
      <div className="container-custom flex justify-center items-center min-h-[60vh]">
        <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4 border-t-primary animate-spin"></div>
      </div>
    )
  }

  if (error || !hadith) {
    return (
      <div className="container-custom flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-2">Error</h2>
          <p>{error || 'Hadist tidak ditemukan'}</p>
          <button 
            onClick={handleBackToList} 
            className="btn-primary mt-4"
          >
            Kembali ke Daftar Hadist
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
          Kembali ke Daftar Hadist
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
              {bookInfo?.name || (hadith.name || bookId)} - Hadist No. {hadith.number}
            </h1>
            <div className="text-sm text-gray-500">
              {bookInfo && `Total: ${bookInfo.available} hadist`}
            </div>
          </div>

          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-bold mb-4 text-right leading-relaxed">{hadith.arab}</h2>
          </div>

          <div className="mb-4">
            <h3 className="font-semibold text-lg mb-2">Terjemahan:</h3>
            <p className="text-gray-700 leading-relaxed">{hadith.id}</p>
          </div>
          
          {nextNumber && nextNumber > parseInt(number) + 1 && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm text-yellow-700">
                <span className="font-semibold">Perhatian:</span> Hadist selanjutnya adalah nomor {nextNumber} (lompat dari {number})
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-3 mt-6">
  <button
    onClick={handlePreviousHadith}
    disabled={!prevNumber}
    className={`px-3 py-2 rounded-md flex items-center justify-center ${
      !prevNumber
        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
        : 'bg-primary text-white hover:bg-primary-dark'
    }`}
  >
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
    <span className="text-sm sm:text-base">
      Hadist Sebelumnya {prevNumber && <span className="hidden xs:inline">{`(No. ${prevNumber})`}</span>}
    </span>
  </button>
  
  <button
    onClick={handleNextHadith}
    disabled={!nextNumber}
    className={`px-3 py-2 rounded-md flex items-center justify-center ${
      !nextNumber
        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
        : 'bg-primary text-white hover:bg-primary-dark'
    }`}
  >
    <span className="text-sm sm:text-base">
      Hadist Selanjutnya {nextNumber && <span className="hidden xs:inline">{`(No. ${nextNumber})`}</span>}
    </span>
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
    </svg>
  </button>
</div>
      </motion.div>
    </div>
  )
}

export default HadithDetail