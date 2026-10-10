const WHATSAPP_NUMBER = '919667761803';

export function WhatsAppButton() {
  return <a className="whatsapp-float" href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hi SORAA! I need help with your snacks.')}`} target="_blank" rel="noopener noreferrer" aria-label="Chat with SORAA on WhatsApp" aria-describedby="soraa-chat-tooltip">
    <svg viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <path d="M32 19c0 8-6 13-14 13h-5l-7 4 2-9C2 18 7 7 18 7c8 0 14 5 14 12Z" fill="currentColor" />
      <circle cx="14" cy="18" r="1.8" fill="#5B1A30" />
      <circle cx="24" cy="18" r="1.8" fill="#5B1A30" />
      <path d="M14 24q5 5 10 0" stroke="#5B1A30" strokeWidth="2" strokeLinecap="round" />
      <path d="m33 3 1.5 4.5L39 9l-4.5 1.5L33 15l-1.5-4.5L27 9l4.5-1.5Z" fill="#ffb566" />
    </svg>
    <span id="soraa-chat-tooltip" role="tooltip">Let’s talk snacks!<small>Chat on WhatsApp ↗</small></span>
  </a>;
}
