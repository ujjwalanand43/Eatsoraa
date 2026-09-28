// Set the confirmed business number in international format, digits only.
const WHATSAPP_NUMBER = '919667761803';

export function WhatsAppButton() {
  const icon = <svg viewBox="0 0 32 32" aria-hidden="true"><path fill="currentColor" d="M16 3a13 13 0 0 0-11.2 19.6L3 29l6.6-1.7A13 13 0 1 0 16 3Zm0 2.3a10.7 10.7 0 1 1-5.5 19.9l-.4-.2-3.8 1 1-3.7-.3-.4A10.7 10.7 0 0 1 16 5.3Zm-4.5 5c-.3 0-.6.1-.8.4-.6.6-1 1.4-1 2.3 0 1.4 1 3 2.5 4.6 1.6 1.8 3.7 3.2 6.2 3.8 1 .2 2.1-.2 2.7-.9.4-.5.6-1.3.5-1.6-.1-.2-.3-.3-.7-.5l-2.1-1c-.3-.1-.5-.1-.7.2l-.9 1.1c-.2.2-.4.3-.7.1-1.9-.8-3.3-2-4.2-3.6-.2-.3 0-.5.2-.7l.7-.9c.2-.2.2-.4.1-.7l-.9-2.2c-.2-.4-.4-.4-.7-.4Z" /></svg>;
  return WHATSAPP_NUMBER ? <a className="whatsapp-float" href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hi SORAA! I need help with your snacks.')}`} target="_blank" rel="noopener noreferrer" aria-label="Chat with SORAA on WhatsApp">{icon}<span>Chat with us</span></a> : <button className="whatsapp-float" type="button" disabled aria-label="WhatsApp chat — business number pending" title="WhatsApp chat — business number pending">{icon}</button>;
}
