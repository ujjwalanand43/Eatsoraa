const ANNOUNCEMENTS = [
  {icon: null, text: 'Grab Snack Go'},
  {icon: 'truck', text: 'Free Shipping on Orders Above ₹999'},
  {icon: null, text: 'Your Snack Break Deserves Better'},
] as const;

export function AnnouncementBar() {
  return (
    <div className="announcement-bar">
      {ANNOUNCEMENTS.map((item) => (
        <p className="announcement-item" key={item.text}>
          {item.icon === 'truck' && <TruckIcon />}
          <span>{item.text}</span>
        </p>
      ))}
    </div>
  );
}

function TruckIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M2 6h11v10H2z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M13 10h4l3 3v3h-7z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle cx="6" cy="18" r="1.6" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17" cy="18" r="1.6" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}
