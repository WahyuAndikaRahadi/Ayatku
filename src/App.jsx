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
          <Route path="/hadith" element={<Hadith />} />
          <Route path="/prayer" element={<Prayer />} />
          <Route path="/hadith/:bookId/:number" element={<HadithDetail />} />
        </Routes>
      </div>
      <Footer />
    </div>
  )
}

export default App