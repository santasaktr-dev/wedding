"use client";

import type { Language } from "../../../lib/cms/types";

type LanguageTabsProps = {
  language: Language;
  onChange: (language: Language) => void;
};

export function LanguageTabs({ language, onChange }: LanguageTabsProps) {
  return (
    <div className="inline-flex border border-[#d6c8a5] bg-white p-1" role="tablist" aria-label="Content language">
      {(["en", "th"] as const).map((item) => (
        <button
          aria-selected={language === item}
          className={`min-h-10 px-4 text-sm font-semibold transition ${
            language === item ? "bg-[#0a1f44] text-[#fbf8f0]" : "text-[#0a1f44] hover:bg-[#f7efe2]"
          }`}
          key={item}
          onClick={() => onChange(item)}
          role="tab"
          type="button"
        >
          {item === "en" ? "English" : "ไทย"}
        </button>
      ))}
    </div>
  );
}
