// src/i18n.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

type Lang = "en" | "hy";

function detectInitialLanguage(): Lang {
  const saved = (localStorage.getItem("lang") || "").toLowerCase();
  if (saved.startsWith("hy")) return "hy";
  if (saved.startsWith("en")) return "en";

  const nav = (navigator.language || "").toLowerCase();
  if (nav.startsWith("hy")) return "hy";
  return "en";
}

const resources = {
  en: {
    translation: {
      brand: "Eurasia International University",
      subtitle: "IT Department",
      invite:
        "Eurasia International University warmly invites you to celebrate New Year and Christmas together.",

      timer: {
        label: "Time left",
        started: "Event has started",
        units: { day: "d", hour: "h", minute: "m", second: "s" }
      },

      event: {
        title: "EIU IT New Year Party at Friends Pub",
        dateLabel: "Date & time",
        venueLabel: "Venue",
        feeLabel: "Entrance fee",
        feeValue: "{{fee}} AMD",
        timezoneNote: "Timezone: Asia/Yerevan"
      },

      map: {
        title: "Location on map",
        open: "Open in Google Maps",
        show: "Show map",
        hide: "Hide map"
      },

      form: {
        title: "Registration",
        firstName: "Name",
        lastName: "Surname",
        email: "Email",
        phone: "Phone number",
        role: "Year of studies / Lecturer",
        roleYear: "Year {{n}}",
        roleLecturer: "Lecturer / Staff",
        consent:
          "I agree to the privacy notice and consent to processing for event registration.",
        privacy: "In case of any questions feel free to contact us: {{email}}",
        captchaRequired: "Please complete the captcha.",
        submitting: "Submitting…",
        submit: "Register"
      },

      status: {
        successTitle: "Registered!",
        successBody:
          "We received your registration. Confirmation will be sent to {{email}}.",
        duplicate: "This email is already registered.",
        captcha: "Captcha verification failed. Please try again.",
        invalid: "Please fix the form errors and try again.",
        server: "Server error. Please try again."
      }
    }
  },

  hy: {
    translation: {
      brand: "ԵՄՀ",
      subtitle: "ՏՀ Ամբիոն",
      invite:
        "Եվրասիա Միջազգային Համալսարանը սիրով հրավիրում է միասին նշելու Ամանորն ու Սուրբ Ծնունդը",

      timer: {
        label: "Միջոցառմանը մնաց",
        started: "Միջոցառումը սկսվել է",
        units: { day: "օր", hour: "ժ", minute: "ր", second: "վ" }
      },

      event: {
        title: "ԵՄՀ ՏՀ ամանորյա երեկո՝ Friends Pub-ում",
        dateLabel: "Ամսաթիվ և ժամ",
        venueLabel: "Վայրը",
        feeLabel: "Մուտքավճար",
        feeValue: "{{fee}} դրամ",
        timezoneNote: "Ժամային գոտի՝ Ասիա/Երևան"
      },

      map: {
        title: "Գտնվելու վայրը քարտեզի վրա",
        open: "Բացել Google Maps-ում",
        show: "Ցույց տալ քարտեզը",
        hide: "Թաքցնել քարտեզը"
      },

      form: {
        title: "Գրանցում",
        firstName: "Անուն",
        lastName: "Ազգանուն",
        email: "Էլ. հասցե",
        phone: "Հեռախոսահամար",
        role: "Կուրս / Դասախոս",
        roleYear: "Կուրս {{n}}",
        roleLecturer: "Դասախոս / Աշխատակազմ",
        consent:
          "Ես համաձայն եմ գաղտնիության քաղաքականության հետ և տալիս եմ անձնական տվյալների մշակման թույլատվություն՝ միջոցառման գրանցման համար։",
        privacy: "Հարցերի դեպքում կապվեq մեզ հետ՝ {{email}}",
        captchaRequired: "Խնդրում ենք անցնել captcha-ն։",
        submitting: "Ուղարկվում է…",
        submit: "Գրանցվել"
      },

      status: {
        successTitle: "Գրանցումը հաջողվեց։",
        successBody:
          "Ձեր գրանցումը ստացվել է։ Հաստատումը կուղարկվի՝ {{email}} հասցեին։",
        duplicate: "Այս էլ․ հասցեն արդեն գրանցված է։",
        captcha: "Captcha-ն չհաջողվեց։ Խնդրում ենք կրկին փորձել։",
        invalid: "Խնդրում ենք ուղղել սխալները և կրկին փորձել։",
        server: "Սերվերի սխալ։ Կրկին փորձեք։"
      }
    }
  }
} as const;

void i18n.use(initReactI18next).init({
  resources,
  lng: detectInitialLanguage(),
  fallbackLng: "en",
  supportedLngs: ["en", "hy"],
  interpolation: { escapeValue: false }
});

i18n.on("languageChanged", (lng) => {
  const v: Lang = (lng || "").startsWith("hy") ? "hy" : "en";
  localStorage.setItem("lang", v);
});

export default i18n;
