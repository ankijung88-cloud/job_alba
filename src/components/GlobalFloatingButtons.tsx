import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FiArrowRight, FiGlobe, FiArrowLeft, FiX, FiCheck, FiHome, FiBriefcase } from "react-icons/fi";

declare global {
    interface Window {
        google: any;
        googleTranslateElementInit: () => void;
    }
}

export default function GlobalFloatingButtons() {
    const navigate = useNavigate();
    const location = useLocation();
    const [showLanguageModal, setShowLanguageModal] = useState(false);
    const [currentLang, setCurrentLang] = useState("ko");

    useEffect(() => {
        // 1. Read existing language cookie to set initial state
        const getCookie = (name: string) => {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop()?.split(';').shift();
        };

        const googtrans = getCookie('googtrans');
        if (googtrans) {
            // Cookie format: /source/target (e.g., /auto/en or /ko/en)
            const langCode = googtrans.split('/').pop();
            // Google Translate auto-sets 'ko' if it matches page lang, 
            // but we want to know if it's strictly another language or sticking to default.
            if (langCode) {
                setCurrentLang(langCode);
            }
        }

        // 2. Initialize Google Translate
        const initGoogleTranslate = () => {
            if (window.google?.translate?.TranslateElement) {
                new window.google.translate.TranslateElement(
                    { pageLanguage: 'ko', includedLanguages: 'ko,en,zh-CN,vi,th,id,mn,uz,tl,ne,my,km,si,bn', autoDisplay: false },
                    'google_translate_element'
                );
            }
        };

        if (!window.google?.translate) {
            window.googleTranslateElementInit = initGoogleTranslate;
            const script = document.createElement("script");
            script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
            script.async = true;
            document.body.appendChild(script);
        } else {
            initGoogleTranslate();
        }
    }, []);

    const changeLanguage = (langCode: string) => {
        // 1. Set Google Translate Cookie
        // We set multiple formats to ensure one hits the correct matcher for the current domain/path
        const domain = window.location.hostname;
        const cookieOptions = "path=/; max-age=31536000";

        // Format: /source/target or /auto/target
        // Set for current domain
        document.cookie = `googtrans=/auto/${langCode}; ${cookieOptions}`;
        document.cookie = `googtrans=/ko/${langCode}; ${cookieOptions}`;

        // Set for top-level domain if possible (for localhost it might just be the same)
        document.cookie = `googtrans=/auto/${langCode}; domain=${domain}; ${cookieOptions}`;
        document.cookie = `googtrans=/ko/${langCode}; domain=${domain}; ${cookieOptions}`;

        // 2. Update State
        setCurrentLang(langCode);
        setShowLanguageModal(false);

        // 3. Force Reload to Apply Translation
        // Google Translate script reads the cookie on load to determine target language.
        // This is the most reliable way to ensure full page translation.
        window.location.reload();
    };

    // Supported languages map
    // ... (rest of the code stays same)

    // Supported languages map
    const languages = [
        { code: 'ko', label: '한국어 (Korean)', flag: '🇰🇷' },
        { code: 'en', label: 'English', flag: '🇺🇸' },
        { code: 'zh-CN', label: '中文 (Chinese)', flag: '🇨🇳' },
        { code: 'vi', label: 'Tiếng Việt (Vietnamese)', flag: '🇻🇳' },
        { code: 'th', label: 'ไทย (Thai)', flag: '🇹🇭' },
        { code: 'id', label: 'Bahasa Indonesia', flag: '🇮🇩' },
        { code: 'mn', label: 'Монгол (Mongolian)', flag: '🇲🇳' },
        { code: 'uz', label: 'Oʻzbek (Uzbek)', flag: '🇺🇿' },
        { code: 'tl', label: 'Tagalog (Philippines)', flag: '🇵🇭' },
        { code: 'ne', label: 'नेपाली (Nepali)', flag: '🇳🇵' },
        { code: 'my', label: 'မြန်မာ (Myanmar)', flag: '🇲🇲' },
        { code: 'km', label: 'ខ្មែរ (Cambodian)', flag: '🇰🇭' },
        { code: 'si', label: 'سنهالا (Sri Lanka)', flag: '🇱🇰' }, // Using 'si' for Sinhala
        { code: 'bn', label: 'বাংলা (Bangladesh)', flag: '🇧🇩' },
    ];


    // Check if we are on the login page (case insensitive) or root
    const isLoginPage = location.pathname.toLowerCase() === "/login" || location.pathname === "/";

    const handleIndividual = () => {
        const role = localStorage.getItem("role");
        if (role === "USER" || role === "ADMIN") {
            navigate("/UserLanding");
        } else {
            navigate("/");
        }
    };

    const handleCompany = () => {
        navigate("/CompanyLanding");
    };

    const role = localStorage.getItem("role");

    return (
        <>
            <div className="fixed bottom-8 right-8 z-[9000] flex flex-col-reverse gap-3 items-end print:hidden">

                {/* 1. Previous (Back) Button - Bottom-most */}
                {!isLoginPage && (
                    <button
                        onClick={() => navigate(-1)}
                        className="w-14 h-14 bg-gray-700 text-white rounded-full shadow-lg flex flex-col items-center justify-center hover:bg-gray-800 hover:scale-110 active:scale-95 transition-all border-4 border-white"
                        title="이전 페이지로 이동"
                    >
                        <span className="text-[10px] font-bold leading-none mb-1">이전</span>
                        <FiArrowLeft className="text-lg" />
                    </button>
                )}

                {/* 2. Login Button - Middle */}
                {!isLoginPage && (
                    <button
                        onClick={() => navigate("/Login")}
                        className="w-14 h-14 bg-gray-900 text-white rounded-full shadow-lg flex flex-col items-center justify-center hover:bg-black hover:scale-110 active:scale-95 transition-all border-4 border-white"
                        title="로그인 화면으로 이동"
                    >
                        <span className="text-[10px] font-bold leading-none mb-1">로그인</span>
                        <FiArrowRight className="text-lg" />
                    </button>
                )}

                {/* 3. Language Toggle Button - Top */}
                <button
                    onClick={() => setShowLanguageModal(true)}
                    className="w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 hover:scale-110 active:scale-95 transition-all border-4 border-white"
                    title="다국어 지원 (Language Info)"
                >
                    <FiGlobe className="text-2xl" />
                </button>

                {/* 4. Individual Button - Visible for Admin & User (Hidden for Company) */}
                {!isLoginPage && role !== "COMPANY" && (
                    <button
                        onClick={handleIndividual}
                        className="w-14 h-14 bg-green-600 text-white rounded-full shadow-lg flex flex-col items-center justify-center hover:bg-green-700 hover:scale-110 active:scale-95 transition-all border-4 border-white"
                        title="개인 랜딩으로 이동"
                    >
                        <span className="text-[10px] font-bold leading-none mb-1">랜딩</span>
                        <FiHome className="text-lg" />
                    </button>
                )}

                {/* 5. Company Button - Visible for Admin & Company */}
                {!isLoginPage && (role === "ADMIN" || role === "COMPANY") && (
                    <button
                        onClick={handleCompany}
                        className="w-14 h-14 bg-purple-600 text-white rounded-full shadow-lg flex flex-col items-center justify-center hover:bg-purple-700 hover:scale-110 active:scale-95 transition-all border-4 border-white"
                        title="기업 랜딩으로 이동"
                    >
                        <span className="text-[10px] font-bold leading-none mb-1">랜딩</span>
                        <FiBriefcase className="text-lg" />
                    </button>
                )}
            </div>

            {/* Hidden Google Translate Element (Must be technically visible for script to populate it) */}
            <div id="google_translate_element" className="fixed bottom-0 right-0 w-[1px] h-[1px] overflow-hidden opacity-0 z-[-1]"></div>

            {/* Language Selection Modal */}
            {showLanguageModal && (
                <div
                    className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in"
                    onClick={() => setShowLanguageModal(false)}
                >
                    <div
                        className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl relative animate-scale-up"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="bg-gray-50 border-b border-gray-100 p-6 flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-black text-gray-900">Language Select</h2>
                                <p className="text-gray-500 text-sm">Select your preferred language.</p>
                            </div>
                            <button
                                onClick={() => setShowLanguageModal(false)}
                                className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                            >
                                <FiX size={24} className="text-gray-500" />
                            </button>
                        </div>

                        {/* Modal Body: Language Grid */}
                        <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {languages.map((lang) => (
                                    <button
                                        key={lang.code}
                                        onClick={() => changeLanguage(lang.code)}
                                        className={`flex items-center gap-4 p-4 rounded-xl border transition-all text-left group
                                            ${currentLang === lang.code
                                                ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-200'
                                                : 'bg-white border-gray-100 hover:border-blue-300 hover:bg-gray-50 hover:shadow-md'
                                            }`}
                                    >
                                        <span className="text-3xl filter drop-shadow-sm group-hover:scale-110 transition-transform">{lang.flag}</span>
                                        <div className="flex-1">
                                            <span className={`block font-bold text-lg ${currentLang === lang.code ? 'text-blue-700' : 'text-gray-800'}`}>
                                                {lang.label.split('(')[0]}
                                            </span>
                                            <span className="text-xs text-gray-400 font-medium">
                                                {lang.label.split('(')[1]?.replace(')', '') || lang.label}
                                            </span>
                                        </div>
                                        {currentLang === lang.code && (
                                            <FiCheck className="text-blue-600 text-xl" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Footer Info */}
                        <div className="bg-gray-50 border-t border-gray-100 p-4 text-center text-xs text-gray-400">
                            Powered by Google Translate
                        </div>
                    </div>
                </div>
            )}

            {/* Custom Styles */}
            <style>{`
                /* We allow the Google Banner to appear and shift the page content down 
                   to prevent it from covering the top navigation/content. */
                
                /* Hide standard Google widget elements (the inline dropdown) if they appear, 
                   since we have our own custom buttons */
                .goog-te-gadget-simple { background-color: transparent !important; border: none !important; padding: 0 !important; font-size: 14px !important; }
                .goog-te-gadget-icon { display: none !important; }
                
                /* Animations */
                @keyframes scale-up {
                    0% { transform: scale(0.95); opacity: 0; }
                    100% { transform: scale(1); opacity: 1; }
                }
                .animate-scale-up {
                    animation: scale-up 0.2s ease-out forwards;
                }
                
                @keyframes fade-in {
                    0% { opacity: 0; }
                    100% { opacity: 1; }
                }
                .animate-fade-in {
                    animation: fade-in 0.2s ease-out forwards;
                }
            `}</style>
        </>
    );
}
