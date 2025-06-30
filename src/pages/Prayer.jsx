import { useState, useEffect } from 'react'
import Swal from 'sweetalert2'
import { motion } from 'framer-motion'

// Audio elements for notifications with proper path handling
const NOTIFICATION_SOUNDS = {
  reminder: '/sounds/reminder.mp3',  // 5-minute reminder sound
  adhan: '/sounds/adhan.mp3'         // Main adhan sound
};

const Prayer = () => {
  const [prayerTimes, setPrayerTimes] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [nextPrayer, setNextPrayer] = useState(null)
  const [timeRemaining, setTimeRemaining] = useState(null)
  const [location, setLocation] = useState(null)
  const [cityInfo, setCityInfo] = useState(null)
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)
  const [notificationTimers, setNotificationTimers] = useState([])
  const [audioEnabled, setAudioEnabled] = useState(true)
  const [hijriDate, setHijriDate] = useState(null); // New state for Hijri date
  
  // Create audio elements
  const [audioElements, setAudioElements] = useState(null)
  // Track if audio is loaded
  const [audioLoaded, setAudioLoaded] = useState(false)

  // Initialize audio elements with proper error handling
  useEffect(() => {
    const loadAudio = async () => {
      try {
        // Create with proper error handling
        const reminderAudio = new Audio();
        const adhanAudio = new Audio();
        
        // Add event listeners for error tracking
        reminderAudio.addEventListener('error', (e) => {
          console.warn('Error loading reminder sound:', e);
        });
        
        adhanAudio.addEventListener('error', (e) => {
          console.warn('Error loading adhan sound:', e);
        });
        
        // Set source after adding error listener
        reminderAudio.src = NOTIFICATION_SOUNDS.reminder;
        adhanAudio.src = NOTIFICATION_SOUNDS.adhan;
        
        // Set audio properties
        reminderAudio.preload = 'auto';
        adhanAudio.preload = 'auto';
        
        // Create elements object
        const elements = {
          reminder: reminderAudio,
          adhan: adhanAudio
        };
        
        // Check if audio can be played
        const canPlayReminder = await canPlayAudio(reminderAudio);
        const canPlayAdhan = await canPlayAudio(adhanAudio);
        
        if (canPlayReminder && canPlayAdhan) {
          setAudioLoaded(true);
        } else {
          console.warn('Some audio files cannot be played. Audio notifications may not work properly.');
        }
        
        setAudioElements(elements);
      } catch (err) {
        console.error('Error initializing audio:', err);
        setAudioLoaded(false);
      }
    };
    
    loadAudio();
    
    // Cleanup function
    return () => {
      if (audioElements) {
        Object.values(audioElements).forEach(audio => {
          audio.pause();
          audio.src = '';
        });
      }
    };
  }, []);
  
  // Helper function to check if audio can play
  const canPlayAudio = (audioElement) => {
    return new Promise((resolve) => {
      // Set up event listeners
      const onCanPlay = () => {
        audioElement.removeEventListener('canplay', onCanPlay);
        audioElement.removeEventListener('error', onError);
        resolve(true);
      };
      
      const onError = () => {
        audioElement.removeEventListener('canplay', onCanPlay);
        audioElement.removeEventListener('error', onError);
        resolve(false);
      };
      
      // Set timeout to handle cases where neither event fires
      const timeout = setTimeout(() => {
        audioElement.removeEventListener('canplay', onCanPlay);
        audioElement.removeEventListener('error', onError);
        resolve(false);
      }, 3000);
      
      // Add event listeners
      audioElement.addEventListener('canplay', () => {
        clearTimeout(timeout);
        onCanPlay();
      });
      
      audioElement.addEventListener('error', () => {
        clearTimeout(timeout);
        onError();
      });
      
      // Try to load
      audioElement.load();
    });
  };

  // Get user's location and fetch prayer times
  useEffect(() => {
    const getUserLocation = () => {
      if (navigator.geolocation) {
        setLoading(true)
        navigator.geolocation.getCurrentPosition(
          position => {
            const { latitude, longitude } = position.coords
            setLocation({ latitude, longitude })
            fetchLocationInfo(latitude, longitude)
            fetchPrayerTimes(latitude, longitude)
          },
          error => {
            console.error('Error getting location:', error)
            setError('Gagal mendapatkan lokasi Anda. Silakan izinkan akses lokasi.')
            setLoading(false)
            Swal.fire({
              title: 'Perhatian!',
              text: 'Kami memerlukan akses lokasi Anda untuk menampilkan jadwal sholat yang akurat.',
              icon: 'warning',
              confirmButtonText: 'Coba Lagi',
              confirmButtonColor: '#16a34a'
            })
          },
          { enableHighAccuracy: true }
        )
      } else {
        setError('Geolocation tidak didukung oleh browser Anda')
        setLoading(false)
        Swal.fire({
          title: 'Perhatian',
          text: 'Geolocation tidak didukung oleh browser Anda',
          icon: 'warning',
          confirmButtonText: 'OK',
          confirmButtonColor: '#16a34a'
        })
      }
    }

    getUserLocation()
    checkNotificationPermission()

    // Register service worker for background notifications
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js').then(
        registration => {
          console.log('Service Worker registered with scope:', registration.scope)
        },
        error => {
          console.error('Service Worker registration failed:', error)
        }
      )
    }
  }, [])

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Calculate next prayer and time remaining
  useEffect(() => {
    if (prayerTimes) {
      calculateNextPrayer()
    }
  }, [prayerTimes, currentTime])

  // Setup notification timers when prayer times are available
  useEffect(() => {
    if (prayerTimes && notificationsEnabled) {
      setupNotificationTimers()
    }
    
    // Clear previous timers when component unmounts or prayer times change
    return () => {
      notificationTimers.forEach(timer => clearTimeout(timer))
    }
  }, [prayerTimes, notificationsEnabled])

  // Check if notifications are supported and permissions are granted
  const checkNotificationPermission = () => {
    if (!('Notification' in window)) {
      console.log('Browser ini tidak mendukung notifikasi')
      return
    }

    if (Notification.permission === 'granted') {
      setNotificationsEnabled(true)
    } else if (Notification.permission !== 'denied') {
      Swal.fire({
        title: 'Aktifkan Notifikasi',
        text: 'Izinkan notifikasi untuk mendapatkan pengingat waktu sholat',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Izinkan',
        cancelButtonText: 'Nanti',
        confirmButtonColor: '#16a34a'
      }).then((result) => {
        if (result.isConfirmed) {
          requestNotificationPermission()
        }
      })
    }
  }

  const requestNotificationPermission = async () => {
    try {
      const permission = await Notification.requestPermission()
      if (permission === 'granted') {
        setNotificationsEnabled(true)
        Swal.fire({
          title: 'Notifikasi Aktif',
          text: 'Anda akan menerima pengingat waktu sholat 5 menit sebelum waktu sholat tiba',
          icon: 'success',
          confirmButtonColor: '#16a34a'
        })
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error)
    }
  }

  // Setup timers for notifications
  const setupNotificationTimers = () => {
    if (!prayerTimes || !notificationsEnabled) return

    // Clear previous timers
    notificationTimers.forEach(timer => clearTimeout(timer))
    const newTimers = []

    const prayers = [
      { name: 'Imsak', time: prayerTimes.imsak },
      { name: 'Subuh', time: prayerTimes.subuh },
      { name: 'Terbit', time: prayerTimes.terbit },
      { name: 'Dzuhur', time: prayerTimes.dzuhur },
      { name: 'Ashar', time: prayerTimes.ashar },
      { name: 'Maghrib', time: prayerTimes.maghrib },
      { name: 'Isya', time: prayerTimes.isya }
    ]

    // Current time
    const now = new Date()

    prayers.forEach(prayer => {
      try {
        // Convert prayer time to Date object
        const prayerDate = formatTimeToDate(prayer.time)
        
        // Skip if prayer time has already passed
        if (prayerDate <= now) return
        
        // Calculate time 5 minutes before prayer time
        const notificationTime = new Date(prayerDate)
        notificationTime.setMinutes(notificationTime.getMinutes() - 5)
        
        // Skip if notification time has already passed
        if (notificationTime <= now) return
        
        // Calculate milliseconds until notification
        const timeUntilNotification = notificationTime - now
        
        // Set timeout for the notification
        const timerId = setTimeout(() => {
          sendNotification(prayer.name) // 5-minute reminder
        }, timeUntilNotification)
        
        // Also set a timer for the exact prayer time
        const timeUntilPrayer = prayerDate - now
        const exactTimerId = setTimeout(() => {
          sendNotification(prayer.name, true) // Exact prayer time
        }, timeUntilPrayer)
        
        newTimers.push(timerId, exactTimerId)
      } catch (err) {
        console.warn(`Error setting up notification for ${prayer.name}:`, err)
      }
    })

    setNotificationTimers(newTimers)
  }

  // Send notification with improved audio handling
  const sendNotification = (prayerName, isExactTime = false) => {
    if (!notificationsEnabled) {
      console.log("Notifications disabled, not sending notification");
      return;
    }
  
    const title = isExactTime 
      ? `Waktu ${prayerName} Tiba` 
      : `Persiapan ${prayerName}`;
    
    const body = isExactTime 
      ? `Waktu ${prayerName} telah tiba.` 
      : `${prayerName} akan tiba dalam 5 menit.`;
  
    try {
      console.log(`Preparing notification for ${prayerName} (isExactTime: ${isExactTime})`);
      
      // Play sound if enabled and audio is loaded
      if (audioEnabled && audioElements && audioLoaded) {
        try {
          // Use adhan sound for exact time, reminder sound for 5-minute warning
          const sound = isExactTime ? audioElements.adhan : audioElements.reminder;
          
          console.log(`Playing ${isExactTime ? 'adhan' : 'reminder'} sound`);
          
          // Reset the audio position and play with proper error handling
          sound.currentTime = 0;
          
          // Play with error handling
          const playPromise = sound.play();
          
          if (playPromise !== undefined) {
            playPromise.then(() => {
              console.log('Sound playback started successfully');
            }).catch(err => {
              console.warn('Error playing sound:', err);
              // Show alert about audio playback requiring interaction
              if (err.name === 'NotAllowedError') {
                console.info('Audio playback requires user interaction first');
                Swal.fire({
                  title: 'Izinkan Suara',
                  text: 'Klik di mana saja untuk mengaktifkan suara notifikasi',
                  icon: 'info',
                  toast: true,
                  position: 'top-end',
                  showConfirmButton: false,
                  timer: 5000
                });
              }
            });
          }
        } catch (audioErr) {
          console.warn('Error with audio playback:', audioErr);
        }
      }
  
      // Check if service worker is ready
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        console.log('Sending notification through service worker');
        navigator.serviceWorker.controller.postMessage({
          type: 'SHOW_NOTIFICATION',
          title,
          body,
          icon: '/icons/prayer-icon.png',
          tag: `prayer-${prayerName}-${isExactTime ? 'exact' : 'reminder'}-${Date.now()}`,
          timestamp: Date.now(),
          sound: isExactTime ? NOTIFICATION_SOUNDS.adhan : NOTIFICATION_SOUNDS.reminder,
          silent: !audioEnabled
        });
      } else {
        // Fallback to direct notification
        console.log('Service worker not available, using direct notification');
        
        // Check if Notification API is available
        if ('Notification' in window) {
          const notification = new Notification(title, {
            body,
            icon: '/icons/prayer-icon.png',
            tag: `prayer-${prayerName}-${isExactTime ? 'exact' : 'reminder'}-${Date.now()}`,
            requireInteraction: true,
            silent: !audioEnabled
          });
          
          notification.onclick = function() {
            window.focus();
            this.close();
          };
          
          console.log('Direct notification sent successfully');
        } else {
          console.warn('Notification API not available');
          // Show fallback alert
          Swal.fire({
            title,
            text: body,
            icon: 'info',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 5000
          });
        }
      }
    } catch (err) {
      console.warn('Error sending notification:', err);
      // Show fallback alert
      Swal.fire({
        title: 'Kesalahan Notifikasi',
        text: 'Gagal mengirim notifikasi: ' + err.message,
        icon: 'error',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 5000
      });
    }
  };    

  // Toggle audio with improved feedback
  const toggleAudio = () => {
    const newAudioState = !audioEnabled;
    setAudioEnabled(newAudioState);
    
    // Check if audio files are properly loaded
    if (newAudioState && !audioLoaded) {
      Swal.fire({
        title: 'Peringatan',
        text: 'File audio notifikasi tidak dapat dimuat. Notifikasi akan muncul tanpa suara.',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: '#16a34a'
      });
    } else {
      Swal.fire({
        title: newAudioState ? 'Suara Diaktifkan' : 'Suara Dinonaktifkan',
        text: newAudioState ? 'Notifikasi akan disertai dengan suara' : 'Notifikasi tidak akan disertai dengan suara',
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#16a34a'
      });
    }
  }

  // Fetch city information based on coordinates using OpenCage API
  const fetchLocationInfo = async (latitude, longitude) => {
    try {
      const formattedLatitude = parseFloat(latitude).toFixed(8)
      const formattedLongitude = parseFloat(longitude).toFixed(8)
      
      const locationApiUrl = `/api/opencage?lat=${formattedLatitude}&lon=${formattedLongitude}`
      
      const response = await fetch(locationApiUrl);
      const data = await response.json();
      console.log('OpenCage API response:', data);
      
      if (data.city && data.country) {
        setCityInfo({
          city: data.city,
          province: data.country // Using country as province for simplicity based on your example
        })
      } else {
        console.log('Location data format not recognized from OpenCage:', data)
      }
    } catch (err) {
      console.warn('Error fetching location info from OpenCage:', err)
    }
  }

  const fetchPrayerTimes = async (latitude, longitude) => {
    try {
      setLoading(true)
      
      const formattedLatitude = parseFloat(latitude).toFixed(8)
      const formattedLongitude = parseFloat(longitude).toFixed(8)
      
      const apiUrl = `https://api.aladhan.com/v1/timings?latitude=${formattedLatitude}&longitude=${formattedLongitude}&method=2&school=1&language=id`
      
      const response = await fetch(apiUrl);
      const data = await response.json();
      console.log('Aladhan API response:', data);
      
      if (data.data && data.data.timings) {
        const timings = data.data.timings;
        const hijri = data.data.date.hijri;

        const prayerData = {
          date: data.data.date.readable,
          imsak: timings.Imsak,
          subuh: timings.Fajr,
          terbit: timings.Sunrise,
          dzuhur: timings.Dhuhr,
          ashar: timings.Asr,
          maghrib: timings.Maghrib,
          isya: timings.Isha
        };
        
        setPrayerTimes(prayerData);
        setHijriDate(`${hijri.day} ${hijri.month.en} ${hijri.year} H`);
        setLoading(false);
        setError(null);
      } else {
        throw new Error('Format data dari API Aladhan tidak valid');
      }
    } catch (err) {
      console.warn('API Warning:', err)
      
      // Fallback to hardcoded prayer times if API fails
      const today = new Date().toISOString().split('T')[0]
      setPrayerTimes({
        date: today,
        imsak: '04:37',
        subuh: '04:47',
        terbit: '06:05',
        dzuhur: '12:07',
        ashar: '15:27',
        maghrib: '18:08',
        isya: '19:19'
      })
      
      setError('Terjadi kesalahan saat memuat jadwal sholat. Menampilkan jadwal perkiraan.')
      setLoading(false)
      
      // Show less severe warning
      Swal.fire({
        title: 'Perhatian',
        text: 'Gagal memuat jadwal sholat dari server. Menampilkan jadwal perkiraan.',
        icon: 'info',
        confirmButtonText: 'OK',
        confirmButtonColor: '#16a34a'
      })
    }
  }

  const calculateNextPrayer = () => {
    if (!prayerTimes) return
    
    const now = currentTime
    
    try {
      const prayers = [
        { name: 'Imsak', time: formatTimeToDate(prayerTimes.imsak) },
        { name: 'Subuh', time: formatTimeToDate(prayerTimes.subuh) },
        { name: 'Terbit', time: formatTimeToDate(prayerTimes.terbit) },
        { name: 'Dzuhur', time: formatTimeToDate(prayerTimes.dzuhur) },
        { name: 'Ashar', time: formatTimeToDate(prayerTimes.ashar) },
        { name: 'Maghrib', time: formatTimeToDate(prayerTimes.maghrib) },
        { name: 'Isya', time: formatTimeToDate(prayerTimes.isya) }
      ]
      
      // Find the next prayer
      let next = null
      for (const prayer of prayers) {
        if (prayer.time > now) {
          next = prayer
          break
        }
      }
      
      // If no next prayer found today, first prayer for tomorrow
      if (!next && prayers.length > 0) {
        next = prayers[0]
        // Add 24 hours to get tomorrow's time
        next.time.setDate(next.time.getDate() + 1)
      }
      
      setNextPrayer(next)
      
      // Calculate time remaining
      if (next) {
        const diff = next.time - now
        const hours = Math.floor(diff / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((diff % (1000 * 60)) / 1000)
        
        setTimeRemaining({ hours, minutes, seconds })
      }
    } catch (err) {
      console.warn('Calculating next prayer warning:', err)
    }
  }

  const formatTimeToDate = (timeString) => {
    if (!timeString || typeof timeString !== 'string') {
      console.warn('Invalid time string:', timeString)
      return new Date(currentTime.getTime() + 60 * 60 * 1000) // Default to 1 hour from now
    }
    
    try {
      const [hours, minutes] = timeString.split(':').map(Number)
      const date = new Date(currentTime)
      date.setHours(hours, minutes, 0, 0)
      return date
    } catch (err) {
      console.warn('Warning formatting time:', err)
      return new Date(currentTime.getTime() + 60 * 60 * 1000) // Default to 1 hour from now
    }
  }

  const formatTime = (date) => {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
      return '--:--'
    }
    
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
  }

  const formatDate = (date) => {
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Function to handle retry
  const handleRetry = () => {
    if (location) {
      fetchLocationInfo(location.latitude, location.longitude)
      fetchPrayerTimes(location.latitude, location.longitude)
    } else {
      window.location.reload()
    }
  }

  // Toggle notification permission
  const handleToggleNotifications = () => {
    if (notificationsEnabled) {
      // Just disable for this session (can't revoke permission programmatically)
      setNotificationsEnabled(false)
      notificationTimers.forEach(timer => clearTimeout(timer))
      setNotificationTimers([])
      Swal.fire({
        title: 'Notifikasi Dimatikan',
        text: 'Notifikasi waktu sholat tidak akan muncul',
        icon: 'info',
        confirmButtonColor: '#16a34a'
      })
    } else {
      requestNotificationPermission()
    }
  }

  if (loading) {
    return (
      <div className="container-custom flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4 mx-auto border-t-primary animate-spin"></div>
          <p className="text-gray-600">Mendapatkan jadwal sholat untuk lokasi Anda...</p>
        </div>
      </div>
    )
  }

  if (error && !prayerTimes) {
    return (
      <div className="container-custom flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-amber-500 mb-2">Perhatian</h2>
          <p>{error}</p>
          <button 
            onClick={handleRetry} 
            className="btn-primary mt-4 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container-custom">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center"
      >
        <h1 className="text-3xl font-bold mb-2">Jadwal Sholat & Imsak</h1>
        {cityInfo ? (
          <p className="text-gray-600">
            Jadwal sholat untuk {cityInfo.city || 'lokasi Anda'} 
            {cityInfo.province ? `, ${cityInfo.province}` : ''}
          </p>
        ) : (
          <p className="text-gray-600">
            Jadwal sholat untuk lokasi Anda hari ini
          </p>
        )}
        {hijriDate && (
          <p className="text-gray-600 text-sm mt-1">
            Tanggal Hijriah: {hijriDate}
          </p>
        )}
        {error && (
          <div className="mt-2 text-amber-600 text-sm">
            {error}
            <button 
              onClick={handleRetry}
              className="ml-2 underline text-primary"
            >
              Coba Lagi
            </button>
          </div>
        )}
        
        {/* Notification Toggle Button */}
        <button
          onClick={handleToggleNotifications}
          className={`mt-4 flex items-center mx-auto px-4 py-2 rounded-full font-medium ${
            notificationsEnabled
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <span className="mr-2">
            {notificationsEnabled ? '🔔' : '🔕'}
          </span>
          {notificationsEnabled ? 'Notifikasi Aktif' : 'Aktifkan Notifikasi'}
        </button>
      </motion.div>

      {/* Digital Clock */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-lg p-6 mb-8 text-center"
      >
        <div className="text-5xl font-bold text-primary mb-2">
          {currentTime.toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
          })}
        </div>
        <div className="text-lg text-gray-600">
          {formatDate(currentTime)}
        </div>
      </motion.div>

      {/* Next Prayer */}
      {nextPrayer && timeRemaining && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-gradient-to-r from-green-500 to-green-700 rounded-lg shadow-lg p-6 mb-8 text-white"
        >
          <h2 className="text-xl font-bold mb-2">Waktu {nextPrayer.name} Selanjutnya</h2>
          <div className="flex justify-between items-center">
            <div className="text-4xl font-bold">
              {formatTime(nextPrayer.time)}
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold mb-1">Waktu Tersisa</div>
              <div className="text-2xl font-bold">
                {String(timeRemaining.hours).padStart(2, '0')}:
                {String(timeRemaining.minutes).padStart(2, '0')}:
                {String(timeRemaining.seconds).padStart(2, '0')}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Prayer Times */}
      {prayerTimes && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { name: 'Imsak', time: prayerTimes.imsak, icon: '🌙' },
          { name: 'Subuh', time: prayerTimes.subuh, icon: '🌄' },
          { name: 'Terbit', time: prayerTimes.terbit, icon: '☀️' },
          { name: 'Dzuhur', time: prayerTimes.dzuhur, icon: '🌤️' },
          { name: 'Ashar', time: prayerTimes.ashar, icon: '🌇' },
          { name: 'Maghrib', time: prayerTimes.maghrib, icon: '🌆' },
          { name: 'Isya', time: prayerTimes.isya, icon: '🌃' },
        ].map((prayer, index) => {
            let prayerDate
            try {
              prayerDate = formatTimeToDate(prayer.time)
            } catch (err) {
              console.warn(`Warning formatting prayer time for ${prayer.name}:`, err)
              prayerDate = new Date()
            }
            
            const isPassed = prayerDate < currentTime
            const isNext = nextPrayer && nextPrayer.name === prayer.name
            
            return (
              <motion.div
                key={prayer.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`rounded-lg shadow-md p-6 flex justify-between items-center ${
                  isNext
                    ? 'bg-green-50 border-2 border-green-500'
                    : isPassed
                    ? 'bg-gray-100'
                    : 'bg-white'
                }`}
              >
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{prayer.icon}</span>
                  <div>
                    <h3 className="text-xl font-bold">{prayer.name}</h3>
                    {isNext && (
                      <span className="text-sm font-medium text-green-600">Waktu sholat selanjutnya</span>
                    )}
                    {isPassed && !isNext && (
                      <span className="text-sm font-medium text-gray-500">Telah lewat</span>
                    )}
                  </div>
                </div>
                <div className={`text-2xl font-bold ${
                  isNext
                    ? 'text-green-600'
                    : isPassed
                    ? 'text-gray-500'
                    : 'text-gray-800'
                }`}>
                  {prayer.time || '--:--'}
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
  
      {/* Location Information */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="mt-8 text-center text-gray-600"
      >
        {cityInfo ? (
          <div>
            <div className="flex justify-between items-center mt-4">
              <span>Suara Notifikasi</span>
              <button 
                onClick={toggleAudio}
                className={`px-4 py-2 rounded-full ${audioEnabled ? 'bg-green-500 text-white' : 'bg-gray-300'}`}
                disabled={!notificationsEnabled}
              >
                {audioEnabled ? 'Aktif' : 'Nonaktif'}
              </button>
            </div>
            <p className="font-medium mt-4">
              {cityInfo.city || 'Lokasi saat ini'}
              {cityInfo.province ? `, ${cityInfo.province}` : ''}
            </p>
          </div>
        ) : location ? (
          <div>
            <p>Jadwal sholat berdasarkan koordinat:</p>
            <p className="font-medium">
              {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
            </p>
          </div>
        ) : null}
      </motion.div>
    </div>
  )
  }
  
  export default Prayer