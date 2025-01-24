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

const router = new Router([
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
  ["/api/skills", () => db.getEntriesForEventType(EventType.Skill)],
  ["/api/teams", () => db.getEntriesForEventType(EventType.Team)],
  ["/api/people", () => db.getEntriesForEventType(EventType.Person)],
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
