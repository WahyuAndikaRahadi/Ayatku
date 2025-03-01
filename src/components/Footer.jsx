import { FaQuran, FaHeart, FaGithub } from 'react-icons/fa'

const Footer = () => {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-neutral text-white pt-8 pb-6">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center space-x-2 mb-2">
              <FaQuran className="text-accent text-xl" />
              <span className="font-bold text-lg">Ayatku</span>
            </div>
            <p className="text-gray-300 text-sm">
              Platform untuk membaca Al-Quran dan tafsirnya kapanpun dan dimanapun.
            </p>
          </div>

          <div className="flex flex-col items-center">
            <p className="text-gray-300 text-sm mb-2">
              Dibuat Oleh Wahyu Andika Rahadi Dengan <FaHeart className="inline text-red-500" /> untuk umat Islam
            </p>
            <p className="text-gray-300 text-sm">
              &copy; {year} Ayatku | 
              <a 
                href="https://github.com/WahyuAndikaRahadi" 
                target="_blank" 
                rel="noopener noreferrer"
                className="ml-1 inline-flex items-center hover:text-accent"
              >
                <FaGithub className="mr-1" /> GitHub
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer