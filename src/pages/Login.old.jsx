import { useLang } from "../i18n";

// inside the component:
const { t, lang, toggle } = useLang();

// replace the text, for example:
<h2>{t("createAccount")}</h2>
<button onClick={toggle}>{lang === "en" ? "தமிழ்" : "English"}</button>
<button>{t("sendOtp")}</button>