export type Role = "lecturer_staff" | "1" | "2" | "3" | "4" | "5";

export type RegisterPayload = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: Role;
  lang: "en" | "hy";
  consent: boolean;
  turnstileToken: string;
  honeypot?: string;
};

export type RegisterResponse =
  | { ok: true }
  | { ok: false; reason: "captcha_failed" | "duplicate_email" | "invalid_payload" | "server_error" };
