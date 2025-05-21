export default function LanguageToggle({ currentLang, onToggle }) {
    return (
      <button
        onClick={onToggle}
        className="px-2 py-1 border rounded text-sm cursor-pointer"
      >
        {currentLang ? "中文" : "English"}
      </button>
    );
  }