import { useState, useEffect } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
import FilterOptions from '../components/FilterOptions'
import SurahCard from '../components/SurahCard'
import { motion } from 'framer-motion'
import juzData from '../data/juzData'

const Quran = () => {
  const [surahs, setSurahs] = useState([])
  const [filteredSurahs, setFilteredSurahs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeFilter, setActiveFilter] = useState({ type: 'surah', value: '' })

  useEffect(() => {
    const fetchSurahs = async () => {
      try {
        setLoading(true)
        const response = await axios.get('https://equran.id/api/v2/surat')
        setSurahs(response.data.data)
        setFilteredSurahs(response.data.data)
        setLoading(false)
      } catch (err) {
        setError('Terjadi kesalahan saat memuat data surah')
        setLoading(false)
        Swal.fire({
          title: 'Error!',
          text: 'Terjadi kesalahan saat memuat data surah',
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#16a34a'
        })
      }
    }

    fetchSurahs()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [activeFilter, surahs])

  const handleFilterChange = (type, value) => {
    setActiveFilter({ type, value })
  }

  const applyFilters = () => {
    if (!surahs.length) return;
    
    let result = [...surahs]

    // Apply type filter
    if (activeFilter.type === 'juz' && activeFilter.value) {
      const juzNumber = parseInt(activeFilter.value)
      
      // Find the juz data that matches the selected juz number
      const selectedJuz = juzData.find(juz => juz.juz === juzNumber);
      
      if (selectedJuz) {
        // Get all surah numbers that are in this juz
        const surahsInJuz = selectedJuz.surahs.map(item => item.surah);
        
        // Filter the surahs to only include those in the selected juz
        result = result.filter(surah => 
          surahsInJuz.includes(surah.nomor)
        );
      }
    }

    setFilteredSurahs(result)
  }

  const handleSurahClick = (surahNumber) => {
    // Force a hard redirect using window.location
    window.location.href = `/surah/${surahNumber}`;
  }

  if (loading) {
    return (
      <div className="container-custom flex justify-center items-center min-h-[60vh]">
        <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4 border-t-primary animate-spin"></div>
      </div>
    )
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
    )
  }

  return (
    <div className="container-custom">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center"
      >
        <h1 className="text-3xl font-bold mb-2">Al-Quran</h1>
        <p className="text-gray-600">
          Baca Al-Quran, terjemahan, dan tafsir dalam Bahasa Indonesia
        </p>
      </motion.div>

      <FilterOptions onFilterChange={handleFilterChange} />

      {filteredSurahs.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium mb-2">Tidak ada hasil yang ditemukan</h3>
          <p className="text-gray-600 mb-4">
            Tidak ada surah yang sesuai dengan filter yang dipilih
          </p>
          <button 
            onClick={() => {
              setActiveFilter({ type: 'surah', value: '' })
              setFilteredSurahs(surahs)
            }} 
            className="btn-primary"
          >
            Reset Filter
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSurahs.map((surah) => (
            <SurahCard 
              key={surah.nomor} 
              surah={surah} 
              onClick={() => handleSurahClick(surah.nomor)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default Quran