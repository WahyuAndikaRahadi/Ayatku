// IslamicDictionary.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import dictionaryData from '../data/dictionaryData'; // Import data kamus

const IslamicDictionary = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Modified filter logic to search only by 'word'
  const filteredTerms = dictionaryData.filter(term =>
    term.word.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container-custom py-8">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-10 text-center"
      >
        <h1 className="text-3xl font-bold mb-2">Kamus Islam</h1>
        <p className="text-gray-600">
          Jelajahi dan pahami ribuan istilah penting dalam Islam dengan penjelasan yang komprehensif dan mudah dicerna.
        </p>
      </motion.div>

      {/* Search Section */}
      <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
        {/* Search Input */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex items-center border-b-2 border-gray-200 pb-5 mb-6"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-[#16a34a] mr-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Cari istilah..."
            className="w-full p-3 text-xl border-none focus:ring-[#16a34a] focus:border-[#16a34a] transition-all duration-200 rounded-lg bg-white" // Added bg-white here
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </motion.div>
      </div>

      {/* Terms List - Now as a continuous list */}
      <div className="bg-white rounded-3xl shadow-xl p-8">
        {filteredTerms.length > 0 ? (
          <div className="divide-y divide-gray-200"> {/* Use divide-y for separators */}
            {filteredTerms.map((term, index) => (
              <motion.div
                key={term.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.05 * index }} // Staggered animation
                className="py-6 first:pt-0 last:pb-0" // Add vertical padding, remove top padding for first, bottom for last
              >
                <h3 className="font-bold text-gray-900 text-2xl mb-2 leading-snug">
                  {term.word}
                  {term.category && (
                    <span className="text-gray-500 text-sm italic ml-3 font-normal">({term.category})</span>
                  )}
                </h3>
                <div className="flex items-start mb-4">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-4 flex-shrink-0 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-gray-800 text-lg leading-relaxed">{term.meaning}</p>
                </div>

                {term.example && (
                  <div className="bg-green-50 p-4 rounded-xl border border-green-200 ml-14"> {/* Indent example */}
                    <div className="flex items-center mb-2">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3 flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                      <span className="font-semibold text-gray-800 text-md">Deskripsi Tambahan :</span>
                    </div>
                    <p className="text-gray-700 text-base italic leading-relaxed">{term.example}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="col-span-full text-center py-12 text-gray-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-2xl font-semibold mb-2">Ups, istilah tidak ditemukan!</h3>
            <p className="text-lg">Coba gunakan kata kunci lain atau periksa ejaan Anda.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default IslamicDictionary;