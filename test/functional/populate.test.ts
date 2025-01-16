import { assert, assertEquals } from "jsr:@std/assert";
import { populateDatabaseFromPaths } from "../../src/populate.ts";
import {
  createDbInsertRegistryDataFn,
  TimeSeriesDb,
} from "../../src/timeSeriesDb.ts";
import {
  EventType,
  PersonEvent,
  SkillEvent,
  TeamEvent,
} from "../../src/types.ts";

const LOG_EVENTS_DB = false;

function assertHasKeys(obj: unknown, keys: string[]) {
  assert(obj && typeof obj === "object", "Expected an object");
  keys.forEach((key) => {
    assert(
      Object.hasOwn(obj, key),
      `Expected object to have key "${key}"`,
    );
  });
}

Deno.test("populateDatabaseFromPaths ok", async () => {
  const db = new TimeSeriesDb();
  const dbInsertFn = createDbInsertRegistryDataFn(db);

  const relativePath = "./test/functional/data-points";
  let dataPointsPath: string;
  try {
    dataPointsPath = Deno.realPathSync(relativePath);
  } catch (_error) {
    throw new Error(`Path does not exist: ${relativePath}`);
  }

  const paths = [
    `${dataPointsPath}/skills`,
    `${dataPointsPath}/teams`,
    `${dataPointsPath}/people`,
  ];
  await populateDatabaseFromPaths(dbInsertFn, paths);

  const skillsDb = db.getEventsDb(EventType.Skill);
  LOG_EVENTS_DB && console.log(skillsDb);
  assertEquals(skillsDb.size, 2);
  assert(skillsDb.has("Pachinko"));
  assert(skillsDb.has("Pokémon"));
  const skill1 = skillsDb.get("Pachinko") as SkillEvent;
  assertEquals(skill1.type, EventType.Skill);
  assertEquals(skill1.tag, "Pachinko");
  assertEquals(skill1.description, "Pachinko master");
  const requiredKeys = ["type", "tag", "description", "reference"];
  assert(requiredKeys.every((key) => Object.hasOwn(skill1, key)));
  assertHasKeys(skill1, ["type", "tag", "description", "reference"]);

  const teamsDb = db.getEventsDb(EventType.Team);
  LOG_EVENTS_DB && console.log(teamsDb);
  assertEquals(teamsDb.size, 1);
  assert(teamsDb.has("Team Rocket"));
  const team1 = teamsDb.get("Team Rocket") as TeamEvent;
  assertEquals(team1.type, EventType.Team);
  assertEquals(team1.tag, "Team Rocket");
  assertHasKeys(team1, ["type", "tag", "name", "lead", "services"]);

  const peopleDb = db.getEventsDb(EventType.Person);
  LOG_EVENTS_DB && console.log(peopleDb);
  assertEquals(peopleDb.size, 1);
  assert(peopleDb.has("keyser.söze"));
  const person1 = peopleDb.get("keyser.söze") as PersonEvent;
  assertEquals(person1.type, EventType.Person);
  assertEquals(person1.tag, "keyser.söze");
  assertHasKeys(person1, ["type", "tag", "name", "skills"]);
});
