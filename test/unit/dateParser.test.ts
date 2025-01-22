import { assertEquals } from "jsr:@std/assert";
import { DateParser } from "../../src/dateParser.ts";

const VERBOSE = Deno.env.get("VERBOSE") === "true";

Deno.test("DateParser parses dates ok", () => {
  // Example usage:
  const testDates = [
    { uk: "25/12/2024", iso: "2024-12-25" }, // UK format with slashes
    { uk: "2024-12-25", iso: "2024-12-25" }, // ISO8601
    { uk: "25-Dec-2024", iso: "2024-12-25" }, // UK format with month abbreviation
    { uk: "25 Dec 2024", iso: "2024-12-25" }, // Space-separated with month abbreviation

    { uk: "25 Dec 2024", iso: "2024-12-25" }, // Natural language
    { uk: "25/12/24", iso: "2024-12-25" }, // Short year
    { uk: "1-Jan-2024", iso: "2024-01-01" }, // Single-digit day
    { uk: "25 December 2024", iso: "2024-12-25" }, // Full month name
    { uk: "25-December-2024", iso: "2024-12-25" }, // Full month name with hyphens, very unusual
  ];

  testDates.forEach((date) => {
    const parsed = DateParser.parse(date.uk);
    VERBOSE && console.log(`${date.uk} -> ${parsed}`);
    assertEquals(parsed, date.iso);
  });
});
