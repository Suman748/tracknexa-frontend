import { useState } from "react";

const dict = {
  en: {
    createAccount: "Create your account",
    name: "Name",
    phone: "Phone number",
    password: "Password",
    sendOtp: "Send OTP",
    haveAccount: "Already have an account? Log in",
    login: "Log in",
  },
  ta: {
    createAccount: "உங்கள் கணக்கை உருவாக்குங்கள்",
    name: "பெயர்",
    phone: "தொலைபேசி எண்",
    password: "கடவுச்சொல்",
    sendOtp: "OTP அனுப்பு",
    haveAccount: "ஏற்கனவே கணக்கு உள்ளதா? உள்நுழை",
    login: "உள்நுழை",
  },
};

export function useLang() {
  const [lang, setLang] = useState(localStorage.getItem("tn_lang") || "en");
  const toggle = () => {
    const next = lang === "en" ? "ta" : "en";
    localStorage.setItem("tn_lang", next);
    setLang(next);
  };
  return { t: (k) => dict[lang][k] || k, lang, toggle };
}
