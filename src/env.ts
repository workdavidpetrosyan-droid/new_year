export const ENV = {
  // Backend (Google Apps Script Web App)
  appsScriptUrl: (import.meta.env.VITE_APPS_SCRIPT_URL as string | undefined) ?? "",
  appsScriptApiKey: (import.meta.env.VITE_APPS_SCRIPT_API_KEY as string | undefined) ?? "",

  // Event
  eventDateIso: "2026-01-11T18:00:00+04:00",
  eventTz: "Asia/Yerevan",

  venueUrl: "https://www.facebook.com/friendspubyvn/?locale=ru_RU",
  venueName: "Friends Pub",

  eventFeeAmd: 5000,

  // Map (no API key required)
  venueMapsEmbedUrl: "https://www.google.com/maps?q=Friends+Pub+Yerevan&output=embed",
  venueMapsLinkUrl: "https://www.google.com/maps/search/?api=1&query=Friends%20Pub%20Yerevan",

  // Contact
  contactEmail: "it.department@eiu.am",

  // Turnstile (optional)
  turnstileSiteKey: (import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined) ?? ""
} as const;
