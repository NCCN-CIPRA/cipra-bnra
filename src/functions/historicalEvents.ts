import tableToJson from "./tableToJson";

export interface HistoricalEvent {
  time: string;
  location: string;
  description: string;
}

export function unwrap(historicalEvents: string | null): HistoricalEvent[] {
  if (!historicalEvents) return [];

  try {
    return JSON.parse(historicalEvents);
  } catch (e) {
    // Old HTML format
    const json = tableToJson(historicalEvents);

    if (!json) return [];

    return json?.map((event) => ({
      location: event[0],
      time: event[1],
      description: event[2],
    }));
  }
}

export function wrap(historicalEvents: HistoricalEvent[]): string {
  return JSON.stringify(historicalEvents);
}

export function equals(a?: HistoricalEvent[], b?: HistoricalEvent[]) {
  // TODO
  return false;
}
