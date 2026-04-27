// Build a Google Calendar event URL.
function pad(n) {
  return n.toString().padStart(2, "0");
}

function toGoogleDate(date) {
  return (
    date.getUTCFullYear().toString() +
    pad(date.getUTCMonth() + 1) +
    pad(date.getUTCDate()) +
    "T" +
    pad(date.getUTCHours()) +
    pad(date.getUTCMinutes()) +
    pad(date.getUTCSeconds()) +
    "Z"
  );
}

export function googleCalendarUrl({ title, startISO, durationHours = 3, details = "", location = "" }) {
  const start = new Date(startISO);
  const end = new Date(start.getTime() + durationHours * 60 * 60 * 1000);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${toGoogleDate(start)}/${toGoogleDate(end)}`,
    details,
    location,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function whatsappUrl(number, message) {
  const clean = (number || "").replace(/[^\d]/g, "");
  const text = encodeURIComponent(message || "");
  if (!clean) return `https://wa.me/?text=${text}`;
  return `https://wa.me/${clean}?text=${text}`;
}
