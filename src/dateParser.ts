// dateParser.ts provides a UK centric date parser that can handle a variety of
// date formats based around `dd/MM/yyyy` that built-in `Date.parse` cannot handle.
import { DateTime } from "npm:luxon";

export class DateParser {
  /**
   * Attempts to parse a date string into an ISO8601 format, assuming UK date format preference
   * @param dateStr The date string to parse
   * @returns ISO8601 formatted date-only string (yyyy-mm-dd) or null if parsing fails
   */
  static parse(dateStr: string): string | null {
    // First try parsing as ISO8601 - if it works, return date part as-is
    if (DateParser.isISO8601(dateStr)) {
      return dateStr.slice(0, 10);
    }

    // Try parsing with Luxon using UK format
    try {
      const parsed = DateTime.fromFormat(dateStr, "dd/MM/yyyy");
      if (parsed.isValid) {
        return parsed.toISODate();
      }
    } catch (_e) {
      // Continue to other parsing attempts if Luxon fails
    }

    // Handle all common UK date formats
    // Format tokens explained:
    // d    - day of month (1-31)
    // dd   - day of month with leading zero (01-31)
    // M    - month as number (1-12)
    // MM   - month as number with leading zero (01-12)
    // MMM  - month as three letter abbreviation (Jan-Dec)
    // MMMM - month as full name (January-December)
    // yy   - two digit year
    // yyyy - four digit year
    const formats = [
      "d/M/yyyy", // 1/2/2024
      "dd/MM/yy", // 01/02/24
      "d-M-yyyy", // 1-2-2024
      "dd-MM-yyyy", // 01-02-2024
      "d MMM yyyy", // 1 Jan 2024
      "dd MMM yyyy", // 01 Jan 2024
      "d-MMM-yyyy", // 1-Jan-2024
      "dd-MMM-yyyy", // 01-Jan-2024
      "d MMMM yyyy", // 1 January 2024
      "dd MMMM yyyy", // 01 January 2024
      "dd-MMMM-yyyy", // 25-December-2024
    ];

    for (const format of formats) {
      try {
        const parsed = DateTime.fromFormat(dateStr, format);
        if (parsed.isValid) {
          return parsed.toISODate();
        }
      } catch (_e) {
        continue;
      }
    }

    // If we reached here, try with natural language parsing
    try {
      const parsed = DateTime.fromSQL(dateStr);
      if (parsed.isValid) {
        return parsed.toISODate();
      }
    } catch (_e) {
      // Failed to parse
    }

    // fall back to trying the built-in Date.parse
    const parsed = Date.parse(dateStr);
    if (!isNaN(parsed)) {
      return new Date(parsed).toISOString().slice(0, 10);
    }

    return null;
  }

  /**
   * Checks if a string is already in ISO8601 format
   */
  private static isISO8601(str: string): boolean {
    const iso8601Regex =
      /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[-+]\d{2}:?\d{2})?)?$/;
    return iso8601Regex.test(str);
  }

  /**
   * Validates that a parsed date makes sense (e.g., not 31/02/2024)
   */
  static isValidDate(dateStr: string): boolean {
    const parsed = DateTime.fromISO(dateStr);
    return parsed.isValid;
  }
}
