export const SITE_URL = "https://memova.ai";
export const SOCIAL_IMAGE = `${SITE_URL}/brand/memova-app-icon-512.png`;
export const APP_STORE_URL = "https://apps.apple.com/us/app/memova-ai/id6796284954";

export const BRAND_DESCRIPTION = "Memova is an Apple Watch voice recorder. Tap to record on your wrist, then transcribe and search your conversations offline on iPhone. Recordings stay on your device by default.";

export const HOMEPAGE_METADATA = {
  en: {
    title: "Memova: Apple Watch Voice Recorder & Life Journal",
    description: "Record on Apple Watch with one tap, even with the screen off. Transcribe and search offline on iPhone. Saved locally by default. Free to download.",
  },
  zh: {
    title: "Memova：Apple Watch 录音 App 与生活日记",
    description: "在 Apple Watch 上一键录音，熄屏继续记录，在 iPhone 上离线转写和搜索。录音默认保存在设备上，可免费下载，App 本地与云端功能均无需账号。",
  },
};

export function getBrandEntities(language = "en-US") {
  const organization = {
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: "Memova",
    legalName: "MEMOVA LLC",
    url: `${SITE_URL}/`,
    logo: SOCIAL_IMAGE,
  };
  const website = {
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: "Memova",
    url: `${SITE_URL}/`,
    inLanguage: language,
    publisher: { "@id": organization["@id"] },
  };
  const app = {
    "@type": "MobileApplication",
    "@id": `${SITE_URL}/#app`,
    name: "Memova",
    alternateName: "Memova AI",
    description: language.startsWith("zh")
      ? "Memova 是一款 Apple Watch 录音 App：手腕上一键录音，在 iPhone 上离线转写和搜索，录音默认只存在你的设备上。"
      : BRAND_DESCRIPTION,
    inLanguage: language,
    operatingSystem: "iOS, watchOS",
    applicationCategory: "ProductivityApplication",
    url: `${SITE_URL}/`,
    installUrl: APP_STORE_URL,
    sameAs: [APP_STORE_URL],
    publisher: { "@id": organization["@id"] },
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };
  return { organization, website, app };
}
