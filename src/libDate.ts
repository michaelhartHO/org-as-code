// libDate.ts standardised date handling.
// LibDate produces a string based read-only date object that is
// ISO8601 compatible and comparison friendly as the time is always
// set to midnight.
// The DateParser class is used to handle the UK date parsing issues,
// when dates are ambiguous UK format is assumed.

import { DateParser } from "./dateParser.ts";

export class LibDate {
  private _date: string;  // ISO8601 date string yyyy-mm-dd

  // constructor accepts either a Date object or a string date in a format accepted by Date.parse
  constructor(date?: LibDate | Date | string) {
    if (date instanceof LibDate) {
      this._date = date._date;
    } else if (typeof date === "string") {
      const parsed = DateParser.parse(date);
      if (!parsed) {
        // failed to parse date, default to today
        console.error(`Failed to parse date: ${date}`);
        this._date = this._asISODateOnly(new Date());
      } else {
        this._date = this._asISODateOnly(new Date(parsed));
      }
    } else if (date instanceof Date) {
      this._date = this._asISODateOnly(date);
    } else {
      // No date given, default to today
      this._date = this._asISODateOnly(new Date());
    }
  }

  toISOString(): string {
    return this._date;
  }

  getUnixTime(): number {
    return new Date(this._date).getTime();
  }

  _asISODateOnly(date: Date): string {
    return date.toISOString().slice(0, 10);
  }

  // Returns -1 if a < b, 0 if a == b, 1 if a > b
  static compare(a: LibDate, b: LibDate): number {
    const timeA = a.getUnixTime();
    const timeB = b.getUnixTime();

    if (timeA < timeB) {
      return -1;
    } else if (timeA > timeB) {
      return 1;
    } else {
      return 0;
    }
  }
}
