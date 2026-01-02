// src/App.tsx
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { ENV } from "./env";
import { registerSchema, type RegisterFormValues } from "./validation";

import { LanguageToggle } from "./components/LanguageToggle";
import { TurnstileWidget } from "./components/TurnstileWidget";

import type { RegisterPayload, Role } from "./types";

import eiuLogo from "./assets/logo_eiu.png";
import pubBg from "./assets/friends.webp";
import circuitBg from "./assets/umberto-jXd2FSvcRr8-unsplash.jpg";

type ServerState =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success"; email: string }
  | { kind: "error"; reason: "captcha_failed" | "duplicate_email" | "invalid_payload" | "server_error" };

function formatLocalDateTime(iso: string, timeZone: string, lang: "en" | "hy") {
  try {
    const d = new Date(iso);
    const locale = lang === "hy" ? "hy-AM" : "en-US";
    return new Intl.DateTimeFormat(locale, { dateStyle: "long", timeStyle: "short", timeZone }).format(d);
  } catch {
    return iso;
  }
}

function useCountdown(targetIso: string) {
  const target = useMemo(() => new Date(targetIso).getTime(), [targetIso]);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const diffMs = target - now;
  const done = diffMs <= 0;
  const remainingMs = Math.max(0, diffMs);

  const days = Math.floor(remainingMs / 86_400_000);
  const hours = Math.floor((remainingMs % 86_400_000) / 3_600_000);
  const minutes = Math.floor((remainingMs % 3_600_000) / 60_000);
  const seconds = Math.floor((remainingMs % 60_000) / 1000);

  return { done, remainingMs, days, hours, minutes, seconds };
}

function formatCountdown(
  t: (k: string) => string,
  lang: "en" | "hy",
  v: { days: number; hours: number; minutes: number; seconds: number }
) {
  const dU = t("timer.units.day");
  const hU = t("timer.units.hour");
  const mU = t("timer.units.minute");
  const sU = t("timer.units.second");

  if (lang === "hy") {
    const dayPart = v.days > 0 ? `${v.days} ${dU} ` : "";
    return `${dayPart}${v.hours} ${hU} ${v.minutes} ${mU} ${v.seconds} ${sU}`.trim();
  }

  const pad2 = (n: number) => String(n).padStart(2, "0");
  const dayPart = v.days > 0 ? `${v.days}${dU} ` : "";
  return `${dayPart}${pad2(v.hours)}${hU} ${pad2(v.minutes)}${mU} ${pad2(v.seconds)}${sU}`.trim();
}

export default function App() {
  const { t, i18n } = useTranslation();
  const lang: "en" | "hy" = i18n.language.startsWith("hy") ? "hy" : "en";

  const envMissing = !ENV.appsScriptUrl || !ENV.appsScriptApiKey;
  const captchaEnabled = Boolean(ENV.turnstileSiteKey);

  const [mapOpen, setMapOpen] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [serverState, setServerState] = useState<ServerState>({ kind: "idle" });

  const countdown = useCountdown(ENV.eventDateIso);
  const urgent = !countdown.done && countdown.remainingMs <= 86_400_000;

  const defaultValues = useMemo<Partial<RegisterFormValues>>(
    () => ({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      role: "1" as Role,
      consent: false,
      turnstileToken: "turnstile-off",
      honeypot: ""
    }),
    []
  );

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues,
    mode: "onTouched"
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setServerState({ kind: "submitting" });

    if (envMissing) {
      setServerState({ kind: "error", reason: "server_error" });
      return;
    }

    const payload: RegisterPayload = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      phone: values.phone,
      role: values.role,
      lang,
      consent: values.consent,
      turnstileToken: captchaEnabled ? (turnstileToken || values.turnstileToken) : "turnstile-off",
      honeypot: values.honeypot
    };

    try {
      const url = new URL(ENV.appsScriptUrl);
      url.searchParams.set("api_key", ENV.appsScriptApiKey);

      await fetch(url.toString(), { method: "POST", mode: "no-cors", body: JSON.stringify(payload) });

      setServerState({ kind: "success", email: payload.email });
      form.reset({ ...defaultValues });
      setTurnstileToken("");
    } catch {
      setServerState({ kind: "error", reason: "server_error" });
    }
  };

  const errorText = () => {
    if (serverState.kind !== "error") return null;
    if (serverState.reason === "duplicate_email") return t("status.duplicate");
    if (serverState.reason === "captcha_failed") return t("status.captcha");
    if (serverState.reason === "invalid_payload") return t("status.invalid");
    return t("status.server");
  };

  return (
    <div className="page">
      <div className="bg bg--circuit" style={{ backgroundImage: `url(${circuitBg})` }} aria-hidden="true" />
      <div className="bg bg--photo" style={{ backgroundImage: `url(${pubBg})` }} aria-hidden="true" />


      <header className="header">
        <div className="brand">
          <img className="brand-eiu" src={eiuLogo} alt="Eurasia International University" />
          <div className="brand-text">
            <div className="brand-title">{t("brand")}</div>
            <div className="brand-sub">{t("subtitle")}</div>
            <div className="brand-invite">{t("invite")}</div>
          </div>
        </div>
        <LanguageToggle />
      </header>

      <main className="main">
        {/* HERO */}
        <section className="card hero card--glow">
          <div className="hero-banner" style={{ backgroundImage: `url(${pubBg})` }} />
          <h1 className="h1">{t("event.title")}</h1>

          <div className={`timer ${urgent ? "timer--urgent" : ""}`}>
            <span className="timer-label">{t("timer.label")}</span>
            {countdown.done ? (
              <span className="timer-value">{t("timer.started")}</span>
            ) : (
              <span className="timer-value">
                {formatCountdown(t, lang, {
                  days: countdown.days,
                  hours: countdown.hours,
                  minutes: countdown.minutes,
                  seconds: countdown.seconds
                })}
              </span>
            )}
          </div>

          <div className="kv">
            <div className="kv-row">
              <div className="kv-k">{t("event.dateLabel")}</div>
              <div className="kv-v">
                {formatLocalDateTime(ENV.eventDateIso, ENV.eventTz, lang)}
                <div className="muted">{t("event.timezoneNote")}</div>
              </div>
            </div>

            <div className="kv-row">
              <div className="kv-k">{t("event.feeLabel")}</div>
              <div className="kv-v">{t("event.feeValue", { fee: ENV.eventFeeAmd.toLocaleString() })}</div>
            </div>

            <div className="kv-row">
              <div className="kv-k">{t("event.venueLabel")}</div>
              <div className="kv-v">
                <a className="link" href={ENV.venueUrl} target="_blank" rel="noreferrer">
                  {ENV.venueName}
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* MAP (toggle) */}
        <section className="card card--glow">
          <div className="mapHeader">
            <h2 className="h2" style={{ margin: 0 }}>
              {t("map.title")}
            </h2>

            <button
              type="button"
              className="mapToggle"
              onClick={() => setMapOpen((v) => !v)}
              aria-expanded={mapOpen}
              aria-controls="map-panel"
            >
              {mapOpen ? t("map.hide") : t("map.show")}
            </button>
          </div>

          {mapOpen ? (
            <div id="map-panel" className="mapWrap">
              <iframe
                className="mapFrame"
                src={ENV.venueMapsEmbedUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                title="Friends Pub Map"
              />
            </div>
          ) : null}

          <a className="mapLink" href={ENV.venueMapsLinkUrl} target="_blank" rel="noreferrer">
            {t("map.open")}
          </a>
        </section>

        {/* REGISTRATION (only ONE title => no двойной "Գրանցում") */}
        <section className="card card--glow">
          <h2 className="h2">{t("form.title")}</h2>

          {serverState.kind === "success" ? (
            <div className="success">
              <div className="success-title">{t("status.successTitle")}</div>
              <div className="success-body">{t("status.successBody", { email: serverState.email })}</div>
            </div>
          ) : null}

          {envMissing ? (
            <div className="error">
              Missing <b>.env</b> settings: <b>VITE_APPS_SCRIPT_URL</b> and <b>VITE_APPS_SCRIPT_API_KEY</b>
            </div>
          ) : null}

          {serverState.kind === "error" ? <div className="error">{errorText()}</div> : null}

          <form onSubmit={form.handleSubmit(onSubmit)} className="form">
            <div className="hp">
              <label>
                Website
                <input type="text" autoComplete="off" tabIndex={-1} {...form.register("honeypot")} />
              </label>
            </div>

            <div className="grid">
              <label className="field">
                <span>{t("form.firstName")}</span>
                <input inputMode="text" autoComplete="given-name" {...form.register("firstName")} />
                {form.formState.errors.firstName ? <em>{String(form.formState.errors.firstName.message)}</em> : null}
              </label>

              <label className="field">
                <span>{t("form.lastName")}</span>
                <input inputMode="text" autoComplete="family-name" {...form.register("lastName")} />
                {form.formState.errors.lastName ? <em>{String(form.formState.errors.lastName.message)}</em> : null}
              </label>
            </div>

            <div className="grid">
              <label className="field">
                <span>{t("form.email")}</span>
                <input inputMode="email" autoComplete="email" {...form.register("email")} />
                {form.formState.errors.email ? <em>{String(form.formState.errors.email.message)}</em> : null}
              </label>

              <label className="field">
                <span>{t("form.phone")}</span>
                <input inputMode="tel" autoComplete="tel" placeholder="+374..." {...form.register("phone")} />
                {form.formState.errors.phone ? <em>{String(form.formState.errors.phone.message)}</em> : null}
              </label>
            </div>

            <label className="field">
              <span>{t("form.role")}</span>
              <select {...form.register("role")}>
                <option value="1">{t("form.roleYear", { n: 1 })}</option>
                <option value="2">{t("form.roleYear", { n: 2 })}</option>
                <option value="3">{t("form.roleYear", { n: 3 })}</option>
                <option value="4">{t("form.roleYear", { n: 4 })}</option>
                <option value="5">{t("form.roleYear", { n: 5 })}</option>
                <option value="lecturer_staff">{t("form.roleLecturer")}</option>
              </select>
              {form.formState.errors.role ? <em>{String(form.formState.errors.role.message)}</em> : null}
            </label>

            <div className="consent">
              <label className="checkbox">
                <input type="checkbox" {...form.register("consent")} />
                <span>{t("form.consent")}</span>
              </label>
              {form.formState.errors.consent ? <em>{t("status.invalid")}</em> : null}
              <div className="privacy">{t("form.privacy", { email: ENV.contactEmail })}</div>
            </div>

            <div className="captchaWrap">
              {captchaEnabled ? (
                <>
                  <TurnstileWidget
                    siteKey={ENV.turnstileSiteKey}
                    onToken={(tok) => setTurnstileToken(tok)}
                    onError={() => setTurnstileToken("")}
                  />
                  {!turnstileToken ? <div className="muted">{t("form.captchaRequired")}</div> : null}
                </>
              ) : null}
            </div>

            <button
              type="submit"
              className="submit"
              disabled={serverState.kind === "submitting" || envMissing || (captchaEnabled ? !turnstileToken : false)}
              onClick={() => form.setValue("turnstileToken", captchaEnabled ? (turnstileToken || "") : "turnstile-off")}
            >
              {serverState.kind === "submitting" ? t("form.submitting") : t("form.submit")}
            </button>
          </form>
        </section>

        <footer className="footer">
          {/* <div className="muted">{t("form.privacy", { email: ENV.contactEmail })}</div> */}
        </footer>
      </main>
    </div>
  );
}
