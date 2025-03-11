import tableToJson from "./tableToJson";
import { v4 as uuidv4 } from "uuid";

export interface HistoricalEvent {
  id: string;
  time: string;
  location: string;
  description: string;
}

export function unwrap(historicalEvents: string | null): HistoricalEvent[] {
  if (!historicalEvents) return [];

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return JSON.parse(historicalEvents).map((e: any) => {
      if (!e.id) {
        return {
          ...e,
          id: uuidv4(),
        };
      }
      return e;
    });
  } catch {
    // Old HTML format
    const json = tableToJson(historicalEvents);

    if (!json) return [];

    return json?.map((event) => ({
      id: uuidv4(),
      location: event[0],
      time: event[1],
      description: event[2],
    }));
  }
}

export function wrap(historicalEvents: HistoricalEvent[]): string {
  return JSON.stringify(historicalEvents);
}

// export function equals(a?: HistoricalEvent[], b?: HistoricalEvent[]) {
//   // TODO
//   return false;
// }
