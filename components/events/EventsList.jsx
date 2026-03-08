"use client";

import { useState } from "react";
import { useAppInfoContext } from "@/lib/contexts/AppInfoContext";
import { useLocation } from "@/lib/contexts/LocationContext";
import {
  useEvents,
  DEFAULT_RADIUS,
  MIN_RADIUS,
  MAX_RADIUS,
} from "@/lib/queries/useEvents";

const RADIUS_OPTIONS = [50, 100, 250, 500, 1000];

const EventsList = () => {
  const { isLoading: appInfoLoading, isRetrying } = useAppInfoContext();
  const { location } = useLocation();

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

  const { events, totalResults } = data;
  return (
    <div>
      <div>EventsList </div>
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
      {events?.map((event) => {
        return (
          <div
            key={event.id}
            className="border border-gray-300 p-4 rounded-md m-2 mb-4"
          >
            <h3 className="text-lg font-semibold">{event.title}</h3>
            <p>Date:{new Date(event.date__c).toLocaleDateString()}</p>
            <p>Organizer: {event.organizer__common_name__c}</p>
            <p>Location: {event.facility__common_name__c}</p>
            <p>Distance: {event.distance_km} km</p>
          </div>
        );
      })}
    </div>
  );
};

export default EventsList;
