const ANNOUNCEMENTS = [
  {icon: 'heart', text: 'Good Snacks, Better Days'},
  {icon: 'truck', text: 'Free Shipping on Orders Above ₹999'},
  {icon: null, text: 'A Healthier You, One Bite at a Time'},
] as const;

export function AnnouncementBar() {
  return (
    <div className="announcement-bar">
      {ANNOUNCEMENTS.map((item) => (
        <p className="announcement-item" key={item.text}>
          {item.icon === 'heart' && <HeartOutlineIcon />}
          {item.icon === 'truck' && <TruckIcon />}
          <span>{item.text}</span>
        </p>
      ))}
    </div>
  );
}

function HeartOutlineIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 20.3s-7.4-4.4-9.9-9C.6 8 1.8 4.4 5.2 3.6c2-.5 4 .3 5.2 2 .3.4.9.4 1.2 0 1.2-1.7 3.2-2.5 5.2-2 3.4.8 4.6 4.4 3.1 7.7-2.5 4.6-9.9 9-9.9 9z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
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
