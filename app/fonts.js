import localFont from "next/font/local";

export const vazirmatn = localFont({
  src: [
    { path: "../public/fonts/Vazirmatn-Regular.woff2",  weight: "400", style: "normal" },
    { path: "../public/fonts/Vazirmatn-Medium.woff2",   weight: "500", style: "normal" },
    { path: "../public/fonts/Vazirmatn-SemiBold.woff2", weight: "600", style: "normal" },
    { path: "../public/fonts/Vazirmatn-Bold.woff2",     weight: "700", style: "normal" },
  ],
  variable: "--font-vazirmatn",
  display: "swap",
  preload: true,
  fallback: ["Tahoma", "Arial", "sans-serif"],
});
