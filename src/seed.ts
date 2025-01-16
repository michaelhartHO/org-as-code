// seed.ts seeds the database with the data points

import {
  createDbInsertRegistryDataFn,
  DbInsertRegistryDataFn,
  TimeSeriesDb,
} from "./timeSeriesDb.ts";
import { registrarFactory } from "./registrar.ts";
import { registerDataPoints } from "./registerDataPoints.ts";

export const db = new TimeSeriesDb();

export async function seedDatabase(db: TimeSeriesDb) {
  const dbInsertFn = createDbInsertRegistryDataFn(db);
  const registrar = registrarFactory(dbInsertFn);

  await registerDataPoints(registrar, "./sas-data/skills");
  await registerDataPoints(registrar, "./sas-data/teams");
  await registerDataPoints(registrar, "./sas-data/people");
}

export async function seedDatabaseFromPaths(
  dbInsertFn: DbInsertRegistryDataFn,
  paths: string[],
) {
  for (const path of paths) {
    await registerDataPoints(registrarFactory(dbInsertFn), path);
  }
}
