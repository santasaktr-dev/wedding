import type { ReactNode } from "react";

type StatusBannerProps = {
  tone: "info" | "success" | "error";
  children: ReactNode;
};

export function StatusBanner({ tone, children }: StatusBannerProps) {
  const classes = {
    info: "border-[#0a1f44]/15 bg-white/80 text-[#0a1f44]",
    success: "border-[#3e4d3a]/25 bg-[#3e4d3a]/10 text-[#3e4d3a]",
    error: "border-red-700/25 bg-red-50 text-red-800",
  };

  return (
    <div className={`border p-4 text-sm leading-6 ${classes[tone]}`} role={tone === "error" ? "alert" : "status"}>
      {children}
    </div>
  );
}
