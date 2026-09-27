import { Router } from "express";

import {
  getMentors,
  getAvailability,
  getParentBookedTimes,
  postBooking,
  getBooking,
  getBookings,
} from "../controllers/bookingController.js";

import { getMentorStats } from "../controllers/mentorController.js";

const router = Router();

/*
 * Mentor APIs
 */
router.get("/mentors", getMentors);

router.get("/mentors/stats", getMentorStats);

/*
 * Availability API
 */
router.get("/availability", getAvailability);

/*
 * Parent's already-booked times.
 *
 * This MUST come before /bookings/:id
 * so Express does not treat "parent"
 * as a booking ID.
 */
router.get(
  "/bookings/parent/times",
  getParentBookedTimes
);

/*
 * Booking APIs
 */
router.post("/bookings", postBooking);

router.get("/bookings/:id", getBooking);

router.get("/bookings", getBookings);

export default router;