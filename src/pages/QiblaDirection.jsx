import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
import { motion } from 'framer-motion'

const QiblaDirection = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [location, setLocation] = useState(null)
  const [qiblaData, setQiblaData] = useState(null)
  const [compassUrl, setCompassUrl] = useState('')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const compassRef = useRef(null)

  useEffect(() => {
    // Fungsi untuk mendapatkan lokasi pengguna
    const getLocation = () => {
      if (navigator.geolocation) {
        setLoading(true)
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords
            setLocation({ latitude, longitude })
            fetchQiblaDirection(latitude, longitude)
          },
          (error) => {
            console.error('Error getting location:', error)
            setError('Tidak dapat mengakses lokasi Anda. Mohon aktifkan izin lokasi.')
            setLoading(false)
            Swal.fire({
              title: 'Error!',
              text: 'Tidak dapat mengakses lokasi Anda. Mohon aktifkan izin lokasi.',
              icon: 'error',
              confirmButtonText: 'OK',
              confirmButtonColor: '#16a34a'
            })
          }
        )
      } else {
        setError('Geolocation tidak didukung oleh browser Anda')
        setLoading(false)
        Swal.fire({
          title: 'Error!',
          text: 'Geolocation tidak didukung oleh browser Anda',
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#16a34a'
        })
      }
    }

    getLocation()
  }, [])

  const fetchQiblaDirection = async (latitude, longitude) => {
    try {
      // URL API untuk data Qibla
      const response = await axios.get(`https://api.aladhan.com/v1/qibla/${latitude}/${longitude}`)
      setQiblaData(response.data.data)
      
      // URL untuk kompas arah kiblat
      const compassImageUrl = `https://api.aladhan.com/v1/qibla/${latitude}/${longitude}/compass`
      setCompassUrl(compassImageUrl)
      
      setLoading(false)
      setIsRefreshing(false)
    } catch (err) {
      console.error('Error fetching qibla direction:', err)
      setError('Terjadi kesalahan saat memuat data arah kiblat')
      setLoading(false)
      setIsRefreshing(false)
      Swal.fire({
        title: 'Error!',
        text: 'Terjadi kesalahan saat memuat data arah kiblat',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#16a34a'
      })
    }
  }

  const refreshLocation = () => {
    setIsRefreshing(true)
    setError(null)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setLocation({ latitude, longitude })
          fetchQiblaDirection(latitude, longitude)
        },
        (error) => {
          setError('Tidak dapat mengakses lokasi Anda. Mohon aktifkan izin lokasi.')
          setLoading(false)
          setIsRefreshing(false)
        }
      )
    }
  }

  if (loading) {
    return (
      <div className="container-custom flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-16 w-16 mb-6 mx-auto border-t-primary animate-spin"></div>
          <h3 className="text-xl font-medium text-gray-700">Memuat Arah Kiblat</h3>
          <p className="text-gray-500 mt-2">Sedang mendapatkan lokasi Anda...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container-custom flex justify-center items-center min-h-[60vh]">
        <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="text-red-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Terjadi Kesalahan</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={refreshLocation} 
            className="btn-primary w-full py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container-custom py-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center"
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-3 text-gray-800">Arah Kiblat</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Petunjuk arah kiblat berdasarkan lokasi Anda saat ini untuk memudahkan 
          Anda menentukan arah yang tepat dalam melaksanakan ibadah
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="bg-gradient-to-r from-green-600 to-green-500 p-5 text-white">
            <h2 className="text-xl font-semibold">Informasi Lokasi</h2>
            <p className="text-green-100 text-sm">Lokasi yang terdeteksi saat ini</p>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <span className="text-gray-600 font-medium">Latitude</span>
                </div>
                <span className="font-semibold text-gray-800">{location?.latitude.toFixed(6)}°</span>
              </div>
              
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                    </svg>
                  </div>
                  <span className="text-gray-600 font-medium">Longitude</span>
                </div>
                <span className="font-semibold text-gray-800">{location?.longitude.toFixed(6)}°</span>
              </div>
              
              {qiblaData && (
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 11l3-3m0 0l3 3m-3-3v8m0-13a9 9 0 110 18 9 9 0 010-18z" />
                      </svg>
                    </div>
                    <span className="text-gray-600 font-medium">Arah Kiblat</span>
                  </div>
                  <span className="font-semibold text-gray-800">{qiblaData.direction.toFixed(2)}° dari utara</span>
                </div>
              )}
            </div>

            <div className="mt-6">
              <button 
                onClick={refreshLocation} 
                disabled={isRefreshing}
                className="w-full btn-primary py-3 rounded-xl flex items-center justify-center transition-all duration-300 hover:bg-green-600 disabled:opacity-70"
              >
                {isRefreshing ? (
                  <>
                    <div className="loader ease-linear rounded-full border-2 border-t-2 border-white h-5 w-5 mr-3 border-t-transparent animate-spin"></div>
                    Memperbarui...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Perbarui Lokasi
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-5 text-white">
            <h2 className="text-xl font-semibold">Kompas Arah Kiblat</h2>
            <p className="text-blue-100 text-sm">Ka'bah di Makkah, Arab Saudi</p>
          </div>
          
          <div className="p-6 flex flex-col items-center justify-center">
            <div ref={compassRef} className="compass-container relative pb-6">
              {compassUrl ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.7, delay: 0.5 }}
                  className="relative"
                >
                  <div className="rounded-full shadow-lg p-2 bg-white border-4 border-blue-50">
                    <img 
                      src={compassUrl} 
                      alt="Arah Kiblat" 
                      className="w-64 h-64 md:w-80 md:h-80 rounded-full"
                    />
                  </div>
                  
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-1.5 rounded-full text-sm font-medium shadow-md">
                    {qiblaData?.direction.toFixed(2)}°
                  </div>
                </motion.div>
              ) : (
                <div className="h-64 w-64 md:h-80 md:w-80 rounded-full bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-400">Memuat kompas...</span>
                </div>
              )}
            </div>
            
            <div className="mt-4 text-center">
              <p className="text-gray-600 mb-2">
                <span className="font-medium text-gray-800">Petunjuk: </span> 
                Arahkan perangkat sesuai panah pada kompas
              </p>
              <div className="flex items-center justify-center gap-1 text-sm text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Letakkan perangkat pada permukaan datar untuk hasil terbaik</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-6 bg-white rounded-2xl shadow-lg p-6"
      >
        <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-800">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Petunjuk Penggunaan
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-green-50 p-4 rounded-xl">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
              </div>
              <span className="font-medium text-gray-800">Aktifkan GPS</span>
            </div>
            <p className="text-gray-600 text-sm mt-2 ml-12">
              Pastikan GPS perangkat Anda aktif untuk mendapatkan lokasi yang akurat
            </p>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-xl">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
              </div>
              <span className="font-medium text-gray-800">Permukaan Datar</span>
            </div>
            <p className="text-gray-600 text-sm mt-2 ml-12">
              Letakkan perangkat Anda pada permukaan datar untuk hasil terbaik
            </p>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-xl">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <span className="font-medium text-gray-800">Luar Ruangan</span>
            </div>
            <p className="text-gray-600 text-sm mt-2 ml-12">
              Untuk hasil yang lebih akurat, gunakan di luar ruangan dengan pandangan langit yang jelas
            </p>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-xl">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="font-medium text-gray-800">Arahkan Perangkat</span>
            </div>
            <p className="text-gray-600 text-sm mt-2 ml-12">
              Arahkan perangkat sesuai dengan panah pada kompas kiblat
            </p>
          </div>
          
          <div className="bg-red-50 p-4 rounded-xl">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <span className="font-medium text-gray-800">Kalibrasi Kompas</span>
            </div>
            <p className="text-gray-600 text-sm mt-2 ml-12">
              Jika kompas tidak akurat, kalibrasi perangkat Anda dengan menggerakkan perangkat membentuk angka 8
            </p>
          </div>
          
          <div className="bg-indigo-50 p-4 rounded-xl">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <span className="font-medium text-gray-800">Perbarui Lokasi</span>
            </div>
            <p className="text-gray-600 text-sm mt-2 ml-12">
              Jika posisi berubah, klik tombol "Perbarui Lokasi" untuk mendapatkan arahan terbaru
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default QiblaDirection