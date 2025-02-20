import { assertEquals, assertInstanceOf } from "jsr:@std/assert";
import {
  createDbInsertRegistryDataFn,
  TimeSeriesDb,
} from "../../src/timeSeriesDb.ts";
import { EventType } from "../../src/types.ts";
import { LibDate } from "../../src/libDate.ts";

Deno.test("TimeSeriesDb initialisation ok", () => {
  const db = new TimeSeriesDb();
  assertInstanceOf(db, TimeSeriesDb);
});

Deno.test("insert 1 event ok", () => {
  const timeSeriesDb = new TimeSeriesDb();
  const date = new LibDate();
  timeSeriesDb.insert(date, {
    type: EventType.Skill,
    data: {
      tag: "Wizard Lvl 9",
      type: EventType.Skill,
      description: "A powerful wizard",
      reference: "Gandalf",
    },
  });

  assertEquals(timeSeriesDb.size(), 1);
});

Deno.test("insert 2 events 1 date ok", async (t) => {
  const timeSeriesDb = new TimeSeriesDb();
  const date = new LibDate();
  await t.step("insert first", () => {
    timeSeriesDb.insert(date, {
      type: EventType.Skill,
      data: {
        tag: "Wizard Lvl 9",
        type: EventType.Skill,
        description: "A powerful wizard",
        reference: "Gandalf",
      },
    });
    assertEquals(timeSeriesDb.size(), 1);
  });

  await t.step("insert second", () => {
    timeSeriesDb.insert(date, {
      type: EventType.Skill,
      data: {
        tag: "Poet Lvl 6",
        type: EventType.Skill,
        description: "A famous poet",
        reference: "Homer",
      },
    });

    assertEquals(timeSeriesDb.size(), 2);
  });
});

Deno.test("insert 3 events 2 dates ok", async (t) => {
  const timeSeriesDb = new TimeSeriesDb();
  const date1 = new LibDate();
  const date2 = new LibDate("2021-01-01");

  await t.step("insert first event on date1", () => {
    timeSeriesDb.insert(date1, {
      type: EventType.Skill,
      data: {
        tag: "Wizard Lvl 9",
        type: EventType.Skill,
        description: "A powerful wizard",
        reference: "Gandalf",
      },
    });
    assertEquals(timeSeriesDb.size(), 1);
  });

  await t.step("insert second event on date1", () => {
    timeSeriesDb.insert(date1, {
      type: EventType.Skill,
      data: {
        tag: "Poet Lvl 6",
        type: EventType.Skill,
        description: "A famous poet",
        reference: "Homer",
      },
    });
    assertEquals(timeSeriesDb.size(), 2);
  });

  await t.step("insert third event on date2", () => {
    timeSeriesDb.insert(date2, {
      type: EventType.Skill,
      data: {
        tag: "Pilot Lvl 2",
        type: EventType.Skill,
        description: "A skilled pilot",
        reference: "Amelia",
      },
    });
    assertEquals(timeSeriesDb.size(), 3);
  });
});

const populateDb = (timeSeriesDb: TimeSeriesDb) => {
  const date1 = new LibDate();
  const date2 = new LibDate("2021-01-01");
  timeSeriesDb.insert(date1, {
    type: EventType.Skill,
    data: {
      tag: "Wizard Lvl 9",
      type: EventType.Skill,
      description: "A powerful wizard",
      reference: "Gandalf",
    },
  });
  timeSeriesDb.insert(date1, {
    type: EventType.Skill,
    data: {
      tag: "Poet Lvl 6",
      type: EventType.Skill,
      description: "A famous poet",
      reference: "Homer",
    },
  });
  timeSeriesDb.insert(date2, {
    type: EventType.Skill,
    data: {
      tag: "Pilot Lvl 2",
      type: EventType.Skill,
      description: "A skilled pilot",
      reference: "Amelia",
    },
  });

  timeSeriesDb.insert(date1, {
    type: EventType.Person,
    data: {
      tag: "Haryward Belinquins",
      type: EventType.Person,
      name: "Haryward",
      skills: [["Magic", 9]],
    },
  });
  timeSeriesDb.insert(date2, {
    type: EventType.Person,
    data: {
      tag: "Kalvernard Tombolomblin",
      type: EventType.Person,
      name: "Kalvernard",
      skills: [["Poetry", 6]],
    },
  });
};

Deno.test("getEventsDb ok", () => {
  const timeSeriesDb = new TimeSeriesDb();
  populateDb(timeSeriesDb);

  const skillsEventsDb = timeSeriesDb.getEventsDb(EventType.Skill);
  assertEquals(skillsEventsDb.size, 3);
  assertEquals(skillsEventsDb.get("Wizard Lvl 9")!.tag, "Wizard Lvl 9");
  assertEquals(skillsEventsDb.get("Poet Lvl 6")!.tag, "Poet Lvl 6");
  assertEquals(skillsEventsDb.get("Pilot Lvl 2")!.tag, "Pilot Lvl 2");

  const peopleEventsDb = timeSeriesDb.getEventsDb(EventType.Person);
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

Deno.test("getEntriesForEventType ok", () => {
  const timeSeriesDb = new TimeSeriesDb();
  populateDb(timeSeriesDb);

  const skills = timeSeriesDb.getEntriesForEventType(EventType.Skill);
  assertEquals(Object.keys(skills).length, 3);
  assertEquals(skills["Wizard Lvl 9"]!.tag, "Wizard Lvl 9");
  assertEquals(skills["Poet Lvl 6"]!.tag, "Poet Lvl 6");
  assertEquals(skills["Pilot Lvl 2"]!.tag, "Pilot Lvl 2");

  const people = timeSeriesDb.getEntriesForEventType(EventType.Person);
  assertEquals(Object.keys(people).length, 2);
  assertEquals(
    people["Haryward Belinquins"]!.tag,
    "Haryward Belinquins",
  );
  assertEquals(
    people["Kalvernard Tombolomblin"]!.tag,
    "Kalvernard Tombolomblin",
  );
});

Deno.test("createDbInsertRegistryDataFn creates insert function ok", () => {
  const db = new TimeSeriesDb();
  const dbInsertFn = createDbInsertRegistryDataFn(db);
  assertInstanceOf(dbInsertFn, Function);
  dbInsertFn(new LibDate(), EventType.Skill, {
    tag: "Wizard Lvl 9",
    type: EventType.Skill,
    description: "A powerful wizard",
    reference: "Gandalf",
  });
  assertEquals(db.size(), 1);
});
