// seed.ts seeds the database with the data points

import { createDbInsertFn, TimeSeriesDb } from "./timeSeriesDb.ts";
import { Registrar } from "./registrar.ts";
import { registerDataPoints } from "./registerDataPoints.ts";

export const db = new TimeSeriesDb();

export async function seedDatabase(db: TimeSeriesDb) {
    const dbInsertFn = createDbInsertFn(db);
    const registrarFactory = () => new Registrar(dbInsertFn);

    await registerDataPoints(registrarFactory, "./sas-data/skills");
    await registerDataPoints(registrarFactory, "./sas-data/teams");
    await registerDataPoints(registrarFactory, "./sas-data/people");
}


export async function seedDatabaseFromPaths(dbInsertFn: ReturnType<typeof createDbInsertFn>, paths: string[]) {
    const registrarFactory = () => new Registrar(dbInsertFn);

    for (const path of paths) {
        await registerDataPoints(registrarFactory, path);
    }
}
