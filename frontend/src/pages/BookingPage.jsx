import { useState } from "react";
import BookingForm from "../components/BookingForm.jsx";
import BookingConfirmation from "../components/BookingConfirmation.jsx";

export default function BookingPage() {
  const [booking, setBooking] = useState(null);

  if (booking) {
    return (
      <BookingConfirmation
        booking={booking}
        onBookAnother={() => setBooking(null)}
      />
    );
  }

  return (
    <section>
      <div className="page-heading">
        <span className="eyebrow">FREE TRIAL CLASS</span>
        <h1>Find a time that works for you.</h1>
        <p>
          Choose your local time. We will automatically find an available
          mentor and show both sides of the appointment in their own timezones.
        </p>
      </div>

      <BookingForm onBooked={setBooking} />
    </section>
  );
}
