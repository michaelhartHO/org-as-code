import { assertEquals, assertInstanceOf } from "jsr:@std/assert";
import { LibDate } from "../src/libDate.ts";

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
