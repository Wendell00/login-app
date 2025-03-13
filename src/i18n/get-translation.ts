import {
  type Resource,
  type TFunction,
  type i18n,
  createInstance
} from 'i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { initReactI18next } from 'react-i18next/initReactI18next';
import { z } from 'zod';
import { makeZodI18nMap } from 'zod-i18n-map';

import { i18nConfig } from './config';
import type { Translation } from './types';

export async function getTranslation(
  locale: string,
  namespaces: Translation[],
  i18nInstance?: i18n,
  resources?: Resource
): Promise<{
  i18n: i18n;
  resources: Resource;
  t: TFunction<[...Translation[]], undefined>;
}> {
  i18nInstance = i18nInstance || (createInstance() as unknown as i18n);
  i18nInstance.use(initReactI18next);

  if (!resources) {
    i18nInstance.use(
      resourcesToBackend(
        (language: string, namespace: string) =>
          import(`@/i18n/${language}/${namespace}.json`)
      )
    );
  }

  await i18nInstance.init({
    lng: locale,
    resources,
    fallbackLng: i18nConfig.defaultLocale,
    supportedLngs: i18nConfig.locales,
    defaultNS: namespaces[0],
    fallbackNS: namespaces[0],
    ns: namespaces,
    preload: resources ? [] : i18nConfig.locales
  });

  z.setErrorMap(makeZodI18nMap({ t: i18nInstance.t }));

  return {
    i18n: i18nInstance,
    resources: i18nInstance.services.resourceStore.data,
    t: i18nInstance.t as unknown as TFunction<[...Translation[]], undefined>
  };
}
