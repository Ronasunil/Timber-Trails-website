"use client";
import { useFormStatus } from "react-dom";
import Link from "next/link";

import { differenceInCalendarDays } from "date-fns";
import { useReservation } from "../_context/ReservationContext";
import { createBooking } from "../actions/action";

function ReservationForm({ cabin, user, profileImage }) {
  const { range, resetRange } = useReservation();
  console.log(profileImage, "imageeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
  const { maxCapacity, price, id: cabinId } = cabin;
  const { from: startDate, to: endDate } = range;
  const numOfStays = differenceInCalendarDays(endDate, startDate) + 1;

  const bookingDetails = {
    price,
    cabinId,
    startDate,
    endDate,
    numOfStays,
  };

  const createBookingWithData = createBooking.bind(null, bookingDetails);

  return (
    <div className="scale-[1.01]">
      <div className="bg-primary-800 text-primary-300 px-16 py-2 flex justify-between items-center">
        <p>Logged in as</p>

        {user && (
          <div className="flex gap-4 items-center">
            <img
              referrerPolicy="no-referrer"
              className="h-8 rounded-full"
              src={profileImage || user?.image}
              alt={user.name}
            />
            <p>{user.name}</p>
          </div>
        )}
      </div>

      {user && (
        <form
          action={(formData) => {
            createBookingWithData(formData);
            resetRange();
          }}
          className="bg-primary-900 py-10 px-16 text-lg flex gap-5 flex-col"
        >
          <div className="space-y-2">
            <label htmlFor="numGuests">How many guests?</label>
            <select
              name="numOfGuest"
              id="numGuest"
              className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
              required
            >
              <option value="" key="">
                Select number of guests...
              </option>
              {Array.from({ length: maxCapacity }, (_, i) => i + 1).map((x) => (
                <option value={x} key={x}>
                  {x} {x === 1 ? "guest" : "guests"}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="observations">
              Anything we should know about your stay?
            </label>
            <textarea
              name="observation"
              id="observations"
              className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
              placeholder="Any pets, allergies, special requirements, etc.?"
            />
          </div>
          {range.to && range.from && <Button />}
          <div className="flex justify-end items-center gap-6">
            <p className="text-primary-300 text-base">
              Start by selecting dates
            </p>
          </div>
        </form>
      )}

      {!user && (
        <div className="flex  justify-center items-center h-[50%]">
          <Link href="/login">
            <span>
              <span className="underline underline-offset-1 text-primary-200">
                Login
              </span>{" "}
              to reserve the cabin
            </span>
          </Link>
        </div>
      )}
    </div>
  );
}

export default ReservationForm;

function Button() {
  const { pending } = useFormStatus();
  return (
    <button
      disabled={pending}
      className="bg-accent-500 px-8 py-4 text-primary-800 font-semibold hover:bg-accent-600 transition-all disabled:cursor-not-allowed disabled:bg-gray-500 disabled:text-gray-300"
    >
      {pending ? "Creating..." : "Reserve now"}
    </button>
  );
}
