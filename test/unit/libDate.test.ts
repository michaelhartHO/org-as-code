import { assertEquals, assertInstanceOf } from "jsr:@std/assert";
import { LibDate } from "../../src/libDate.ts";

Deno.test("LibDate initialisation ok", () => {
  const libDate = new LibDate();
  assertInstanceOf(libDate, LibDate);
});

Deno.test("LibDate initialisation no arguments ok", () => {
  const libDate = new LibDate();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  assertEquals(today.toISOString(), libDate.toISOString());
});

Deno.test("LibDate initialisation with string date", () => {
  let libDate;
  libDate = new LibDate("2021-01-01");
  assertEquals(libDate.toISOString(), "2021-01-01T00:00:00.000Z");
  libDate = new LibDate("2021-01-01T12:34:56Z");
  assertEquals(libDate.toISOString(), "2021-01-01T00:00:00.000Z");
  libDate = new LibDate("2021-01-01T12:34:56+12:34");
  assertEquals(libDate.toISOString(), "2021-01-01T00:00:00.000Z");
  libDate = new LibDate("01/01/2021");
  assertEquals(libDate.toISOString(), "2021-01-01T00:00:00.000Z");
  libDate = new LibDate("1/1/2021");
  assertEquals(libDate.toISOString(), "2021-01-01T00:00:00.000Z");
  libDate = new LibDate("January 1, 2021");
  assertEquals(libDate.toISOString(), "2021-01-01T00:00:00.000Z");
  libDate = new LibDate("December 31, 1999");
  assertEquals(libDate.toISOString(), "1999-12-31T00:00:00.000Z");
  libDate = new LibDate("Jan 1, 2021");
  assertEquals(libDate.toISOString(), "2021-01-01T00:00:00.000Z");
  libDate = new LibDate("January 1, 2021 00:00:00");
  assertEquals(libDate.toISOString(), "2021-01-01T00:00:00.000Z");
  libDate = new LibDate("Jan 1, 2021 00:00:00");
  assertEquals(libDate.toISOString(), "2021-01-01T00:00:00.000Z");
  libDate = new LibDate(new Date(1609459200000));
  assertEquals(libDate.toISOString(), "2021-01-01T00:00:00.000Z");

  libDate = new LibDate("31-12-2001"); // UK format dd/mm/yyyy
  assertEquals(libDate.toISOString(), "2001-12-31T00:00:00.000Z");
  libDate = new LibDate("31/12/2002");
  assertEquals(libDate.toISOString(), "2002-12-31T00:00:00.000Z");
  libDate = new LibDate("12-31-2003"); // US format mm/dd/yyyy
  assertEquals(libDate.toISOString(), "2003-12-31T00:00:00.000Z");
  libDate = new LibDate("12/31/2004");
  assertEquals(libDate.toISOString(), "2004-12-31T00:00:00.000Z");
});

Deno.test("LibDate initialisation with Date object", () => {
  const date = new Date("2021-01-01T12:34:56.789Z");
  const libDate = new LibDate(date);
  assertEquals(libDate.toISOString(), "2021-01-01T00:00:00.000Z");
});

Deno.test("LibDate initialisation with LibDate object", () => {
  const originalLibDate = new LibDate("2021-01-01");
  const libDate = new LibDate(originalLibDate);
  assertEquals(libDate.toISOString(), "2021-01-01T00:00:00.000Z");
});
Deno.test("LibDate initialisation with ISO8601 ok", () => {
  const now = new Date();
  const libDate = new LibDate(now.toISOString());
  // Extract the date part (first 10 characters) from the ISO strings
  assertEquals(
    now.toISOString().slice(0, 10),
    libDate.toISOString().slice(0, 10),
  );
});

Deno.test("LibDate initialisation with ISO8601 discards time", () => {
  const date = new Date("2021-01-01T12:34:56.789Z");
  const libDate = new LibDate(date);
  assertEquals(
    libDate.toISOString(),
    "2021-01-01T00:00:00.000Z",
    libDate.toISOString(),
  );
});

Deno.test("LibDate startOfDay ok", () => {
  const date = new Date("2021-01-01T12:34:56.789Z");
  const startOfDay = LibDate.startOfDay(date);
  assertEquals(startOfDay.toISOString(), "2021-01-01T00:00:00.000Z");
});
