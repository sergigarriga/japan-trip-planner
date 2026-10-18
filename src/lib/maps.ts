export function mapsSearch(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

/** Indicaciones en transporte público desde la ubicación actual. */
export function mapsDirections(place: string): string {
  const params = new URLSearchParams({ api: "1", destination: place, travelmode: "transit" });
  return `https://www.google.com/maps/dir/?${params.toString()}`;
}

export function mapsRoute(stops: string[]): string {
  if (stops.length === 1) return mapsSearch(stops[0]);
  const origin = stops[0];
  const destination = stops[stops.length - 1];
  const waypoints = stops.slice(1, -1).join("|");
  const params = new URLSearchParams({ api: "1", origin, destination, travelmode: "transit" });
  if (waypoints) params.set("waypoints", waypoints);
  return `https://www.google.com/maps/dir/?${params.toString()}`;
}
