import { useState, useEffect } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'

const Calendar = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [todayHijri, setTodayHijri] = useState(null)
  const [daysNames, setDaysNames] = useState([])
  const [monthsNames, setMonthsNames] = useState([])
  const [calendarDays, setCalendarDays] = useState([])
  const [activeMonth, setActiveMonth] = useState(null)
  
  useEffect(() => {
    const fetchCalendarData = async () => {
      try {
        setLoading(true)
        
        // Fetch current Hijri date
        const hijriResponse = await axios.get('https://api.myquran.com/v2/cal/hijr/?adj=-1')
        
        // Fetch days names
        const daysResponse = await axios.get('https://api.myquran.com/v2/cal/list/days')
        
        // Fetch months names
        const monthsResponse = await axios.get('https://api.myquran.com/v2/cal/list/months')
        
        // Set state with fetched data
        if (hijriResponse.data.status) {
          setTodayHijri(hijriResponse.data.data)
          setActiveMonth(hijriResponse.data.data.num[6])
          
          // Generate calendar days for current month
          generateCalendarDays(hijriResponse.data.data.num)
        }
        
        if (daysResponse.data.status) {
          setDaysNames(daysResponse.data.data.id)
        }
        
        if (monthsResponse.data.status) {
          setMonthsNames(monthsResponse.data.data.id)
        }
        
        setLoading(false)
      } catch (err) {
        console.error('Error fetching calendar data:', err)
        setError('Terjadi kesalahan saat memuat data kalender')
        setLoading(false)
      }
    }
    
    fetchCalendarData()
  }, [])
  
  // Generate calendar days for the current Hijri month
  const generateCalendarDays = (dateNumbers) => {
    if (!dateNumbers || dateNumbers.length < 7) return
    
    const [dayOfWeek, dayOfMonth, , , , , hijriYear] = dateNumbers
    const currentMonth = dateNumbers[6] // Hijri month number (1-12)
    const currentDay = dateNumbers[1]   // Hijri day of month
    
    // Determine days in the month (approximate - Hijri months can be 29 or 30 days)
    const isLeapYear = (hijriYear % 30) === 2 || (hijriYear % 30) === 5 || 
                       (hijriYear % 30) === 7 || (hijriYear % 30) === 10 || 
                       (hijriYear % 30) === 13 || (hijriYear % 30) === 16 || 
                       (hijriYear % 30) === 18 || (hijriYear % 30) === 21 || 
                       (hijriYear % 30) === 24 || (hijriYear % 30) === 26 || 
                       (hijriYear % 30) === 29;
    
    const daysInMonth = currentMonth % 2 !== 0 ? 30 : 
                        (currentMonth === 12 && isLeapYear) ? 30 : 29;
    
    // Calculate the first day of the month
    const firstDayOffset = (((dayOfWeek - 1) % 7) + 7 - ((currentDay - 1) % 7)) % 7;
    
    // Generate array of days
    const days = [];
    
    // Add empty cells for days before the first of the month
    for (let i = 0; i < firstDayOffset; i++) {
      days.push({ day: null, isCurrentDay: false });
    }
    
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        isCurrentDay: i === currentDay
      });
    }
    
    setCalendarDays(days);
  }
  
  const getSpecialDayInfo = (day, month) => {
    if (!month) return null;
    
    // Comprehensive list of special Islamic days for all months
    const specialDays = {
      'Muharram': {
        1: 'Tahun Baru Hijriyah',
        9: 'Puasa Tasu\'a',
        10: 'Hari Asyura'
      },
      'Shafar': {
        // No official special days
      },
      'Rabiul Awal': {
        12: 'Maulid Nabi Muhammad SAW'
      },
      'Rabiul Akhir': {
        // No official special days
      },
      'Jumadil Awal': {
        // No official special days
      },
      'Jumadil Akhir': {
        // No official special days
      },
      'Rajab': {
        1: 'Awal Bulan Istimewa',
        27: 'Isra\' Mi\'raj'
      },
      'Sya\'ban': {
        15: 'Nisfu Sya\'ban'
      },
      'Ramadhan': {
        1: 'Awal Ramadhan',
        10: 'Wafatnya Khadijah',
        17: 'Nuzulul Qur\'an & Perang Badar',
        21: 'Malam Lailatul Qadr (kemungkinan)',
        23: 'Malam Lailatul Qadr (kemungkinan)',
        25: 'Malam Lailatul Qadr (kemungkinan)',
        27: 'Malam Lailatul Qadr (kemungkinan utama)',
        29: 'Malam Lailatul Qadr (kemungkinan)'
      },
      'Syawal': {
        1: 'Idul Fitri',
        2: 'Awal Puasa Sunnah Syawal'
      },
      'Dzulqa\'dah': {
        // Bulan Haram (dimuliakan)
      },
      'Dzulhijjah': {
        1: 'Awal 10 Hari Istimewa',
        8: 'Hari Tarwiyah',
        9: 'Hari Arafah',
        10: 'Idul Adha',
        11: 'Hari Tasyrik Pertama',
        12: 'Hari Tasyrik Kedua',
        13: 'Hari Tasyrik Ketiga'
      }
    };
    
    // Check for standard month dates
    if (specialDays[month] && specialDays[month][day]) {
      return specialDays[month][day];
    }
    
    // Weekly and monthly special days
    const weeklyAndMonthlyEvents = [];
    
    // Check for Ayyamul Bidh (13-15 of every month)
    if (day >= 13 && day <= 15) {
      weeklyAndMonthlyEvents.push('Ayyamul Bidh');
    }
    
    // Return first event if any (could be extended to return multiple)
    return weeklyAndMonthlyEvents.length > 0 ? weeklyAndMonthlyEvents[0] : null;
  }
  
  // Determine if a day is a weekly special day (Monday, Thursday, Friday)
  const isWeeklySpecialDay = (day) => {
    if (!todayHijri || !day) return false;
    
    // Calculate the day of week (1-7) for the given day
    const currentDayOfWeek = todayHijri.num[0]; // Day of week for current day
    const currentDay = todayHijri.num[1];       // Current day of month
    
    // Calculate difference between current day and the day we're checking
    const dayDiff = day - currentDay;
    
    // Calculate the day of week for the day we're checking
    let dayOfWeek = (currentDayOfWeek + dayDiff) % 7;
    if (dayOfWeek <= 0) dayOfWeek += 7;
    
    // Check if it's Monday (1), Thursday (4), or Friday (5)
    return dayOfWeek === 1 || dayOfWeek === 4 || dayOfWeek === 5;
  }

  // Get all special days for the current month
  const getCurrentMonthSpecialDays = () => {
    if (!todayHijri || !monthsNames[todayHijri.num[6] - 1]) return [];
    
    const currentMonth = monthsNames[todayHijri.num[6] - 1];
    const specialDaysForMonth = [];
    
    // Comprehensive lookup table for all special days
    const allSpecialDays = {
      'Muharram': [
        { day: 1, event: 'Tahun Baru Hijriyah' },
        { day: 1, event: 'Lebaran Anak Yatim (tradisi Indonesia)' },
        { day: 9, event: 'Puasa Tasu\'a' },
        { day: 10, event: 'Hari Asyura' },
        { day: 10, event: 'Sedekah Asyura (tradisi Indonesia)' }
      ],
      'Shafar': [
        // No official special days - just mention it's a sacred month
        { day: 1, event: 'Awal Bulan Shafar (bulan dimuliakan)' }
      ],
      'Rabiul Awal': [
        { day: 12, event: 'Maulid Nabi Muhammad SAW' },
        { day: 12, event: 'Tradisi Muludan (Indonesia)' }
      ],
      'Rabiul Akhir': [],
      'Jumadil Awal': [],
      'Jumadil Akhir': [],
      'Rajab': [
        { day: 1, event: 'Awal Bulan Istimewa (perbanyak istighfar)' },
        { day: 27, event: 'Isra\' Mi\'raj' },
        { day: 27, event: 'Pengajian Akbar (tradisi Indonesia)' }
      ],
      'Sya\'ban': [
        { day: 15, event: 'Nisfu Sya\'ban (malam doa dan ampunan)' },
        { day: 15, event: 'Tradisi Nisfu Sya\'ban (dzikir bersama)' }
      ],
      'Ramadhan': [
        { day: 1, event: 'Awal Puasa Ramadhan' },
        { day: 10, event: 'Wafatnya Khadijah (istri Nabi)' },
        { day: 17, event: 'Nuzulul Quran' },
        { day: 17, event: 'Perang Badar Pertama' },
        { day: 21, event: 'Malam Lailatul Qadr (kemungkinan)' },
        { day: 23, event: 'Malam Lailatul Qadr (kemungkinan)' },
        { day: 25, event: 'Malam Lailatul Qadr (kemungkinan)' },
        { day: 27, event: 'Malam Lailatul Qadr (kemungkinan utama)' },
        { day: 29, event: 'Malam Lailatul Qadr (kemungkinan)' }
      ],
      'Syawal': [
        { day: 1, event: 'Hari Raya Idul Fitri' },
        { day: 2, event: 'Awal Puasa Sunnah Syawal' }
      ],
      'Dzulqa\'dah': [
        { day: 1, event: 'Awal Bulan Haram (bulan dimuliakan)' }
      ],
      'Dzulhijjah': [
        { day: 1, event: 'Awal 10 Hari Istimewa' },
        { day: 8, event: 'Hari Tarwiyah (persiapan wukuf haji)' },
        { day: 9, event: 'Hari Arafah (puasa sunnah terbaik)' },
        { day: 9, event: 'Khotbah Wada\' Nabi' },
        { day: 10, event: 'Hari Raya Idul Adha' },
        { day: 11, event: 'Hari Tasyrik Pertama' },
        { day: 12, event: 'Hari Tasyrik Kedua' },
        { day: 13, event: 'Hari Tasyrik Ketiga' }
      ]
    };
    
    // Add special days for the current month
    if (allSpecialDays[currentMonth]) {
      return allSpecialDays[currentMonth];
    }
    
    return specialDaysForMonth;
  }

  // Function to navigate to next month
  const navigateMonth = (direction) => {
    if (!todayHijri) return;
    
    let newMonth = activeMonth + direction;
    
    // Handle year change
    if (newMonth > 12) {
      newMonth = 1;
    } else if (newMonth < 1) {
      newMonth = 12;
    }
    
    setActiveMonth(newMonth);
    
    // This is a simplified approach - in a real app you'd need to
    // recalculate the calendar days for the new month properly
    // This would involve API calls or more complex date calculations
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 flex justify-center items-center min-h-[60vh]">
        <div className="relative w-20 h-20">
          <div className="absolute top-0 left-0 right-0 bottom-0 rounded-full border-4 border-gray-200"></div>
          <div className="absolute top-0 left-0 right-0 bottom-0 rounded-full border-4 border-transparent border-t-emerald-600 animate-spin"></div>
          <div className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center">
            <div className="text-emerald-600 text-lg">🌙</div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 flex justify-center items-center min-h-[60vh]">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full">
          <div className="flex items-center mb-4">
            <div className="bg-red-100 rounded-full p-2 mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-red-700">Error</h2>
          </div>
          <p className="text-red-600">{error}</p>
          <button 
            className="mt-4 bg-red-100 hover:bg-red-200 text-red-700 font-medium py-2 px-4 rounded-md transition-colors duration-300"
            onClick={() => window.location.reload()}
          >
            Coba Lagi
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-emerald-800">Kalender Hijriyah</h1>
          <p className="text-gray-600">
            Menampilkan tanggal Hijriyah berdasarkan zona waktu WIB
          </p>
        </motion.div>

        {todayHijri && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl shadow-xl overflow-hidden mb-8"
          >
            <div className="relative overflow-hidden">
              <div className="absolute top-0 right-0 opacity-10">
                <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 0C121.9 0 143.8 8.58317 160.355 25.1381C176.93 41.6931 185.5 63.5603 185.5 85.5C185.5 111.2 173.46 135.089 152.8 148.8C149.87 150.77 149.18 154.77 151.14 157.7C153.11 160.63 157.11 161.32 160.04 159.36C183.95 143.65 198 115.65 198 85.5C198 60.3131 188.307 35.8838 169.497 17.0736C150.687 -1.73667 126.233 -11.5 101 -11.5C45.15 -11.5 0 33.65 0 89.5C0 122.32 16.5 152.14 43.7 168.47C46.63 170.42 50.63 169.72 52.59 166.79C54.55 163.85 53.85 159.85 50.92 157.9C27.84 143.9 13.5 118.26 13.5 89.5C13.5 41.2 51.7 3 100 3V0Z" fill="white"/>
                  <path d="M100 44C88.9543 44 80 52.9543 80 64C80 75.0457 88.9543 84 100 84C111.046 84 120 75.0457 120 64C120 52.9543 111.046 44 100 44Z" fill="white"/>
                </svg>
              </div>
              
              <div className="flex flex-col md:flex-row justify-between items-center p-6 md:p-8">
                <div className="mb-4 md:mb-0">
                  <div className="text-emerald-100 font-medium">{todayHijri.date[0]}</div>
                  <h2 className="text-4xl font-bold mt-1">{todayHijri.date[1]}</h2>
                  <p className="text-emerald-100 text-lg mt-1">{todayHijri.date[2]}</p>
                </div>
                
                <div className="flex items-center justify-center bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-6 md:p-8">
                  <div className="text-center">
                    <div className="font-bold text-5xl">{todayHijri.num[1]}</div>
                    <div className="mt-1 font-medium text-lg">{monthsNames[todayHijri.num[6] - 1]}</div>
                    <div className="mt-1 text-sm text-emerald-100">{todayHijri.num[7]} H</div>
                  </div>
                </div>
              </div>
              
              {getSpecialDayInfo(todayHijri.num[1], monthsNames[todayHijri.num[6] - 1]) && (
                <div className="mx-6 md:mx-8 mb-6 px-4 py-3 bg-white bg-opacity-15 backdrop-blur-sm rounded-xl">
                  <div className="flex items-center">
                    <span className="mr-3 text-xl">🌙</span>
                    <p className="font-medium">
                      {getSpecialDayInfo(todayHijri.num[1], monthsNames[todayHijri.num[6] - 1])}
                    </p>
                  </div>
                </div>
              )}
              
              {isWeeklySpecialDay(todayHijri.num[1]) && (
                <div className="mx-6 md:mx-8 mb-6 px-4 py-3 bg-white bg-opacity-15 backdrop-blur-sm rounded-xl">
                  <div className="flex items-center">
                    <span className="mr-3 text-xl">📅</span>
                    <p className="font-medium">
                      {todayHijri.date[0] === 'Jumat' ? 'Sayyidul Ayyam (Penghulu Hari)' : 
                      (todayHijri.date[0] === 'Senin' || todayHijri.date[0] === 'Kamis') ? 'Hari Sunnah Puasa' : ''}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="border-b border-gray-100">
            <div className="flex justify-between items-center p-6">
              <button 
                onClick={() => navigateMonth(-1)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <h2 className="text-xl font-bold text-gray-800">
                {todayHijri && monthsNames[activeMonth - 1]} {todayHijri && todayHijri.num[7]}
                <span className="ml-2 text-sm font-medium px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full">
                  {todayHijri && todayHijri.num[7]} H
                </span>
              </h2>
              
              <button 
                onClick={() => navigateMonth(1)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
          
          <div className="px-2 py-4 md:px-6">
            <div className="grid grid-cols-7 mb-2">
              {daysNames.map((day, index) => (
                <div key={index} className="text-center py-2">
                  <span className="text-sm font-medium text-gray-700">
                    {day.substring(0, 3)}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-1 md:gap-2">
              {calendarDays.map((dayObj, index) => {
                // Determine if this is a special day (Islamic holiday or Ayyamul Bidh)
                const isSpecialDay = dayObj.day && todayHijri && 
                  getSpecialDayInfo(dayObj.day, monthsNames[todayHijri.num[6] - 1]);
                
                // Check if it's a weekly special day (Monday, Thursday, Friday)
                const isWeeklySpecial = dayObj.day && isWeeklySpecialDay(dayObj.day);
                
                return (
                  <div 
                    key={index} 
                    className={`aspect-square flex flex-col items-center justify-center rounded-lg p-1 transition-all duration-200 ${
                      dayObj.isCurrentDay 
                        ? 'bg-emerald-600 text-white shadow-md' 
                        : isSpecialDay
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : isWeeklySpecial
                            ? 'bg-blue-50 text-blue-800 hover:bg-blue-100'
                            : dayObj.day 
                              ? 'hover:bg-gray-100' 
                              : ''
                    }`}
                  >
                    {dayObj.day && (
                      <>
                        <span className={`text-base md:text-lg ${dayObj.isCurrentDay ? 'font-bold' : ''}`}>
                          {dayObj.day}
                        </span>
                        
                        {isSpecialDay && (
                          <span className={`text-xs mt-1 ${dayObj.isCurrentDay ? 'text-emerald-200' : 'text-emerald-600'}`}>
                            {dayObj.isCurrentDay ? '🌙' : '•'}
                          </span>
                        )}
                        
                        {!isSpecialDay && isWeeklySpecial && (
                          <span className={`text-xs mt-1 ${dayObj.isCurrentDay ? 'text-emerald-200' : 'text-blue-600'}`}>
                            {dayObj.isCurrentDay ? '📅' : '•'}
                          </span>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="border-t border-gray-100 mt-4">
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
                    <span className="mr-2 text-emerald-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </span>
                    Hari Penting Bulan Ini
                  </h3>
                  
                  <div className="bg-gray-50 rounded-xl p-4">
                    <ul className="space-y-3">
                      {todayHijri && getCurrentMonthSpecialDays().length > 0 ? (
                        getCurrentMonthSpecialDays().map((item, index) => (
                          <li key={index} className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mr-3 shrink-0">
                              {item.day}
                            </div>
                            <span className="text-gray-700">{item.event}</span>
                          </li>
                        ))
                      ) : (
                        <li className="text-gray-500 italic text-center py-4">Tidak ada hari penting khusus di bulan ini</li>
                      )}
                    </ul>
                  </div>
                </div>
                
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
                    <span className="mr-2 text-blue-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </span>
                    Hari Penting Rutin
                  </h3>
                  
                  <div className="bg-gray-50 rounded-xl p-4">
                    <ul className="space-y-3">
                      <li className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mr-3 shrink-0 text-xs font-medium">
                          Jum
                        </div>
                        <span className="text-gray-700">Sayyidul Ayyam (Penghulu Hari)</span>
                      </li>
                      <li className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mr-3 shrink-0 text-xs font-medium">
                          Sen
                        </div>
                        <span className="text-gray-700">Hari Sunnah Puasa</span>
                      </li>
                      <li className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mr-3 shrink-0 text-xs font-medium">
                          Kam
                        </div>
                        <span className="text-gray-700">Hari Sunnah Puasa</span>
                      </li>
                      <li className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mr-3 shrink-0 text-xs font-medium">
                          13-15
                        </div>
                        <span className="text-gray-700">Ayyamul Bidh (Puasa Pertengahan Bulan)</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 text-center text-gray-500 text-sm"
        >
          <p>
            Data kalender Hijriyah diolah menggunakan perhitungan astronomis.
            <br />
            Tanggal Hijriyah yang ditampilkan mungkin berbeda dengan penetapan resmi pemerintah.
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default Calendar