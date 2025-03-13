"use client";

import { useTranslation } from "react-i18next";

export default function Auth() {
  const { t } = useTranslation(["global"]);
  return (
    <div className="w-full h-full min-h-screen flex justify-center">
      {t("welcomeBack")}
    </div>
  );
}
