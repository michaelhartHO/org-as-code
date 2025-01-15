import { assert, assertEquals } from "jsr:@std/assert";
import { seedDatabaseFromPaths } from "../../src/seed.ts";
import { createDbInsertFn, TimeSeriesDb } from "../../src/timeSeriesDb.ts";
import { Events } from "../../src/types.ts";

Deno.test("assert works correctly", () => {
  assert(true);
  assertEquals(1, 1);
});

Deno.test("seedDatabaseFromPaths ok", async () => {
  const db = new TimeSeriesDb();
  const dbInsertFn = createDbInsertFn(db);

  const paths = ["./sas-data/skills", "./sas-data/teams", "./sas-data/people"];
  await seedDatabaseFromPaths(dbInsertFn, paths);

  console.log(db.getEventsDb(Events.Skill));

  const skills = db.getEventsDb(Events.Skill);
  assertEquals(skills.size, 2);
  assert(skills.has("java11"));
  assert(skills.has("TypeScript 5"));
  // assert skill "java11" has correct data containing "description" and "reference"
  assertEquals(skills.get("java11")!.tag, "java11");
  // assertEquals(skills.get("java11")!.description, "Java v11 development");
  // assertEquals(skills.get("java11")!.reference, "https://openjdk.java.net/projects/jdk/11/");

  console.log(db.getEventsDb(Events.Team));
  console.log(db.getEventsDb(Events.Person));
});
