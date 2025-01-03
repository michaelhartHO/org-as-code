import { assertSpyCallArgs, assertSpyCalls, spy } from "jsr:@std/testing/mock";
import { registerDataPoints } from "../src/registerDataPoints.ts";
import { Registrar } from "../src/registrar.ts";
import { LibDate } from "../src/libDate.ts";
import {
  DESCRIPTION_1,
  DESCRIPTION_2,
  ON_DATE_01_01_2025,
  ON_DATE_1_JAN_2021,
  TAG_1,
  TAG_2,
} from "./data-points/00/000-skills.ts";

const dataPointsPath = "./test/data-points";

Deno.test("registerDataPoints ok", async () => {
  const dbInsertFn = spy();
  const registrarFactory = () => new Registrar(dbInsertFn);
  await registerDataPoints(registrarFactory, dataPointsPath + "/00");
  assertSpyCalls(dbInsertFn, 2);
  assertSpyCallArgs(dbInsertFn, 0, [new LibDate(ON_DATE_1_JAN_2021), "skill", {
    tag: TAG_1,
    description: DESCRIPTION_1,
  }]);
  assertSpyCallArgs(dbInsertFn, 1, [new LibDate(ON_DATE_01_01_2025), "skill", {
    tag: TAG_2,
    description: DESCRIPTION_2,
  }]);
});
