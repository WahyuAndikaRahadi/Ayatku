import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import Swal from 'sweetalert2'
import { FaArrowLeft, FaBookOpen, FaPlay, FaPause, FaChevronLeft, FaChevronRight } from 'react-icons/fa'

const SurahDetail = () => {
  const { id } = useParams()
  const [surah, setSurah] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [playingAudio, setPlayingAudio] = useState(null)
  const [selectedReciter, setSelectedReciter] = useState('01') // Default reciter

  const reciters = {
    '01': 'Abdullah Al-Juhany',
    '02': 'Abdul-Muhsin Al-Qasim',
    '03': 'Abdurrahman as-Sudais',
    '04': 'Ibrahim Al-Dossari',
    '05': 'Misyari Rasyid Al-Afasi'
  }

  useEffect(() => {
    const fetchSurah = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`https://equran.id/api/v2/surat/${id}`)
        setSurah(response.data.data)
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

    fetchSurah()
    
    // Clean up any playing audio when component unmounts
    return () => {
      if (playingAudio) {
        playingAudio.pause()
      }
    }
  }, [id])

  const playAudio = (audioSrc) => {
    if (playingAudio) {
      playingAudio.pause()
      if (playingAudio.src === audioSrc) {
        setPlayingAudio(null)
        return
      }
    }
    
    const audio = new Audio(audioSrc)
    audio.play()
    
    audio.onended = () => {
      setPlayingAudio(null)
    }
    
    setPlayingAudio(audio)
  }

  const handleReciterChange = (e) => {
    setSelectedReciter(e.target.value)
    if (playingAudio) {
      playingAudio.pause()
      setPlayingAudio(null)
    }
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
          <Link to="/quran" className="btn-primary mt-4 inline-block">
            Kembali ke Daftar Surah
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container-custom">
      {surah && (
        <>
          <div className="mb-6">
            <Link to="/quran" className="inline-flex items-center text-primary hover:underline">
              <FaArrowLeft className="mr-2" /> Kembali ke Daftar Surah
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">{surah.namaLatin}</h1>
              <p className="text-4xl font-arabic text-primary mb-2">{surah.nama}</p>
              <p className="text-lg mb-2">{surah.arti}</p>
              <div className="flex justify-center items-center space-x-4 text-sm text-gray-600">
                <span>{surah.tempatTurun === 'Mekah' ? 'Makkiyah' : 'Madaniyah'}</span>
                <span>•</span>
                <span>{surah.jumlahAyat} Ayat</span>
              </div>
              
              {/* Audio Player untuk Seluruh Surah dengan UI yang diperbaiki */}
              {surah.audioFull && (
                <div className="mt-6 max-w-md mx-auto">
                  <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
                    <div className="flex flex-col md:flex-row md:items-center gap-3">
                      <div className="flex-grow">
                        <select 
                          className="w-full border rounded-lg p-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary"
                          value={selectedReciter}
                          onChange={handleReciterChange}
                        >
                          {Object.entries(reciters).map(([key, name]) => (
                            <option key={key} value={key}>
                              {name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <button 
                        onClick={() => playAudio(surah.audioFull[selectedReciter])}
                        className="flex items-center justify-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/80 transition w-full md:w-auto"
                      >
                        {playingAudio ? <FaPause className="mr-1" /> : <FaPlay className="mr-1" />}
                        <span>{playingAudio ? 'Berhenti' : 'Dengarkan Surah'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              <Link 
                to={`/tafsir/${surah.nomor}`} 
                className="mt-4 inline-flex items-center text-secondary hover:underline"
              >
                <FaBookOpen className="mr-2" /> Lihat Tafsir
              </Link>
            </div>

            <div className="bg-primary/5 p-4 rounded-lg mb-6 text-center">
              {surah.nomor !== 1 && (
                <p className="arabic-text">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</p>
              )}
            </div>

            <div className="space-y-8">
              {surah.ayat ? surah.ayat.map((ayat) => (
                <div key={ayat.nomor || ayat.nomorAyat} className="border-b pb-6 last:border-0">
                  <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg mb-4">
                    <span className="w-8 h-8 flex items-center justify-center bg-primary text-white rounded-full font-medium">
                      {ayat.nomor || ayat.nomorAyat}
                    </span>
                  </div>
                  <p className="arabic-text mb-4">{ayat.teksArab || ayat.teks_arab}</p>
                  <p className="text-gray-700 italic mb-2">{ayat.teksLatin || ayat.teks_latin}</p>
                  <p className="text-gray-800">{ayat.teksIndonesia || ayat.teks_indonesia}</p>
                </div>
              )) : (
                <div className="text-center py-4">
                  <p>Data ayat tidak tersedia</p>
                </div>
              )}
            </div>
            
            {/* Navigasi Surah */}
            <div className="mt-8 flex flex-col sm:flex-row justify-between gap-4">
              {parseInt(id) > 1 && (
                <Link 
                  to={`/surah/${parseInt(id) - 1}`} 
                  className="inline-flex items-center justify-center bg-gray-100 px-4 py-3 rounded-lg hover:bg-gray-200 transition"
                >
                  <FaChevronLeft className="mr-2" /> Surah Sebelumnya
                </Link>
              )}
              
              {parseInt(id) < 114 && (
                <Link 
                  to={`/surah/${parseInt(id) + 1}`} 
                  className="inline-flex items-center justify-center bg-gray-100 px-4 py-3 rounded-lg hover:bg-gray-200 transition sm:ml-auto"
                >
                  Surah Selanjutnya <FaChevronRight className="ml-2" />
                </Link>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default SurahDetail