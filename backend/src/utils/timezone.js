import { DateTime } from "luxon";

export function isValidTimezone(timezone) {
  if (typeof timezone !== "string" || !timezone.trim()) return false;
  return DateTime.now().setZone(timezone).isValid;
}

export function parseLocalDateTime(localDateTime, timezone) {
  if (typeof localDateTime !== "string" || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2})?$/.test(localDateTime)) {
    throw Object.assign(new Error("Date/time must use YYYY-MM-DDTHH:mm format."), { statusCode: 400 });
  }

  const parsed = DateTime.fromISO(localDateTime, {
    zone: timezone,
    setZone: true
  });

  if (!parsed.isValid) {
    throw Object.assign(new Error("The selected date/time is invalid."), { statusCode: 400 });
  }

  // Luxon can normalize a nonexistent DST local time. A round-trip check
  // lets us reject a time that never existed in the selected timezone.
  const normalized = parsed.toFormat("yyyy-MM-dd'T'HH:mm");
  const requested = localDateTime.slice(0, 16);

  if (normalized !== requested) {
    throw Object.assign(
      new Error("That local time does not exist because of a daylight-saving transition. Please choose another time."),
      { statusCode: 400 }
    );
  }

  // During a fall-back transition, a local clock time can occur twice.
  // Rejecting it avoids silently choosing one of two possible instants.
  if (typeof parsed.getPossibleOffsets === "function" && parsed.getPossibleOffsets().length > 1) {
    throw Object.assign(
      new Error("That local time occurs twice because of a daylight-saving transition. Please choose another time."),
      { statusCode: 400 }
    );
  }

  return parsed;
}

export function toUtc(localDateTime, timezone) {
  return parseLocalDateTime(localDateTime, timezone).toUTC();
}

export function toLocal(utcIso, timezone) {
  return DateTime.fromISO(utcIso, { zone: "utc" }).setZone(timezone);
}
