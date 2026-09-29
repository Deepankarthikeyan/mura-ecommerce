import { SITE_PHONE, SITE_WHATSAPP_URL } from "@/lib/brand";
import styles from "./FloatingWhatsApp.module.css";

export default function FloatingWhatsApp() {
  return (
    <a
      className={styles.button}
      href={SITE_WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Chat with MuRa@23 on WhatsApp at ${SITE_PHONE} (opens in a new tab)`}
    >
      <span className={styles.label} aria-hidden="true">Chat on WhatsApp</span>
      <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20.52 3.48A11.9 11.9 0 0 0 12.05 0C5.46 0 .1 5.35.1 11.94c0 2.1.55 4.16 1.6 5.97L0 24l6.25-1.64a11.96 11.96 0 0 0 5.8 1.48h.01C18.65 23.84 24 18.49 24 11.9c0-3.19-1.24-6.18-3.48-8.42ZM12.06 21.82a9.91 9.91 0 0 1-5.05-1.38l-.36-.21-3.71.97.99-3.62-.24-.37a9.87 9.87 0 0 1-1.52-5.27c0-5.48 4.46-9.94 9.94-9.94a9.88 9.88 0 0 1 7.02 2.91 9.87 9.87 0 0 1 2.91 7.02c0 5.48-4.46 9.94-9.98 9.89Zm5.45-7.44c-.3-.15-1.77-.87-2.04-.97-.28-.1-.48-.15-.68.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.8-1.49-1.78-1.66-2.08-.18-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.38-.03-.53-.07-.15-.67-1.62-.92-2.21-.24-.58-.49-.5-.67-.51h-.58c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.49 0 1.46 1.07 2.88 1.22 3.08.15.2 2.1 3.21 5.09 4.5.71.31 1.27.5 1.71.64.72.23 1.37.2 1.88.12.57-.08 1.77-.72 2.02-1.42.25-.69.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35Z" />
      </svg>
    </a>
  );
}
