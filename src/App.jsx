import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Quran from './pages/Quran'
import Hadith from './pages/Hadith'
import SurahDetail from './components/SurahDetail'
import TafsirDetail from './components/TafsirDetail'
import HadithDetail from './components/HadithDetail'
import Prayer from './pages/Prayer'
import AsmaulHusna from './pages/AsmaulHusna'
import Doa from './pages/Doa'
import DoaDetail from './components/DoaDetail'
import Calendar from './pages/Calendar'
import QiblaDirection from './pages/QiblaDirection'
import IslamicBlog from './pages/IslamicBlog'

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
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
        </Routes>
      </div>
      <Footer />
    </div>
  )
}

export default App