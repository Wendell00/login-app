import "react-i18next";

import global from "@/i18n/enUS/global.json";

declare module "i18next" {
  interface CustomTypeOptions {
    resources: {
      global: typeof global;
    };
  }
}
