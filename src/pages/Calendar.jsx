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
  const [activeYear, setActiveYear] = useState(null)
  const [currentDisplayDate, setCurrentDisplayDate] = useState(null)

  useEffect(() => {
    const fetchCalendarData = async () => {
      try {
        setLoading(true);

        // Fetch current Hijri date
        const hijriResponse = await axios.get('https://api.myquran.com/v2/cal/hijr/?adj=-1');

        // Fetch days names
        const daysResponse = await axios.get('https://api.myquran.com/v2/cal/list/days');

        // Fetch months names
        const monthsResponse = await axios.get('https://api.myquran.com/v2/cal/list/months');

        // Set state with fetched data
        if (hijriResponse.data.status) {
          const hijriData = hijriResponse.data.data;
          setTodayHijri(hijriData);

          // Extract values from the API response
          // From your example: [1,2,3,2025,2,9,1446] 
          // Indexes: [dayOfWeek, dayOfMonth, gregorianDay, gregorianYear, gregorianMonth, hijriMonth, hijriYear]
          const month = parseInt(hijriData.num[5]); // Hijri month is at index 5 
          const year = parseInt(hijriData.num[6]); // Hijri year is at index 6
          const day = parseInt(hijriData.num[1]); // Day of month is at index 1

          setActiveMonth(month);
          setActiveYear(year);
          setCurrentDisplayDate({
            month: month,
            year: year,
            day: day
          });
        }

        if (daysResponse.data.status) {
          setDaysNames(daysResponse.data.data.id);
        }

        if (monthsResponse.data.status) {
          setMonthsNames(monthsResponse.data.data.id);
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching calendar data:', err);
        setError('Terjadi kesalahan saat memuat data kalender');
        setLoading(false);
      }
    };

    fetchCalendarData();
  }, []);

  // Effect to generate calendar days when active month/year changes
  useEffect(() => {
    if (activeMonth && activeYear) {
      generateCalendarDaysForMonth(activeMonth, activeYear);
    }
  }, [activeMonth, activeYear]);

  // Generate calendar days for any given Hijri month and year
  const generateCalendarDaysForMonth = (month, year) => {
    // Make sure we're working with numbers
    month = parseInt(month);
    year = parseInt(year);

    // Determine if the year is a leap year in Hijri calendar
    const isLeapYear = (year % 30) === 2 || (year % 30) === 5 ||
      (year % 30) === 7 || (year % 30) === 10 ||
      (year % 30) === 13 || (year % 30) === 16 ||
      (year % 30) === 18 || (year % 30) === 21 ||
      (year % 30) === 24 || (year % 30) === 26 ||
      (year % 30) === 29;

    // Determine days in the month (in Hijri calendar)
    const daysInMonth = month % 2 !== 0 ? 30 : 
      (month === 12 && isLeapYear) ? 30 : 29;

    // Create a fixed calculation for the first day of the month
    // This is a simplified approximation - production would use a more accurate algorithm
    let firstDayOfMonth;
    
    if (todayHijri) {
      // Extract current data from API
      const currentDay = parseInt(todayHijri.num[1]);
      const currentMonth = parseInt(todayHijri.num[5]);
      const currentDayOfWeek = parseInt(todayHijri.num[0]);
      const currentYear = parseInt(todayHijri.num[6]);
      
      // Calculate day difference
      let monthDiff = month - currentMonth;
      let yearDiff = year - currentYear;
      
      // Adjust for year boundaries
      if (monthDiff < 0) {
        monthDiff += 12;
        yearDiff -= 1;
      }
      
      // Find the weekday of the first day of the current month
      const daysPassed = currentDay - 1;
      const firstDayOfCurrentMonth = (currentDayOfWeek - (daysPassed % 7) + 7) % 7 || 7;
      
      // Calculate first day of target month (simplified)
      firstDayOfMonth = firstDayOfCurrentMonth;
      
      // Adjust for months between current and target
      let totalDaysDiff = 0;
      
      // For each month between current and target
      if (yearDiff === 0) {
        // Same year calculation
        for (let m = currentMonth; m < month; m++) {
          totalDaysDiff += (m % 2 !== 0) ? 30 : 29;
        }
      } else {
        // Add remaining days in current year
        for (let m = currentMonth; m <= 12; m++) {
          totalDaysDiff += (m % 2 !== 0) ? 30 : 29;
        }
        
        // Add days for full years between
        for (let y = 1; y < yearDiff; y++) {
          totalDaysDiff += 354; // Simplified (ignoring leap years)
        }
        
        // Add days for months in the target year
        for (let m = 1; m < month; m++) {
          totalDaysDiff += (m % 2 !== 0) ? 30 : 29;
        }
      }
      
      // Calculate first day of month based on day difference
      firstDayOfMonth = (firstDayOfCurrentMonth + totalDaysDiff) % 7 || 7;
    } else {
      // Fallback to Sunday if no data
      firstDayOfMonth = 1;
    }

    // Generate array of days
    const days = [];

    // Add empty cells for days before the first of the month
    for (let i = 1; i < firstDayOfMonth; i++) {
      days.push({ day: null, isCurrentDay: false });
    }

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const isCurrentDay = (
        todayHijri && 
        i === parseInt(todayHijri.num[1]) && 
        month === parseInt(todayHijri.num[5]) && 
        year === parseInt(todayHijri.num[6])
      );
      
      days.push({
        day: i,
        isCurrentDay: isCurrentDay
      });
    }

    setCalendarDays(days);
  };

  // Function to navigate to next month
  const navigateMonth = (direction) => {
    let newMonth = activeMonth + direction;
    let newYear = activeYear;

    // Handle year change
    if (newMonth > 12) {
      newMonth = 1;
      newYear += 1;
    } else if (newMonth < 1) {
      newMonth = 12;
      newYear -= 1;
    }

    setActiveMonth(newMonth);
    setActiveYear(newYear);
  };

  // Function to navigate back to today
  const goToToday = () => {
    if (todayHijri) {
      const currentMonth = parseInt(todayHijri.num[5]);
      const currentYear = parseInt(todayHijri.num[6]);
      
      setActiveMonth(currentMonth);
      setActiveYear(currentYear);
    }
  };

  // Get special day info for a specific day
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
  };

  // Determine if a day is a weekly special day (Monday, Thursday, Friday)
  const isWeeklySpecialDay = (day) => {
    if (!todayHijri || !day) return false;

    // Calculate the day of week (1-7) for the given day
    // In the API, day of week is 1=Sunday, 2=Monday, etc.
    const currentDayOfWeek = parseInt(todayHijri.num[0]);
    const currentDay = parseInt(todayHijri.num[1]);
    
    // Calculate difference between current day and the day we're checking
    const dayDiff = day - currentDay;
    
    // Calculate the day of week for the day we're checking
    let dayOfWeek = (currentDayOfWeek + dayDiff) % 7;
    if (dayOfWeek <= 0) dayOfWeek += 7;
    
    // Check if it's Monday (2), Thursday (5), or Friday (6)
    // Note: API uses 1=Sunday, 2=Monday, 3=Tuesday, 4=Wednesday, 5=Thursday, 6=Friday, 7=Saturday
    return dayOfWeek === 2 || dayOfWeek === 5 || dayOfWeek === 6;
  };

  // Get all special days for the specified month
  const getMonthSpecialDays = (month) => {
    if (!monthsNames[month - 1]) return [];

    const monthName = monthsNames[month - 1];

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

    // Add special days for the specified month
    if (allSpecialDays[monthName]) {
      return allSpecialDays[monthName];
    }

    return [];
  };

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
    );
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
    );
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
          <h1 className="text-3xl font-bold mb-2">Kalender Hijriyah</h1>
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
                  <path d="M100 0C121.9 0 143.8 8.58317 160.355 25.1381C176.93 41.6931 185.5 63.5603 185.5 85.5C185.5 111.2 173.46 135.089 152.8 148.8C149.87 150.77 149.18 154.77 151.14 157.7C153.11 160.63 157.11 161.32 160.04 159.36C183.95 143.65 198 115.65 198 85.5C198 60.3131 188.307 35.8838 169.497 17.0736C150.687 -1.73667 126.233 -11.5 101 -11.5C45.15 -11.5 0 33.65 0 89.5C0 122.32 16.5 152.14 43.7 168.47C46.63 170.42 50.63 169.72 52.59 166.79C54.55 163.85 53.85 159.85 50.92 157.9C27.84 143.9 13.5 118.26 13.5 89.5C13.5 41.2 51.7 3 100 3V0Z" fill="white" />
                  <path d="M100 44C88.9543 44 80 52.9543 80 64C80 75.0457 88.9543 84 100 84C111.046 84 120 75.0457 120 64C120 52.9543 111.046 44 100 44Z" fill="white" />
                </svg>
              </div>

              <div className="flex flex-col md:flex-row justify-between items-center p-6 md:p-8">
                <div className="mb-4 md:mb-0">
                  <div className="text-emerald-100 font-medium">{todayHijri.date[0]}</div>
                  <h2 className="text-4xl font-bold mt-1">{todayHijri.date[1]}</h2>
                  <p className="text-emerald-100 text-lg mt-1">{todayHijri.date[2]}</p>
                </div>

                <div className="text-center">
                  <div className="font-bold text-5xl">{parseInt(todayHijri.num[1]) || '-'}</div>
                  <div className="mt-1 font-medium text-lg">
                    {monthsNames[parseInt(todayHijri.num[5]) - 1] || '-'}
                  </div>
                  <div className="mt-1 text-sm text-emerald-100">
                    {parseInt(todayHijri.num[6]) || '-'} H
                  </div>
                </div>
              </div>

              {getSpecialDayInfo(parseInt(todayHijri.num[1]), monthsNames[parseInt(todayHijri.num[5]) - 1]) && (
                <div className="mx-6 md:mx-8 mb-6 px-4 py-3 bg-white bg-opacity-15 backdrop-blur-sm rounded-xl">
                  <div className="flex items-center">
                    <span className="mr-3 text-xl">🌙</span>
                    <p className="font-medium">
                      {getSpecialDayInfo(parseInt(todayHijri.num[1]), monthsNames[parseInt(todayHijri.num[5]) - 1])}
                    </p>
                  </div>
                </div>
              )}

              {isWeeklySpecialDay(parseInt(todayHijri.num[1])) && (
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

              <div className="flex flex-col items-center">
                <h2 className="text-xl font-bold text-gray-800">
                  {activeMonth && monthsNames && monthsNames[activeMonth - 1]} {activeYear}
                  <span className="ml-2 text-sm font-medium px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full">
                    {activeYear} H
                  </span>
                </h2>

                {/* Back to today button */}
                {todayHijri && (activeMonth !== parseInt(todayHijri.num[5]) || activeYear !== parseInt(todayHijri.num[6])) && (
                  <button
                    onClick={goToToday}
                    className="mt-2 text-sm text-emerald-600 hover:text-emerald-700 flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                    </svg>
                    Kembali ke Hari Ini
                  </button>
                )}
              </div>

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
                    {day}
                  </span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1 md:gap-2">
              {calendarDays.map((dayObj, index) => {
                // Determine if this is a special day (Islamic holiday or Ayyamul Bidh)
                const isSpecialDay = dayObj.day &&
                  getSpecialDayInfo(dayObj.day, monthsNames[activeMonth - 1]);

                // Check if it's a weekly special day (Monday, Thursday, Friday)
                const isWeeklySpecial = dayObj.day && isWeeklySpecialDay(dayObj.day);

                // Is today's date
                const isToday = dayObj.isCurrentDay;

                return (
                  <div
                  key={index}
                  className={`aspect-square flex flex-col items-center justify-center rounded-lg p-1 transition-all duration-200 ${
                    !dayObj.day ? 'opacity-0' : 
                    isToday ? 'bg-emerald-500 text-white shadow-lg' :
                    isSpecialDay ? 'bg-emerald-100 text-emerald-800' :
                    isWeeklySpecial ? 'bg-blue-50 text-blue-700' :
                    'hover:bg-gray-100'
                  }`}
                >
                  {dayObj.day && (
                    <>
                      <span className={`text-sm font-medium ${isToday ? 'text-white' : ''}`}>
                        {dayObj.day}
                      </span>
                      
                      {isSpecialDay && (
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1"></span>
                      )}
                      
                      {!isSpecialDay && isWeeklySpecial && (
                        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1"></span>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Special days for this month */}
        {activeMonth && monthsNames && (
          <div className="p-6 bg-gray-50 border-t border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Hari Penting Bulan {monthsNames[activeMonth - 1]}
            </h3>
            
            <div className="space-y-3">
              {getMonthSpecialDays(activeMonth).length > 0 ? (
                getMonthSpecialDays(activeMonth).map((special, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mr-3">
                      {special.day}
                    </div>
                    <div>
                      <p className="text-gray-800 font-medium">{special.event}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 italic">Tidak ada hari penting khusus pada bulan ini</p>
              )}
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Ayyamul Bidh (Hari-hari Putih):</span> Tanggal 13-15 setiap bulan Hijriyah, 
                  disunnahkan untuk berpuasa.
                </p>
                
                <p className="text-sm text-gray-600 mt-2">
                  <span className="font-medium">Hari Senin & Kamis:</span> Disunnahkan untuk berpuasa.
                </p>
                
                <p className="text-sm text-gray-600 mt-2">
                  <span className="font-medium">Hari Jumat:</span> Sayyidul Ayyam (Penghulu Hari)
                </p>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  </div>
);
};

export default Calendar;