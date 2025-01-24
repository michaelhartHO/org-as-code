// timeSeriesDb.ts a simple Time Series Database implementation
import { EventsMap, EventType, RegistryData } from "./types.ts";
import { LibDate } from "./libDate.ts";
import * as log from "jsr:@std/log";

type TimeSeriesData = {
  type: EventType;
  data: RegistryData;
};

type TimeSeriesMap = Map<LibDate, TimeSeriesData[]>;

export type RegEntries = Record<string, RegistryData>;

export class TimeSeriesDb {
  private _db: TimeSeriesMap;
  private _sorted: boolean = false;
  private _logger = log.getLogger();

  constructor() {
    this._db = new Map();
  }

  insert(date: LibDate, data: TimeSeriesData) {
    if (!this._db.has(date)) {
      this._db.set(date, []);
    }
    this._db.get(date)!.push(data);
    this._sorted = false;
  }

  sort() {
    const arr = Array.from(this._db);
    arr.sort((a, b) => LibDate.compare(a[0], b[0]));
    this._db = new Map(arr);
    this._sorted = true;
  }

  size() {
    return Array.from(this._db.values()).reduce(
      (acc, val) => acc + val.length,
      0,
    );
  }

  getEventsDb(type: EventType): EventsMap {
    if (!this._sorted) {
      this.sort();
    }
    const eventsDb: EventsMap = new Map();
    for (const [date, events] of this._db) {
      for (const event of events) {
        if (event.type === type) {
          if (eventsDb.has(event.data.tag)) {
            this._logger.warn(
              `Duplicate event ${event.type} ${event.data.tag} found`,
            );
          }
          event.data.date = date.toISOString();
          eventsDb.set(event.data.tag, event.data);
        }
      }
    }
    return eventsDb;
  }

  static getEntriesFromEventsDb(
    eventsMap: EventsMap,
  ): RegEntries {
    return Object.fromEntries(eventsMap);
  }

  getEntriesForEventType(eventType: EventType): RegEntries {
    return TimeSeriesDb.getEntriesFromEventsDb(this.getEventsDb(eventType));
  }
}

// The DbInsertFn is the interface used by db clients to insert Registry data into the db
export type DbInsertRegistryDataFn = (
  date: LibDate,
  event: EventType,
  data: RegistryData,
) => void;

export function createDbInsertRegistryDataFn(
  db: TimeSeriesDb,
): DbInsertRegistryDataFn {
  return (date: LibDate, type: EventType, data: RegistryData) => {
    db.insert(date, { type, data });
  };
}
