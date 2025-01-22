// libDate.ts standardised date handling.
// LibDate produces a string based read-only date object that is
// ISO8601 compatible and comparison friendly as the time is always
// set to midnight.
// The DateParser class is used to handle the UK date parsing issues

import { DateParser } from "./dateParser.ts";

export class LibDate {
  private _date: string;

  // constructor accepts either a Date object or a string date in a format accepted by Date.parse
  constructor(date?: Date | string | LibDate) {
    if (date instanceof LibDate) {
      this._date = date._date;
    } else if (typeof date === "string") {
      const parsed = DateParser.parse(date) ||
        new Date().toISOString().slice(0, 10);
      this._date = LibDate.startOfDay(new Date(parsed)).toISOString();
    } else if (date instanceof Date) {
      this._date = LibDate.startOfDay(date).toISOString();
    } else {
      this._date = LibDate.startOfDay(new Date()).toISOString();
    }
  }

  static startOfDay(date: Date): Date {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    return startOfDay;
  }

  public toISOString(): string {
    return this._date;
  }

  public getUnixTime(): number {
    return new Date(this._date).getTime();
  }

  // Returns -1 if a < b, 0 if a == b, 1 if a > b
  public static compare(a: LibDate, b: LibDate): number {
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
