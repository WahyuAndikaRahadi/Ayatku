import { useState, useRef } from 'react';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';

const IslamicQABot = () => {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const answerRef = useRef(null); // For scrolling to the answer

    // ========================================================
    // IMPORTANT: REPLACE WITH YOUR GEMINI API KEY
    // WARNING: PLACING API KEY ON FRONTEND IS HIGHLY DISCOURAGED FOR PRODUCTION
    // RISKS: POOR SECURITY, API KEY CAN BE STOLEN & OVER-QUOTED
    // USE ONLY FOR LEARNING PURPOSES OR NON-PUBLIC PROTOTYPES
    // ========================================================
    const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_KEY; // <-- This is now from environment variable!
    // ========================================================

    const fetchGeminiResponse = async (prompt, key) => {
        // Using gemini-2.0-flash as per your request
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`; 

        // Using fetch API
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                // You can add other parameters if needed, for example:
                // generationConfig: {
                //     temperature: 0.7,
                //     topK: 40,
                //     topP: 0.95,
                //     maxOutputTokens: 1024,
                // },
            })
        });

        if (!res.ok) {
            const errorData = await res.json();
            console.error("API request failed:", res.status, errorData);
            throw new Error(errorData.error?.message || `API request failed with status ${res.status}`);
        }

        const data = await res.json();
        // Ensure the response structure is as expected
        return data?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate a valid response.";
    };

    const handleAskQuestion = async (e) => {
        e.preventDefault(); // Prevent page reload
        if (!question.trim()) {
            Swal.fire({
                title: 'Perhatian!',
                text: 'Pertanyaan tidak boleh kosong.',
                icon: 'warning',
                confirmButtonText: 'OK',
                confirmButtonColor: '#16a34a'
            });
            return;
        }

        setLoading(true);
        setError(null);
        setAnswer(null); // Reset previous answer

        const promptTemplate = `Anda adalah asisten AI yang ahli dalam pengetahuan Islam. Jawablah pertanyaan berikut secara informatif, akurat, dan sesuai dengan ajaran Islam. Jika Anda tidak yakin, katakan bahwa Anda tidak memiliki informasi yang cukup atau sarankan untuk berkonsultasi dengan ulama.

Pertanyaan: "${question}"

Jawaban:`;

        try {
            const geminiAnswer = await fetchGeminiResponse(promptTemplate, GEMINI_API_KEY);
            setAnswer(geminiAnswer);
            // Scroll to the answer after it's loaded
            setTimeout(() => {
                answerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
            
        } catch (err) {
            console.error('Error fetching answer from Gemini:', err);
            setError(err.message || 'Terjadi kesalahan saat memproses pertanyaan Anda. Silakan coba lagi.');
            Swal.fire({
                title: 'Error!',
                text: err.message || 'Terjadi kesalahan saat memuat jawaban.',
                icon: 'error',
                confirmButtonText: 'OK',
                confirmButtonColor: '#16a34a'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-custom py-8 mt-5 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-10 text-center"
            >
                <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-gray-900 leading-tight">Tanya Jawab Islami <span className="text-emerald-600">AI</span></h1>
                <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                    Ajukan pertanyaan seputar Islam kepada AI kami. Kami berusaha memberikan jawaban yang informatif dan relevan, didukung oleh teknologi kecerdasan buatan.
                    <br />
                    <strong className="text-red-600 font-semibold mt-2 block">Disclaimer:</strong> Jawaban AI bersifat informatif dan tidak menggantikan nasihat ulama atau pendidikan Islam formal.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Question Panel */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-white rounded-3xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-[1.01] flex flex-col"
                >
                    <div className="bg-gradient-to-r from-emerald-700 to-emerald-500 p-6 text-white flex items-center justify-between">
                        <h2 className="text-2xl font-bold">Ajukan Pertanyaan Anda</h2>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9.228a4.5 4.5 0 116.364 0L12 11.636l-2.121 2.122a4.5 4.5 0 01-6.364-6.364l.98-.979a2.5 2.5 0 013.536 0L12 7.364zM12 11.636l2.121-2.122a4.5 4.5 0 016.364 6.364l-.979.979a2.5 2.5 0 01-3.536 0L12 14.636z" />
                        </svg>
                    </div>

                    <form onSubmit={handleAskQuestion} className="p-6 flex-grow flex flex-col">
                        <div className="mb-6 flex-grow">
                            <label htmlFor="islamicQuestion" className="block text-gray-800 text-base font-semibold mb-3">
                                Pertanyaan Anda:
                            </label>
                            <textarea
                                id="islamicQuestion"
                                className="shadow-inner appearance-none border border-gray-300 rounded-xl w-full py-4 px-5 text-gray-800 leading-tight focus:outline-none focus:ring-4 focus:ring-emerald-200 focus:border-emerald-500 transition-all duration-200 resize-y min-h-[150px] bg-white"
                                placeholder="Contoh: Apa hikmah di balik puasa Ramadhan? Atau, bagaimana konsep tawakkal dalam Islam?"
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                disabled={loading}
                            ></textarea>
                        </div>
                        <button
                            type="submit"
                            className="bg-emerald-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300 transition-all duration-300 transform hover:scale-105 flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <div className="loader ease-linear rounded-full border-2 border-t-2 border-white h-5 w-5 mr-3 border-t-transparent animate-spin"></div>
                                    Memproses Jawaban...
                                </>
                            ) : (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                    </svg>
                                    Tanyakan Sekarang
                                </>
                            )}
                        </button>
                    </form>
                </motion.div>

                {/* Answer Panel */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-white rounded-3xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-[1.01] flex flex-col"
                >
                    <div className="bg-gradient-to-r from-blue-700 to-blue-500 p-6 text-white flex items-center justify-between">
                        <h2 className="text-2xl font-bold">Jawaban AI</h2>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 20v-3m0 0l.683-.566m-1.366 0L12 17m0 0h.01M12 12l.683-.566m-1.366 0L12 12m0 0h.01M17 12h.01M7 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>

                    <div className="p-6 min-h-[300px] relative flex-grow flex items-center justify-center">
                        {loading ? (
                            <div className="absolute inset-0 flex flex-col justify-center items-center bg-white bg-opacity-80 z-10">
                                <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-16 w-16 mb-4 mx-auto border-t-blue-500 animate-spin"></div>
                                <p className="text-blue-700 font-semibold text-lg">AI sedang berpikir keras...</p>
                            </div>
                        ) : error ? (
                            <div className="text-center text-red-700 flex flex-col items-center justify-center h-full">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 mb-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="font-semibold text-xl">{error}</p>
                                <p className="text-gray-600 mt-2 text-sm">Mohon coba lagi atau periksa koneksi internet Anda.</p>
                            </div>
                        ) : answer ? (
                            <motion.div
                                ref={answerRef}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="prose max-w-none text-gray-800 text-lg leading-relaxed" // Tailwind Typography plugin jika diinstal
                            >
                                <p className="whitespace-pre-wrap">{answer}</p>
                            </motion.div>
                        ) : (
                            <div className="text-center text-gray-500 flex flex-col items-center justify-center h-full">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9.228a4.5 4.5 0 116.364 0L12 11.636l-2.121 2.122a4.5 4.5 0 01-6.364-6.364l.98-.979a2.5 2.5 0 013.536 0L12 7.364zM12 11.636l2.121-2.122a4.5 4.5 0 016.364 6.364l-.979.979a2.5 2.5 0 01-3.536 0L12 14.636z" />
                                </svg>
                                <p className="text-xl font-medium">Siap membantu Anda!</p>
                                <p className="text-gray-600 mt-2">Silakan ajukan pertanyaan Anda di kolom sebelah kiri.</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>

            {/* Usage Instructions Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-10 bg-white rounded-3xl shadow-xl p-8"
            >
                <h2 className="text-2xl font-bold mb-6 flex items-center text-gray-900">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mr-3 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Petunjuk Penggunaan
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-emerald-50 p-5 rounded-2xl flex items-start">
                        <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mr-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9.228a4.5 4.5 0 116.364 0L12 11.636l-2.121 2.122a4.5 4.5 0 01-6.364-6.364l.98-.979a2.5 2.5 0 013.536 0L12 7.364zM12 11.636l2.121-2.122a4.5 4.5 0 016.364 6.364l-.979.979a2.5 2.5 0 01-3.536 0L12 14.636z" />
                            </svg>
                        </div>
                        <div>
                            <span className="font-semibold text-lg text-gray-900 block mb-1">Tulis Pertanyaan Jelas</span>
                            <p className="text-gray-700 text-sm">
                                Formulasikan pertanyaan Anda sejelas dan sedetail mungkin untuk mendapatkan hasil yang paling akurat dari AI.
                            </p>
                        </div>
                    </div>

                    <div className="bg-blue-50 p-5 rounded-2xl flex items-start">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mr-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                            </svg>
                        </div>
                        <div>
                            <span className="font-semibold text-lg text-gray-900 block mb-1">Fokus Topik Islami</span>
                            <p className="text-gray-700 text-sm">
                                AI ini dioptimalkan untuk pertanyaan seputar ajaran, sejarah, figur, dan praktik dalam Islam.
                            </p>
                        </div>
                    </div>

                    <div className="bg-yellow-50 p-5 rounded-2xl flex items-start">
                        <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0 mr-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </div>
                        <div>
                            <span className="font-semibold text-lg text-gray-900 block mb-1">Verifikasi Informasi</span>
                            <p className="text-gray-700 text-sm">
                                Untuk masalah serius, fatwa, atau keputusan penting, selalu konsultasikan dengan ulama yang berwenang.
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default IslamicQABot;
