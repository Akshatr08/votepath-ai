export function getGoogleCalendarLink(title: string, date: string, description: string) {
  const baseUrl = "https://www.google.com/calendar/render?action=TEMPLATE";
  const eventDate = new Date(date);
  
  // Format dates for Google Calendar (YYYYMMDDTHHMMSSZ)
  const formatGCalDate = (d: Date) => d.toISOString().replace(/-|:|\.\d\d\d/g, "");
  
  const start = formatGCalDate(eventDate);
  const end = formatGCalDate(new Date(eventDate.getTime() + 60 * 60 * 1000)); // +1 hour

  const params = new URLSearchParams({
    text: title,
    dates: `${start}/${end}`,
    details: description,
    location: "Your Local Polling Station",
    sf: "true",
    output: "xml",
  });

  return `${baseUrl}&${params.toString()}`;
}
