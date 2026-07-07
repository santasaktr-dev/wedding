import { describe, expect, it } from "vitest";

import { assertValidLanguage, getLocalizedText } from "../validation";

describe("assertValidLanguage", () => {
  it("returns supported languages unchanged", () => {
    expect(assertValidLanguage("en")).toBe("en");
    expect(assertValidLanguage("th")).toBe("th");
  });

  it("falls back to English for unsupported input", () => {
    expect(assertValidLanguage("fr")).toBe("en");
    expect(assertValidLanguage(undefined)).toBe("en");
  });
});

describe("getLocalizedText", () => {
  it("returns English when the requested localized value is empty", () => {
    expect(getLocalizedText({ en: "Hello", th: "" }, "th")).toBe("Hello");
  });
});
