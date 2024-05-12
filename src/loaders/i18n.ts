import i18next, { TFunction } from 'i18next';
import i18nextMiddleware from 'i18next-http-middleware';
import Backend from 'i18next-fs-backend';

import { en, tr } from '@locales/index';

const resources = {
  en: {
    translation: en,
  },
  tr: {
    translation: tr,
  },
};

export default function (): Promise<
  TFunction<'translation', undefined, 'translation'>
> {
  return i18next
    .use(Backend)
    .use(i18nextMiddleware.LanguageDetector)
    .init({
      fallbackLng: 'tr',
      lowerCaseLng: true,
      preload: ['tr', 'en'],
      resources,
    });
}

export { i18nextMiddleware, i18next };
