
import { useTranslation } from "react-i18next";

type Lang = "en" | "hy";

export function LanguageToggle() {
  const { i18n } = useTranslation();
  const current: Lang = i18n.language.startsWith("hy") ? "hy" : "en";

  const setLang = async (lng: Lang) => {
    if (lng === current) return;
    await i18n.changeLanguage(lng);
  };

  return (
    <div className="langToggle" role="group" aria-label="Language">
      <button
        type="button"
        className={`langToggle-btn ${current === "hy" ? "is-active" : ""}`}
        onClick={() => setLang("hy")}
        aria-pressed={current === "hy"}
      >
        HY
      </button>

      <button
        type="button"
        className={`langToggle-btn ${current === "en" ? "is-active" : ""}`}
        onClick={() => setLang("en")}
        aria-pressed={current === "en"}
      >
        EN
      </button>
    </div>
  );
}
