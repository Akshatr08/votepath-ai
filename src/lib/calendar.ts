/**
 * Google Calendar deep-link generator.
 *
 * Builds a URL that opens Google Calendar's event creation form pre-filled
 * with election-related event details (title, date, description, location).
 *
 * @module lib/calendar
 */

/** Default event duration in milliseconds (1 hour). */
const DEFAULT_EVENT_DURATION_MS = 60 * 60 * 1000;

/**
 * Generates a Google Calendar event creation URL with pre-filled details.
 *
 * @param title - The event title (e.g., "Voter Registration Deadline").
 * @param date - A date string parseable by `new Date()`.
 * @param description - A description for the calendar event body.
 * @returns A fully-formed Google Calendar URL that opens the event creation form.
 */
export function getGoogleCalendarLink(title: string, date: string, description: string): string {
  const baseUrl = "https://www.google.com/calendar/render?action=TEMPLATE";
  const eventDate = new Date(date);
  
  // Format dates for Google Calendar (YYYYMMDDTHHMMSSZ)
  const formatGCalDate = (d: Date): string => d.toISOString().replace(/-|:|\.\d\d\d/g, "");
  
  const start = formatGCalDate(eventDate);
  const end = formatGCalDate(new Date(eventDate.getTime() + DEFAULT_EVENT_DURATION_MS));

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
