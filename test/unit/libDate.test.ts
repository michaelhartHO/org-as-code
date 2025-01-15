import { assertEquals, assertInstanceOf } from "jsr:@std/assert";
import { LibDate } from "../../src/libDate.ts";

Deno.test("LibDate initialisation ok", () => {
  const libDate = new LibDate();
  assertInstanceOf(libDate, LibDate);
});

Deno.test("LibDate initialisation discards time", () => {
  const date = new Date("2021-01-01T12:34:56.789Z");
  const libDate = new LibDate(date);
  assertEquals(libDate.toISOString(), "2021-01-01T00:00:00.000Z");
});

Deno.test("LibDate startOfDay ok", () => {
  const date = new Date("2021-01-01T12:34:56.789Z");
  const startOfDay = LibDate.startOfDay(date);
  assertEquals(startOfDay.toISOString(), "2021-01-01T00:00:00.000Z");
});

Deno.test("LibDate initialisation with no arguments", () => {
  const libDate = new LibDate();
  const now = new Date();
  assertEquals(libDate.toISOString(), new LibDate(now).toISOString());
});

Deno.test("LibDate initialisation with string date", () => {
  const dateStr = "2021-01-01";
  const libDate = new LibDate(dateStr);
  assertEquals(libDate.toISOString(), "2021-01-01T00:00:00.000Z");
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

