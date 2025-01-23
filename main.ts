Deno.env.set("TZ", "GMT");

import { populateDatabaseFromPaths } from "./src/populate.ts";
import {
  createDbInsertRegistryDataFn,
  TimeSeriesDb,
} from "./src/timeSeriesDb.ts";
import { Router } from "./router.ts";
import { EventType } from "./src/types.ts";

const dataPointsRelativePath = "./sas-data";
const PORT = parseInt(Deno.env.get('SERVER_PORT') || '8000', 10);
const LOG_EVENTS_DB = Deno.env.get("LOG_EVENTS_DB") === "true";

const db = new TimeSeriesDb();
const dbInsertFn = createDbInsertRegistryDataFn(db);

let dataPointsPath: string;
try {
  dataPointsPath = Deno.realPathSync(dataPointsRelativePath);
} catch (_error) {
  throw new Error(`Path does not exist: ${dataPointsRelativePath}`);
}

const paths = [
  `${dataPointsPath}/skills`,
  `${dataPointsPath}/teams`,
  `${dataPointsPath}/people`,
];
await populateDatabaseFromPaths(dbInsertFn, paths);

const skillsDb = db.getEventsDb(EventType.Skill);
LOG_EVENTS_DB && console.log(skillsDb);
const teamsDb = db.getEventsDb(EventType.Team);
LOG_EVENTS_DB && console.log(teamsDb);
const peopleDb = db.getEventsDb(EventType.Person);
LOG_EVENTS_DB && console.log(peopleDb);

const router = new Router([
  ["/", () => "Welcome to org-as-code"],
  ["/skills", () => TimeSeriesDb.getEntriesFromEventsDb(skillsDb)],
  ["/teams", () => TimeSeriesDb.getEntriesFromEventsDb(teamsDb)],
  ["/people", () => TimeSeriesDb.getEntriesFromEventsDb(peopleDb)],
]);

Deno.serve(
  {
    port: PORT,
    onListen({ port, hostname }) {
      console.log(`Server started at http://${hostname}:${port}`);
    },
  },
  router.router.bind(router),
);
