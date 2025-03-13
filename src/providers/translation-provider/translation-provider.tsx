'use client';

import { ReactElement } from 'react';
import { I18nextProvider } from 'react-i18next';

import { createInstance, type i18n } from 'i18next';

import { getTranslation } from '@/i18n';

import type { Props } from './types';

export function TranslationProvider({
  children,
  locale,
  namespaces,
  resources
}: Props): ReactElement {
  const instance = createInstance() as unknown as i18n;

  getTranslation(locale, namespaces, instance, resources);

  return <I18nextProvider i18n={instance}>{children}</I18nextProvider>;
}
