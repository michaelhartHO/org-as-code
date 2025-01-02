// libDate.ts standardised date handling

export class LibDate {
  private _date: Date;

  // constructor accepts either a Date object or a string date in a format accepted by Date.parse
  constructor(date?: Date | string) {
    if (typeof date === "string") {
      this._date = LibDate.startOfDay(new Date(date));
    } else if (date instanceof Date) {
      this._date = LibDate.startOfDay(date);
    } else {
      this._date = LibDate.startOfDay(new Date());
    }
  }

  static startOfDay(date: Date): Date {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    return startOfDay;
  }

  public toISOString(): string {
    return this._date.toISOString();
  }

  public getUnixTime(): number {
    return this._date.getTime();
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
