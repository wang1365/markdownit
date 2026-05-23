import { describe, expect, it } from "vitest";
import { defaultLocale, detectLocaleFromHeader, getDirection, isLocale } from "./config";

describe("locale helpers", () => {
  it("validates supported locales", () => {
    expect(isLocale("zh-CN")).toBe(true);
    expect(isLocale("es")).toBe(false);
  });

  it("detects best locale from accept-language", () => {
    expect(detectLocaleFromHeader("de-DE,de;q=0.9,en;q=0.8")).toBe("de");
    expect(detectLocaleFromHeader("zh-Hant-TW,zh;q=0.8")).toBe(defaultLocale);
  });

  it("marks Arabic as rtl", () => {
    expect(getDirection("ar")).toBe("rtl");
    expect(getDirection("en")).toBe("ltr");
  });
});
