// Example of snapshot testing
// Update snapshots with:
//   $ deno test test/functional/snapshot.test.ts --allow-all -- --update
import { assertSnapshot } from "jsr:@std/testing/snapshot";

import { populateDatabaseFromPaths } from "../../src/populate.ts";
import {
  createDbInsertRegistryDataFn,
  TimeSeriesDb,
} from "../../src/timeSeriesDb.ts";
import { EventType } from "../../src/types.ts";

Deno.test("populateDatabaseFromPaths ok", async (t): Promise<void> => {
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
  await assertSnapshot(t, skillsDb);

  const teamsDb = db.getEventsDb(EventType.Team);
  await assertSnapshot(t, teamsDb);

  const peopleDb = db.getEventsDb(EventType.Person);
  await assertSnapshot(t, peopleDb);
});
