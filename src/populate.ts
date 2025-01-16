// populate.ts populates the database with the data-points

import {
  DbInsertRegistryDataFn,
  TimeSeriesDb,
} from "./timeSeriesDb.ts";
import { registrarFactory } from "./registrar.ts";
import { registerDataPoints } from "./registerDataPoints.ts";

export const db = new TimeSeriesDb();

export async function populateDatabaseFromPaths(
  dbInsertFn: DbInsertRegistryDataFn,
  paths: string[],
) {
  for (const path of paths) {
    await registerDataPoints(registrarFactory(dbInsertFn), path);
  }
}
