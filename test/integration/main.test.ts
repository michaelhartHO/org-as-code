// run test with logging:
// $ VERBOSE=true deno test --allow-all test/integration/main.test.ts

import { assertEquals, assertStringIncludes } from "jsr:@std/assert";
import { assertHasKeys, getRandomFreePort } from "../helpers.ts";

const VERBOSE = Deno.env.get("VERBOSE") === "true";

Deno.test("Server serves data ok", async (t) => {
  // Execute the app that runs the server
  const PORT = await getRandomFreePort();
  const process = new Deno.Command(Deno.execPath(), {
    args: ["run", "--allow-all", "main.ts"],
    env: { SERVER_PORT: PORT.toString() },
    stdout: "piped",
    stderr: "piped",
  }).spawn();

  // Give the server some time to start
  await new Promise((resolve) => setTimeout(resolve, 100));

  VERBOSE && console.log("process.pid", process.pid);

  try {
    await t.step(
      `Fetch the index page ok`,
      async () => {
        const response = await fetch(`http://localhost:${PORT}/`);
        assertEquals(response.status, 200);
        const body = await response.text();
        assertStringIncludes(body, "<!DOCTYPE html>");
        assertStringIncludes(body, "Org As Code");
      },
    );

    await t.step(
      `Fetch the api/skills json ok`,
      async () => {
        const response = await fetch(`http://localhost:${PORT}/api/skills`);
        const json = await response.json();
        VERBOSE && console.log("response json:", json);
        assertEquals(Object.keys(json.data).length >= 4, true);
      },
    );

    await t.step(
      `Fetch the api/people json ok`,
      async () => {
        const response = await fetch(`http://localhost:${PORT}/api/people`);
        const json = await response.json();
        VERBOSE && console.log("response json:", json);
        assertEquals(Object.keys(json.data).length >= 1, true);
        const person = Object.values(json.data)[0]!;
        VERBOSE && console.log(person);
        assertEquals(Object.keys(person).length, 5);
        assertHasKeys(person, ["tag", "name", "skills", "type"]);
      },
    );
  } finally {
    process.stdout.cancel();
    process.stderr.cancel();
    process.kill();
    // Give server time to stop
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
});
