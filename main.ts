Deno.env.set("TZ", "GMT");

import { populateDatabaseFromPaths } from "./src/populate.ts";
import {
  createDbInsertRegistryDataFn,
  RegEntries,
  TimeSeriesDb,
} from "./src/timeSeriesDb.ts";
import { ServerRouter } from "./serverRouter.ts";
import { EventType } from "./src/types.ts";
import {
  indexHandler,
  peopleHandler,
  skillsHandler,
  teamsHandler,
} from "./src/views/views.ts";

const PORT = parseInt(Deno.env.get("SERVER_PORT") || "8000", 10);
const LOG_EVENTS_DB = Deno.env.get("LOG_EVENTS_DB") === "true";

const db = new TimeSeriesDb();
const dbInsertFn = createDbInsertRegistryDataFn(db);
const relativePaths = [
  `./sas-data/skills`,
  `./sas-data/teams`,
  `./sas-data/people`,
];
await populateDatabaseFromPaths(dbInsertFn, relativePaths);

LOG_EVENTS_DB && console.log(db.getEventsDb(EventType.Skill));
LOG_EVENTS_DB && console.log(db.getEventsDb(EventType.Team));
LOG_EVENTS_DB && console.log(db.getEventsDb(EventType.Person));

function apiHandler(regEntries: RegEntries): string {
  return JSON.stringify(regEntries);
}

const router = new ServerRouter([
  ["/", indexHandler],
  [
    "/people",
    (request) =>
      peopleHandler(request, db.getEntriesForEventType(EventType.Person)),
  ],
  [
    "/skills",
    (request) =>
      skillsHandler(request, db.getEntriesForEventType(EventType.Skill)),
  ],
  [
    "/teams",
    (request) =>
      teamsHandler(request, db.getEntriesForEventType(EventType.Team)),
  ],
  ["/api/skills", () => apiHandler(db.getEntriesForEventType(EventType.Skill))],
  ["/api/teams", () => apiHandler(db.getEntriesForEventType(EventType.Team))],
  [
    "/api/people",
    () => apiHandler(db.getEntriesForEventType(EventType.Person)),
  ],
]);

Deno.serve(
  {
    port: PORT,
    onListen({ port, hostname }) {
      console.log(`Server started at http://${hostname}:${port}`);
    },
  },
  router.handle.bind(router),
);
