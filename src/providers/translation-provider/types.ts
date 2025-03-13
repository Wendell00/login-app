import type { ReactNode } from 'react';

import type { Resource } from 'i18next';

import type { Translation } from '@/i18n';

export interface Props {
  children: ReactNode;
  locale: string;
  namespaces: Translation[];
  resources: Resource;
}
