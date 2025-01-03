import { assertEquals, assertInstanceOf } from "jsr:@std/assert";
import {
  createDbInsertFn,
  DbInsertFn,
  TimeSeriesDb,
} from "../src/timeSeriesDb.ts";
import { Events } from "../src/types.ts";
import { LibDate } from "../src/libDate.ts";

Deno.test("TimeSeriesDb initialisation ok", () => {
  const db = new TimeSeriesDb();
  assertInstanceOf(db, TimeSeriesDb);
});

Deno.test("insert 1 event ok", () => {
  const timeSeriesDb = new TimeSeriesDb();
  const date = new LibDate();
  timeSeriesDb.insert(date, Events.Skill, { tag: "Wizard Lvl 9" });

  assertEquals(timeSeriesDb.size(), 1);
});

Deno.test("insert 2 events 1 date ok", () => {
  const timeSeriesDb = new TimeSeriesDb();
  const date = new LibDate();
  timeSeriesDb.insert(date, Events.Skill, { tag: "Wizard Lvl 9" });
  timeSeriesDb.insert(date, Events.Skill, { tag: "Poet Lvl 6" });

  assertEquals(timeSeriesDb.size(), 2);
});

Deno.test("insert 3 events 2 dates ok", () => {
  const timeSeriesDb = new TimeSeriesDb();
  const date1 = new LibDate();
  const date2 = new LibDate("2021-01-01");
  timeSeriesDb.insert(date1, Events.Skill, { tag: "Wizard Lvl 9" });
  timeSeriesDb.insert(date1, Events.Skill, { tag: "Poet Lvl 6" });
  timeSeriesDb.insert(date2, Events.Skill, { tag: "Pilot Lvl 2" });

  assertEquals(timeSeriesDb.size(), 3);
});

Deno.test("getEventsDb ok", () => {
  const timeSeriesDb = new TimeSeriesDb();
  const date1 = new LibDate();
  const date2 = new LibDate("2021-01-01");
  timeSeriesDb.insert(date1, Events.Skill, { tag: "Wizard Lvl 9" });
  timeSeriesDb.insert(date1, Events.Skill, { tag: "Poet Lvl 6" });
  timeSeriesDb.insert(date2, Events.Skill, { tag: "Pilot Lvl 2" });

  timeSeriesDb.insert(date1, Events.Person, { tag: "Haryward Belinquins" });
  timeSeriesDb.insert(date2, Events.Person, { tag: "Kalvernard Tombolomblin" });

  const skillsEventsDb = timeSeriesDb.getEventsDb(Events.Skill);
  assertEquals(skillsEventsDb.size, 3);
  assertEquals(skillsEventsDb.get("Wizard Lvl 9")!.tag, "Wizard Lvl 9");
  assertEquals(skillsEventsDb.get("Poet Lvl 6")!.tag, "Poet Lvl 6");
  assertEquals(skillsEventsDb.get("Pilot Lvl 2")!.tag, "Pilot Lvl 2");

  const peopleEventsDb = timeSeriesDb.getEventsDb(Events.Person);
  assertEquals(peopleEventsDb.size, 2);
  assertEquals(
    peopleEventsDb.get("Haryward Belinquins")!.tag,
    "Haryward Belinquins",
  );
  assertEquals(
    peopleEventsDb.get("Kalvernard Tombolomblin")!.tag,
    "Kalvernard Tombolomblin",
  );
});

Deno.test("createDbInsertFn creates DbInsertFn ok", () => {
  const db = new TimeSeriesDb();
  const dbInsertFn = createDbInsertFn(db);
  assertInstanceOf(dbInsertFn, Function);
  dbInsertFn(new LibDate(), Events.Skill, { tag: "Wizard Lvl 9" });
  assertEquals(db.size(), 1);
});
