"use client";
import { useLanguage } from "@/app/contexts/LanguageContext";

export default function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();

  const getCurrLabel = () => {
    switch (language) {
      case "en":
        return "English";
      case "zh-Hans":
        return "简体中文";
      case "zh-Hant":
        return "繁體中文";
      default:
        return "Switch";
    }
  };

  return (
    <button onClick={toggleLanguage} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">
      {getCurrLabel()}
    </button>
  );
}
