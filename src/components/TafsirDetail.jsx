import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import Swal from 'sweetalert2'
import { FaArrowLeft, FaQuran, FaChevronLeft } from 'react-icons/fa'

const TafsirDetail = () => {
  const { id } = useParams()
  const [tafsir, setTafsir] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchTafsir = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`https://equran.id/api/v2/tafsir/${id}`)
        setTafsir(response.data.data)
        setLoading(false)
      } catch (err) {
        setError('Terjadi kesalahan saat memuat data tafsir')
        setLoading(false)
        Swal.fire({
          title: 'Error!',
          text: 'Terjadi kesalahan saat memuat data tafsir',
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#16a34a'
        })
      }
    }

    fetchTafsir()
  }, [id])

  // Fungsi untuk merender HTML dengan aman
  const createMarkup = (htmlContent) => {
    return { __html: htmlContent }
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
      {tafsir && (
        <>
          <div className="mb-6">
            <Link to="/quran" className="inline-flex items-center text-primary hover:underline mr-4">
              <FaArrowLeft className="mr-2" /> Kembali ke Daftar Surah
            </Link>
            <Link to={`/quran/${tafsir.nomor}`} className="inline-flex items-center text-secondary hover:underline">
              <FaQuran className="mr-2" /> Baca Surah {tafsir.namaLatin || tafsir.nama_latin}
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">Tafsir Surah {tafsir.namaLatin || tafsir.nama_latin}</h1>
              <p className="text-4xl font-arabic text-primary mb-2">{tafsir.nama}</p>
              <p className="text-lg mb-2">{tafsir.arti}</p>
              <div className="flex justify-center items-center space-x-4 text-sm text-gray-600">
                <span>{(tafsir.tempatTurun || tafsir.tempat_turun) === 'Mekah' ? 'Makkiyah' : 'Madaniyah'}</span>
                <span>•</span>
                <span>{tafsir.jumlahAyat || tafsir.jumlah_ayat} Ayat</span>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">Deskripsi</h2>
              <div className="prose max-w-none">
                {/* Menggunakan dangerouslySetInnerHTML untuk render HTML */}
                <div 
                  dangerouslySetInnerHTML={createMarkup(tafsir.deskripsi)} 
                  className="text-gray-800 leading-relaxed"
                />
              </div>
            </div>

            <div className="space-y-8">
              <h2 className="text-xl font-bold mb-4">Tafsir Per Ayat</h2>
              {tafsir.tafsir && tafsir.tafsir.map((item) => (
                <div key={item.ayat} className="border-b pb-6 last:border-0">
                  <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg mb-4">
                    <span className="w-8 h-8 flex items-center justify-center bg-primary text-white rounded-full font-medium">
                      {item.ayat}
                    </span>
                  </div>
                  <div className="prose max-w-none">
                    {/* Menangani kemungkinan HTML di teks tafsir juga */}
                    <div 
                      dangerouslySetInnerHTML={createMarkup(item.teks)} 
                      className="text-gray-800 leading-relaxed"
                    />
                  </div>
                </div>
              ))}
            </div>
            
            {/* Tombol navigasi kembali ke surah di bagian bawah */}
            <div className="mt-8 flex justify-center">
              <Link 
                to={`/surah/${tafsir.nomor}`} 
                className="inline-flex items-center justify-center bg-primary text-white px-6 py-3 rounded-lg hover:bg-secondary/90 transition"
              >
                <FaChevronLeft className="mr-2" /> Kembali ke Surah {tafsir.namaLatin || tafsir.nama_latin}
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default TafsirDetail