import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Scrollbars from 'react-scrollbars-custom'; // Diubah: Impor sebagai default export

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Quran from './pages/Quran';
import Hadith from './pages/Hadith';
import SurahDetail from './components/SurahDetail';
import TafsirDetail from './components/TafsirDetail';
import HadithDetail from './components/HadithDetail';
import Prayer from './pages/Prayer';
import AsmaulHusna from './pages/AsmaulHusna';
import Doa from './pages/Doa';
import DoaDetail from './components/DoaDetail';
import Calendar from './pages/Calendar';
import QiblaDirection from './pages/QiblaDirection';
import IslamicBlog from './pages/IslamicBlog';
import NotFound from './pages/NotFound';
import IslamicQABot from './pages/IslamicQABot';
import TasbihDigital from './pages/TasbihDigital';

function App() {
  return (
    // Bungkus seluruh konten aplikasi dengan Scrollbars untuk mengaktifkan scrollbar kustom
    <Scrollbars
      // Mengatur lebar dan tinggi Scrollbars agar mencakup seluruh viewport
      style={{ width: '100vw', height: '100vh' }}
      // Mengatur styling untuk track (jalur) scrollbar vertikal
      trackYProps={{
        style: {
          backgroundColor: '#f1f1f1', // Warna abu-abu terang untuk track
          width: '8px', // Lebar track, bisa disesuaikan agar lebih ramping
          right: '0px', // Memastikan track berada di sisi kanan
        }
      }}
      // Mengatur styling untuk thumb (pegangan) scrollbar vertikal
      thumbYProps={{
        style: {
          backgroundColor: '#059669', // Warna hijau emerald (Emerald-600)
          borderRadius: '4px', // Membuat sudut membulat pada thumb
        }
      }}
      // Mengatur lebar thumb (pegangan)
      thumbMinSize={20} // Ukuran minimum thumb (dalam piksel)
      // Mengatur apakah scrollbar harus selalu terlihat atau hanya saat discroll
      noScrollX={true} // Pastikan tidak ada scrollbar horizontal
      // autoHide // Uncomment ini jika Anda ingin scrollbar otomatis tersembunyi saat tidak digunakan
      // autoHideTimeout={1000} // Waktu sebelum scrollbar tersembunyi (jika autoHide aktif)
      // autoHideDuration={200} // Durasi animasi penyembunyian
    >
      {/* Konten utama aplikasi Anda */}
      <div className="flex flex-col min-h-screen">
        <Navbar /> {/* Navbar Anda yang sudah sticky */}
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/quran" element={<Quran />} />
            <Route path="/surah/:id" element={<SurahDetail />} />
            <Route path="/tafsir/:id" element={<TafsirDetail />} />
            <Route path="/doa/:category/:id"  element={<DoaDetail />} />
            <Route path="/hadith" element={<Hadith />} />
            <Route path="/asmaulhusna" element={<AsmaulHusna />} />
            <Route path="/doa" element={<Doa />} />
            <Route path="/blog" element={<IslamicBlog />} />
            <Route path="/kiblat" element={<QiblaDirection />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/prayer" element={<Prayer />} />
            <Route path="/hadith/:bookId/:number" element={<HadithDetail />} />
            <Route path="/ai-qna" element={<IslamicQABot />} />
            <Route path="/tasbih" element={<TasbihDigital />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Scrollbars>
  );
}

export default App;
