// seed.ts seeds the database with the data points

import {
  DbInsertRegistryDataFn,
  TimeSeriesDb,
} from "./timeSeriesDb.ts";
import { registrarFactory } from "./registrar.ts";
import { registerDataPoints } from "./registerDataPoints.ts";

export const db = new TimeSeriesDb();

export async function seedDatabaseFromPaths(
  dbInsertFn: DbInsertRegistryDataFn,
  paths: string[],
) {
  for (const path of paths) {
    await registerDataPoints(registrarFactory(dbInsertFn), path);
  }
}
