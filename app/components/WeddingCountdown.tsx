"use client";

import { useEffect, useState } from "react";

type Language = "en" | "th";

type CountdownValues = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  complete: boolean;
};

const targetTime = new Date("2026-11-01T00:00:00+07:00").getTime();

function getCountdownValues(now = Date.now()): CountdownValues {
  const remaining = Math.max(0, targetTime - now);
  const totalSeconds = Math.floor(remaining / 1000);

  return {
    days: Math.floor(totalSeconds / 86_400),
    hours: Math.floor((totalSeconds % 86_400) / 3_600),
    minutes: Math.floor((totalSeconds % 3_600) / 60),
    seconds: totalSeconds % 60,
    complete: remaining === 0,
  };
}

const labels = {
  en: {
    eyebrow: "The countdown",
    title: "Until our wedding day",
    units: ["Days", "Hours", "Minutes", "Seconds"],
    complete: "Today is the day!",
  },
  th: {
    eyebrow: "นับถอยหลัง",
    title: "จนถึงวันแต่งงานของเรา",
    units: ["วัน", "ชั่วโมง", "นาที", "วินาที"],
    complete: "วันนี้คือวันของเรา!",
  },
} as const;

export function WeddingCountdown({ language }: { language: Language }) {
  const [countdown, setCountdown] = useState<CountdownValues | null>(null);
  const text = labels[language];
  const values = countdown
    ? [countdown.days, countdown.hours, countdown.minutes, countdown.seconds]
    : ["--", "--", "--", "--"];

  useEffect(() => {
    const timer = window.setInterval(() => setCountdown(getCountdownValues()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="bg-[#0A1F44] px-4 py-12 text-[#FBF8F0] sm:px-6 sm:py-14 lg:px-8" aria-label={text.title}>
      <div className="mx-auto max-w-4xl text-center">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-[#D6C8A5]">{text.eyebrow}</p>
        {countdown?.complete ? (
          <p className="luxury-heading text-3xl font-semibold text-[#D6C8A5] sm:text-4xl">{text.complete}</p>
        ) : (
          <>
            <h2 className="luxury-heading text-2xl font-semibold sm:text-3xl">{text.title}</h2>
            <div className="mx-auto mt-8 grid max-w-3xl grid-cols-4 gap-1.5 sm:gap-4">
              {values.map((value, index) => (
                <div className="rounded border border-[#D6C8A5]/30 bg-white/[0.04] px-1.5 py-3 sm:px-4 sm:py-5" key={text.units[index]}>
                  <p className="text-2xl font-semibold tabular-nums text-[#D6C8A5] sm:text-4xl md:text-5xl">
                    {typeof value === "number" ? String(value).padStart(2, "0") : value}
                  </p>
                  <p className="mt-1 text-[0.5rem] font-semibold uppercase tracking-[0.08em] text-[#FBF8F0]/70 sm:mt-2 sm:text-xs sm:tracking-[0.18em]">
                    {text.units[index]}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
