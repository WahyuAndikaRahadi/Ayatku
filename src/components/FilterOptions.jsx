import { useState, useEffect } from 'react'

const FilterOptions = ({ onFilterChange }) => {
  const [filterType, setFilterType] = useState('surah')
  const [selectedValue, setSelectedValue] = useState('')
  
  // Generate juz options (1-30)
  const juzOptions = Array.from({ length: 30 }, (_, i) => i + 1)
  
  useEffect(() => {
    onFilterChange(filterType, selectedValue)
  }, [filterType, selectedValue, onFilterChange])

  const handleJuzSelect = (juzNumber) => {
    setSelectedValue(juzNumber.toString())
  }
  
  return (
    <div className="filter-options bg-white rounded-lg shadow-lg mb-8 overflow-hidden border border-gray-100">
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-4">
        <h3 className="font-bold text-xl text-white">Al-Quran Navigation</h3>
      </div>
      
      <div className="p-5">
        <div className="flex items-center justify-center mb-6">
          <button
            onClick={() => {
              setFilterType('surah')
              setSelectedValue('')
            }}
            className={`px-6 py-3 rounded-l-full font-medium text-sm transition-all duration-200 ${
              filterType === 'surah' 
                ? 'bg-emerald-500 text-white shadow-md' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            SEMUA SURAH
          </button>
          
          <button
            onClick={() => {
              setFilterType('juz')
              setSelectedValue('')
            }}
            className={`px-6 py-3 rounded-r-full font-medium text-sm transition-all duration-200 ${
              filterType === 'juz' 
                ? 'bg-emerald-500 text-white shadow-md' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            BERDASARKAN JUZ
          </button>
        </div>
        
        {filterType === 'juz' && (
          <div className="mt-4">
            <h4 className="text-gray-700 font-medium mb-3 text-center">Pilih Juz</h4>
            <div className="grid grid-cols-5 gap-2 md:grid-cols-6 lg:grid-cols-10">
              {juzOptions.map((juz) => (
                <button
                  key={juz}
                  onClick={() => handleJuzSelect(juz)}
                  className={`
                    p-2 rounded-md text-center transition-all duration-200
                    ${selectedValue === juz.toString() 
                      ? 'bg-emerald-500 text-white font-medium shadow-md' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
                  `}
                >
                  {juz}
                </button>
              ))}
            </div>
            {selectedValue && (
              <div className="mt-4 flex justify-center">
                <button
                  onClick={() => setSelectedValue('')}
                  className="text-sm text-emerald-600 hover:text-emerald-800 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Reset Pilihan
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default FilterOptions