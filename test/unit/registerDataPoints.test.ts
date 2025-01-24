import { assertSpyCallArgs, assertSpyCalls, spy } from "jsr:@std/testing/mock";
import { assertRejects } from "jsr:@std/assert";
import { registerDataPoints } from "../../src/registerDataPoints.ts";
import { registrarFactory } from "../../src/registrar.ts";
import { LibDate } from "../../src/libDate.ts";
import {
  DESCRIPTION_1,
  DESCRIPTION_2,
  ON_DATE_01_01_2025,
  ON_DATE_1_JAN_2021,
  REFERENCE_1,
  REFERENCE_2,
  TAG_1,
  TAG_2,
} from "./data-points/00/000-skills.ts";

const dataPointsPath = "./test/unit/data-points";

Deno.test("Deno.realPathSync throws on path not found", async () => {
  await assertRejects(
    async () => {
      await Deno.realPathSync("./non-existent-directory");
    },
    Error,
    "No such file or director",
  );
});


Deno.test("registerDataPoints inserts data-points ok", async () => {
  const dbInsertFn = spy();
  await registerDataPoints(
    registrarFactory(dbInsertFn),
    dataPointsPath + "/00",
  );
  assertSpyCalls(dbInsertFn, 2);
  assertSpyCallArgs(dbInsertFn, 0, [new LibDate(ON_DATE_1_JAN_2021), "skill", {
    tag: TAG_1,
    description: DESCRIPTION_1,
    reference: REFERENCE_1,
    type: "skill",
  }]);
  assertSpyCallArgs(dbInsertFn, 1, [new LibDate(ON_DATE_01_01_2025), "skill", {
    tag: TAG_2,
    description: DESCRIPTION_2,
    reference: REFERENCE_2,
    type: "skill",
  }]);
});

Deno.test("registerDataPoints throws when directory not found", async () => {
  const dbInsertFn = spy();
  await assertRejects(
    async () => {
      await registerDataPoints(
        registrarFactory(dbInsertFn),
        "./non-existent-directory",
      );
    },
    Error,
    "data-points directory not found: ./non-existent-directory",
  );
});
