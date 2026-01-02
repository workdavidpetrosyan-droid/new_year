import { useEffect, useId, useRef } from "react";


declare global {
  interface Window {
    turnstile?: {
      render: (container: string | HTMLElement, options: Record<string, unknown>) => string;
      reset: (widgetId?: string) => void;
    };
  }
}

type Props = {
  siteKey: string;
  onToken: (token: string) => void;
  onError: () => void;
};

export function TurnstileWidget({ siteKey, onToken, onError }: Props) {
  const id = useId();
  const widgetIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!siteKey) return;

    const renderIfReady = () => {
      if (!window.turnstile) return;
      const container = document.getElementById(id);
      if (!container) return;

      widgetIdRef.current = window.turnstile.render(container, {
        sitekey: siteKey,
        callback: (token: unknown) => onToken(String(token ?? "")),
        "error-callback": () => onError(),
        "expired-callback": () => onToken("")
      });
    };

    renderIfReady();

    const t = window.setInterval(() => {
      if (widgetIdRef.current) {
        window.clearInterval(t);
        return;
      }
      renderIfReady();
    }, 250);

    return () => window.clearInterval(t);
  }, [id, siteKey, onToken, onError]);

  return <div id={id} className="turnstile" />;
}
