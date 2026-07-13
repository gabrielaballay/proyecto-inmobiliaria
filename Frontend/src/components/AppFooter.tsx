import { useNavigate } from "react-router-dom";
import { appConfig } from "../config/appConfig";

export default function AppFooter() {

    const navigate = useNavigate();

    return (
        <footer className="btn-primary-theme text-neutral-400 py-10 px-8 mt-16 border-t border-neutral-900 text-center">
            <div className="max-w-xl mx-auto flex flex-col items-center">
                <img src={appConfig.logo} alt="Logo" 
                    className="h-10 w-auto object-contain mb-2 invert opacity-30" 
                />
                <p className="text-neutral-400 text-[10px] font-light uppercase tracking-[0.3em] mb-8">
                    Gestión Inmobiliaria Integral
                </p>

                <div className="flex justify-center items-center gap-10 mb-5">
                    <a
                        href={appConfig.social.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-white transition-colors duration-300 flex items-center justify-center"
                    >
                        <svg className="size-5 fill-current" viewBox="0 0 24 24">
                            <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.8z" />
                        </svg>
                    </a>

                    <a
                        href={`https://wa.me/${appConfig.whatsapp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-white transition-colors duration-300 flex items-center justify-center"
                    >
                        <svg className="size-5 fill-current" viewBox="0 0 24 24">
                            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.713-1.457L0 24zm6.59-4.846c1.66.986 3.288 1.498 4.85 1.5l.004.001c5.447 0 9.875-4.426 9.878-9.877.001-2.64-1.019-5.122-2.87-6.973-1.85-1.851-4.335-2.87-6.975-2.871-5.452 0-9.88 4.427-9.883 9.879-.001 1.73.475 3.41 1.374 4.89l-.224.82-.62 2.264 2.32-.608.855-.225zm13.111-6.143c-.244-.122-1.442-.712-1.666-.794-.223-.082-.385-.122-.547.122-.162.244-.627.794-.769.957-.142.163-.284.183-.528.061-.243-.122-.973-.359-1.854-1.144-.685-.611-1.148-1.366-1.282-1.59-.135-.223-.014-.344.108-.465.11-.11.244-.285.365-.426.122-.142.163-.244.244-.407.081-.162.041-.305-.02-.426-.062-.122-.547-1.32-.75-1.81-.197-.474-.398-.41-.547-.417-.141-.007-.304-.007-.466-.007-.163 0-.427.061-.65.305-.224.244-.853.834-.853 2.031 0 1.197.872 2.353.993 2.516.122.163 1.717 2.622 4.16 3.677.581.252 1.034.402 1.39.516.583.185 1.114.159 1.534.096.468-.07 1.442-.589 1.646-1.159.203-.57.203-1.057.142-1.159-.06-.101-.223-.162-.466-.284z" />
                        </svg>
                    </a>

                    <a
                        href={`mailto:${appConfig.email}`}
                        className="hover:text-white transition-colors duration-300 flex items-center justify-center"
                    >
                        <svg className="size-5 fill-current" viewBox="0 0 24 24">
                            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                        </svg>
                    </a>
                </div>

                <p className="text-neutral-400 text-[10px] uppercase tracking-[0.2em] font-light mb-4">
                    {appConfig.address}
                </p>

                {/* Enlaces Editoriales Inyectados */}
                <div className="flex justify-center items-center gap-6 mb-5">
                    <button
                        onClick={() => navigate('/settings/help')}
                        className="hover:text-neutral-200 transition-colors duration-200"
                    >
                        Ayuda y Soporte
                    </button>
                    <span className="text-neutral-800">•</span>
                    <button
                        onClick={() => navigate('/settings/terms')}
                        className="hover:text-neutral-200 transition-colors duration-200"
                    >
                        Términos Legales
                    </button>
                </div>

                {/* <div className="w-12 h-[1px] btn-primary-theme mb-6" /> */}

                <p className="text-neutral-400 text-[8px] uppercase tracking-[0.25em] font-light">
                    © 2026 {appConfig.companyName}. Todos los derechos reservados.
                </p>

            </div>
        </footer>
    );
};

