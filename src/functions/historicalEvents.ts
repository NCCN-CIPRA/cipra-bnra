import { v4 as uuidv4 } from "uuid";

export interface HistoricalEvent {
  id: string;
  time: string;
  location: string;
  description: string;
}

export function unwrap(historicalEvents: string | null): HistoricalEvent[] {
  if (!historicalEvents) return [];

  return JSON.parse(historicalEvents).map((e: HistoricalEvent) => {
    if (!e.id) {
      return {
        ...e,
        id: uuidv4(),
      };
    }
    return e;
  });
}

export function wrap(historicalEvents: HistoricalEvent[]): string {
  return JSON.stringify(historicalEvents);
}
