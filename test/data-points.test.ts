import { assertSpyCallArgs, assertSpyCalls, spy } from "jsr:@std/testing/mock";
import { Registrar } from "../src/registrar.ts";
import { registerDataPoints } from "../src/registerDataPoints.ts";
import { LibDate } from "../src/libDate.ts";
import * as johnSmith from "./data-points/01/001-john.smith.ts";

const dataPointsPath = "./test/data-points";

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
