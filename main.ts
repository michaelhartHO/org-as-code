Deno.env.set("TZ", "GMT");

import { populateDatabaseFromPaths } from "./src/populate.ts";
import {
  createDbInsertRegistryDataFn,
  TimeSeriesDb,
} from "./src/timeSeriesDb.ts";
import { Router } from "./router.ts";
import { EventType } from "./src/types.ts";
import {
  indexHandler,
  peopleHandler,
  skillsHandler,
  teamsHandler,
} from "./src/views/views.ts";

const dataPointsRelativePath = "./sas-data";
const PORT = parseInt(Deno.env.get("SERVER_PORT") || "8000", 10);
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
  ["/", indexHandler],
  [
    "/people",
    (request) =>
      peopleHandler(request, TimeSeriesDb.getEntriesFromEventsDb(peopleDb)),
  ],
  [
    "/skills",
    (request) =>
      skillsHandler(request, TimeSeriesDb.getEntriesFromEventsDb(skillsDb)),
  ],
  [
    "/teams",
    (request) =>
      teamsHandler(request, TimeSeriesDb.getEntriesFromEventsDb(teamsDb)),
  ],
  ["/api/skills", () => TimeSeriesDb.getEntriesFromEventsDb(skillsDb)],
  ["/api/teams", () => TimeSeriesDb.getEntriesFromEventsDb(teamsDb)],
  ["/api/people", () => TimeSeriesDb.getEntriesFromEventsDb(peopleDb)],
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
