import test, { before, after, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { initializeDatabase, seedDatabase, db } from "../src/db/database.js";
import { createBooking } from "../src/services/bookingService.js";

before(() => {
  initializeDatabase();
  seedDatabase();
});

beforeEach(() => {
  db.exec("DELETE FROM bookings");
});

after(() => {
  db.close();
});

function futureLocalTime() {
  return "2099-06-15T10:00:00";
}

test("assigns an available mentor and creates a booking", () => {
  const booking = createBooking({
    name: "Test Parent",
    email: "test.parent@example.com",
    timezone: "Asia/Kolkata",
    startTime: futureLocalTime()
  });

  assert.ok(booking.id);
  assert.ok(booking.mentor.id);
  assert.match(booking.meetingLink, /^https:\/\/demo\.codeyoung\.com\/class\//);

  const saved = db.prepare("SELECT * FROM bookings WHERE id = ?").get(booking.id);
  assert.equal(saved.status, "CONFIRMED");
});

test("rejects duplicate overlapping booking for the same parent", () => {
  const input = {
    name: "Duplicate Parent",
    email: "duplicate@example.com",
    timezone: "Asia/Kolkata",
    startTime: futureLocalTime()
  };

  createBooking(input);

  assert.throws(
    () => createBooking(input),
    (error) => error.statusCode === 409
  );
});

test("rejects an invalid email", () => {
  assert.throws(
    () => createBooking({
      name: "Bad Parent",
      email: "not-an-email",
      timezone: "Asia/Kolkata",
      startTime: futureLocalTime()
    }),
    (error) => error.statusCode === 400
  );
});


test("does not create a 21st booking when all 10 mentors reach their daily limit", () => {
  for (let hour = 0; hour < 20; hour += 1) {
    const hh = String(hour).padStart(2, "0");
    createBooking({
      name: `Capacity Parent ${hour}`,
      email: `capacity${hour}@example.com`,
      timezone: "Asia/Kolkata",
      startTime: `2099-07-20T${hh}:00:00`
    });
  }

  const counts = db.prepare(`
    SELECT mentor_id, COUNT(*) AS count
    FROM bookings
    WHERE status = 'CONFIRMED'
    GROUP BY mentor_id
  `).all();

  assert.equal(counts.length, 10);
  assert.ok(counts.every((row) => row.count === 2));

  assert.throws(
    () => createBooking({
      name: "Capacity Parent 20",
      email: "capacity20@example.com",
      timezone: "Asia/Kolkata",
      startTime: "2099-07-20T21:00:00"
    }),
    (error) => error.statusCode === 409
  );
});
