"use client";

import React from "react";
import { useTracks } from "@/lib/queries/useTracks";

const TracksListing = () => {
  const { data, isLoading, error } = useTracks();

  if (isLoading) {
    return <div>Loading tracks...</div>;
  }
  const { data: tracks, total } = data;
  return (
    <div>
      <div>TracksListing - {total}</div>
      {/* <pre>{JSON.stringify(tracks, null, 2)}</pre> */}
      {tracks?.map((track) => (
        <div key={track.id}>{track.name}</div>
      ))}
    </div>
  );
};

export default TracksListing;
