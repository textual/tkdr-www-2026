"use client";

import { useState } from "react";
import { useAppInfoContext } from "@/lib/contexts/AppInfoContext";
// import { useLocation } from "@/lib/contexts/LocationContext";
import {
  useEvents,
  DEFAULT_RADIUS,
  MIN_RADIUS,
  MAX_RADIUS,
} from "@/lib/queries/useEvents";

const RADIUS_OPTIONS = [50, 100, 250, 500, 1000];

const EventsList = () => {
  const { isLoading: appInfoLoading, isRetrying } = useAppInfoContext();
  // const { location } = useLocation();

  const [radius, setRadius] = useState(DEFAULT_RADIUS);
  const { data, isLoading, isFetching, error } = useEvents(radius);

  if (appInfoLoading) {
    return (
      <p>{isRetrying ? "Server is waking up…" : "Getting your location…"}</p>
    );
  }

  if (isLoading) {
    return <div>Loading events...</div>;
  }

  // /events/nearby now returns a flat array (data: [...], meta: { total, ... })
  // with the shared Event shape (event_format/start_date/organizer/facility refs) —
  // `data` here IS the array, not a { events, totalResults } envelope.
  const events = data;
  return (
    <div>
      <div>EventsList </div>
      {events?.map((event) => {
        return (
          <div
            key={event.id}
            className="border border-gray-300 p-4 rounded-md m-2 mb-4 flex gap-4"
          >
            <div>
              <h3 className="text-lg font-semibold">{event.event_format}</h3>
              <p>Date: {new Date(event.start_date).toLocaleDateString()}</p>
              <p className="flex items-center gap-2">
                Organizer:
                {event.organizer?.logo_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={event.organizer.logo_url}
                    alt={event.organizer.name}
                    className="w-5 h-5 object-contain"
                  />
                )}
                {event.organizer?.name}
              </p>
              <p className="flex items-center gap-2">
                Location:
                {event.facility?.logo_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={event.facility.logo_url}
                    alt={event.facility.name}
                    className="w-5 h-5 object-contain"
                  />
                )}
                {event.facility?.name}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default EventsList;
