import test from "node:test";
import assert from "node:assert/strict";
import { DateTime } from "luxon";
import { isValidTimezone, toUtc, toLocal } from "../src/utils/timezone.js";

test("converts New York summer time using DST", () => {
  const utc = toUtc("2026-07-15T10:00:00", "America/New_York");
  assert.equal(utc.toISO(), "2026-07-15T14:00:00.000Z");
});

test("converts New York winter time using standard time", () => {
  const utc = toUtc("2026-01-15T10:00:00", "America/New_York");
  assert.equal(utc.toISO(), "2026-01-15T15:00:00.000Z");
});

test("converts UTC to India", () => {
  const local = toLocal("2026-09-28T14:00:00.000Z", "Asia/Kolkata");
  assert.equal(local.toFormat("yyyy-MM-dd HH:mm"), "2026-09-28 19:30");
});

test("Luxon exposes different offsets across DST", () => {
  const winter = DateTime.fromISO("2026-01-15T10:00:00", { zone: "America/New_York" });
  const summer = DateTime.fromISO("2026-07-15T10:00:00", { zone: "America/New_York" });

  assert.equal(winter.offset, -300);
  assert.equal(summer.offset, -240);
});

test("validates IANA timezone names", () => {
  assert.equal(isValidTimezone("Asia/Kolkata"), true);
  assert.equal(isValidTimezone("America/New_York"), true);
  assert.equal(isValidTimezone("Asia/NotARealZone"), false);
});

test("rejects a nonexistent spring-forward local time", () => {
  assert.throws(
    () => toUtc("2026-03-08T02:30:00", "America/New_York"),
    (error) => error.statusCode === 400
  );
});

test("rejects an ambiguous fall-back local time", () => {
  assert.throws(
    () => toUtc("2026-11-01T01:30:00", "America/New_York"),
    (error) => error.statusCode === 400
  );
});
