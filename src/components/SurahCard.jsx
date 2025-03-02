import React from 'react'
import { motion } from 'framer-motion'

const SurahCard = ({ surah, onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
      className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300 cursor-pointer"
      onClick={onClick}
    >
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center">
            <div className="w-10 h-10 flex items-center justify-center bg-emerald-100 text-emerald-600 rounded-full font-medium">
              {surah.nomor}
            </div>
            <div className="ml-3">
              <h3 className="font-bold text-lg">{surah.namaLatin}</h3>
              <p className="text-gray-600 text-sm">{surah.arti}</p>
            </div>
          </div>
          <p className="text-right font-arabic text-2xl text-emerald-600">{surah.nama}</p>
        </div>
        
        <div className="flex justify-between items-center text-sm text-gray-500 pt-3 border-t border-gray-100">
          <p>{surah.tempatTurun === 'Mekah' ? 'Makkiyah' : 'Madaniyah'}</p>
          <p>{surah.jumlahAyat} Ayat</p>
        </div>
      </div>
    </motion.div>
  )
}

export default SurahCard