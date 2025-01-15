import { assertSpyCallArgs, assertSpyCalls, spy } from "jsr:@std/testing/mock";
import { Registrar } from "../../src/registrar.ts";
import { registerDataPoints } from "../../src/registerDataPoints.ts";
import { LibDate } from "../../src/libDate.ts";
import * as johnSmith from "./data-points/01/001-john.smith.ts";
import * as teams from "./data-points/02/000-teams.ts";

const dataPointsPath = "./test/unit/data-points";

Deno.test("data-points Person 001-john.smith", async () => {
  const dbInsertFn = spy();
  const registrarFactory = () => new Registrar(dbInsertFn);
  await registerDataPoints(registrarFactory, dataPointsPath + "/01");
  assertSpyCalls(dbInsertFn, 1);
  assertSpyCallArgs(dbInsertFn, 0, [
    new LibDate(johnSmith.ON_DATE_12_11_2021),
    "person",
    {
      tag: "john.smith",
      name: "John Smith",
      skills: [["java11", 5]],
    },
  ]);
});


Deno.test("data-points Teams 000-teams", async () => {
  const dbInsertFn = spy();
  const registrarFactory = () => new Registrar(dbInsertFn);
  await registerDataPoints(registrarFactory, dataPointsPath + "/02");
  assertSpyCalls(dbInsertFn, 1);
  assertSpyCallArgs(dbInsertFn, 0, [
    new LibDate(teams.ON_DATE_01_01_2021),
    "team",
    {
      tag: "team",
      name: "Team",
      lead: "Lead",
      services: ["Service"],
    },
  ]);
});
