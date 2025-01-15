// timeSeriesDb.ts a simple Time Series Database implementation
import { EventType, EventsMap, RegistryData } from "./types.ts";
import { LibDate } from "./libDate.ts";
import * as log from "jsr:@std/log";

type TimeSeriesData = {
  type: EventType;
  data: RegistryData;
};

type TimeSeriesMap = Map<LibDate, TimeSeriesData[]>;

export class TimeSeriesDb {
  private _db: TimeSeriesMap;
  private _sorted: boolean = false;
  private _logger = log.getLogger();

  constructor() {
    this._db = new Map();
  }

  insert(date: LibDate, event: EventType, data: RegistryData) {
    if (!this._db.has(date)) {
      this._db.set(date, []);
    }
    this._db.get(date)!.push({ type: event, data: data });
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
    for (const events of this._db.values()) {
      for (const event of events) {
        if (event.type === type) {
          if (eventsDb.has(event.data.tag)) {
            this._logger.warn(
              `Duplicate event ${event.type} ${event.data.tag} found`,
            );
          }
          eventsDb.set(event.data.tag, event.data);
        }
      }
    }
    return eventsDb;
  }
}


export type DbInsertFn = (date: LibDate, event: EventType, data: RegistryData) => void;

export function createDbInsertFn(db: TimeSeriesDb): DbInsertFn {
  return (date: LibDate, event: EventType, data: RegistryData) => {
    db.insert(date, event, data);
  };
}
