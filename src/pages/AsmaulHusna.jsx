import { useState, useEffect } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
import { motion } from 'framer-motion'

const AsmaulHusna = () => {
  const [names, setNames] = useState([])
  const [filteredNames, setFilteredNames] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'

  useEffect(() => {
    const fetchNames = async () => {
      try {
        setLoading(true)
        const response = await axios.get('https://api.myquran.com/v2/husna/semua')
        setNames(response.data.data)
        setFilteredNames(response.data.data)
        setLoading(false)
      } catch (err) {
        setError('Terjadi kesalahan saat memuat data Asmaul Husna')
        setLoading(false)
        Swal.fire({
          title: 'Error!',
          text: 'Terjadi kesalahan saat memuat data Asmaul Husna',
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#16a34a'
        })
      }
    }

    fetchNames()
  }, [])

  useEffect(() => {
    if (searchTerm === '') {
      setFilteredNames(names)
    } else {
      const filtered = names.filter(
        name => 
          name.latin.toLowerCase().includes(searchTerm.toLowerCase()) ||
          name.indo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          name.id.toString().includes(searchTerm)
      )
      setFilteredNames(filtered)
    }
  }, [searchTerm, names])

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  // Create gradient colors for beautiful cards
  const getCardStyle = (id) => {
    const gradients = [
      'bg-gradient-to-br from-emerald-400 to-teal-600',
      'bg-gradient-to-br from-sky-400 to-blue-600',
      'bg-gradient-to-br from-violet-400 to-purple-600',
      'bg-gradient-to-br from-amber-400 to-orange-600',
      'bg-gradient-to-br from-rose-400 to-pink-600',
      'bg-gradient-to-br from-indigo-400 to-blue-600',
      'bg-gradient-to-br from-cyan-400 to-teal-600',
      'bg-gradient-to-br from-fuchsia-400 to-purple-600',
      'bg-gradient-to-br from-lime-400 to-green-600',
    ]
    
    return gradients[id % gradients.length]
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

  const renderGridView = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {filteredNames.map((name) => (
        <motion.div
          key={name.id}
          whileHover={{ 
            scale: 1.05,
            boxShadow: "0px 10px 25px rgba(0, 0, 0, 0.15)",
            transition: { duration: 0.2 },
          }}
          className={`rounded-2xl overflow-hidden shadow-lg ${getCardStyle(name.id)}`}
        >
          <div className="p-5 flex flex-col items-center justify-center text-center">
            <div className="bg-white  w-12 h-12 rounded-full flex items-center justify-center mb-3 shadow-md">
              <span className="font-bold text-lg text-primary">{name.id}</span>
            </div>
            <h3 className="text-xl font-bold mb-2 text-white">{name.latin}</h3>
            <p className="text-3xl font-arabic mb-3 text-white">{name.arab}</p>
            <div className="bg-white  px-4 py-2 rounded-full text-sm text-primary font-medium">
              {name.indo}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )

  const renderListView = () => (
    <div className="space-y-4">
      {filteredNames.map((name) => (
        <motion.div
          key={name.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-gray-200 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700"
        >
          <div className={`${getCardStyle(name.id)} p-4 flex items-center justify-between`}>
            <div className="flex items-center">
              <div className="bg-white  w-10 h-10 rounded-full flex items-center justify-center mr-3 shadow-md">
                <span className="font-bold text-primary">{name.id}</span>
              </div>
              <span className="text-white font-bold text-lg">{name.latin}</span>
            </div>
            <span className="text-2xl text-white font-arabic">{name.arab}</span>
          </div>
          <div className="p-4 flex justify-center">
            <span className="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-full text-gray-800 dark:text-gray-200 font-medium">
              {name.indo}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  )

  return (
    <div className="container-custom bg-gray-50  py-5 mt-5">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10 text-center"
      >
        <h1 className="text-3xl font-bold mb-2">Asmaul Husna</h1>
        <p className="text-gray-600">
          99 Nama Allah Yang Maha Indah
        </p>

      </motion.div>

      <div className="mb-8 p-4 bg-white  rounded-2xl shadow-md">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Cari nama..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-200 dark:border-gray-600 dark:text-gray-800 text-gray-800"
              value={searchTerm}
              onChange={handleSearch}
            />
            <svg
              className="w-5 h-5 absolute left-3 top-3.5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </div>

          <div className="flex gap-2 md:gap-3">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2 rounded-xl flex items-center justify-center transition-all duration-300 ${
                viewMode === 'grid'
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              <svg
                className="w-5 h-5 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                ></path>
              </svg>
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-xl flex items-center justify-center transition-all duration-300 ${
                viewMode === 'list'
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              <svg
                className="w-5 h-5 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
              List
            </button>
          </div>
        </div>
      </div>

      {filteredNames.length === 0 ? (
        <div className="text-center py-12 bg-white  rounded-2xl shadow-md">
          <h3 className="text-xl font-medium mb-2">Tidak ada hasil yang ditemukan</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Tidak ada nama yang sesuai dengan pencarian yang Anda masukkan
          </p>
          <button 
            onClick={() => setSearchTerm('')} 
            className="btn-primary"
          >
            Reset Pencarian
          </button>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {viewMode === 'grid' ? renderGridView() : renderListView()}
        </motion.div>
      )}
    </div>
  )
}

export default AsmaulHusna