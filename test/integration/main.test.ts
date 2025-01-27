// run test with logging:
// $ VERBOSE=true deno test --allow-all test/integration/main.test.ts

import { assert, assertEquals, assertStringIncludes } from "jsr:@std/assert";
import { assertHasKeys, getRandomFreePort, pollPortInUse } from "../helpers.ts";

const VERBOSE = Deno.env.get("VERBOSE") === "true";
const SERVER_POLL = 100;
const SERVER_TIMEOUT = 1500;

Deno.test("Application serves data ok", async (t) => {
  // Execute the application as a child process to use as our SUT
  const PORT = await getRandomFreePort();
  const serverProcess = new Deno.Command(Deno.execPath(), {
    args: ["run", "--allow-all", "main.ts"],
    env: { SERVER_PORT: PORT.toString() },
    stdout: "piped",
    stderr: "piped",
  }).spawn();

  // Poll the server to ensure it is up and ready to be tested
  assert(
    await pollPortInUse(PORT, SERVER_POLL, SERVER_TIMEOUT),
    `Server did not start on port ${PORT} within ${SERVER_TIMEOUT}ms`,
  );

  VERBOSE && console.log("process.pid", serverProcess.pid);

  try {
    await t.step(
      `Fetch the index page ok`,
      async () => {
        const response = await fetch(`http://localhost:${PORT}/`);
        assertEquals(response.status, 200);
        assertEquals(response.headers.get("content-type"), "text/html");
        const body = await response.text();
        assertStringIncludes(body, "<!DOCTYPE html>");
        assertStringIncludes(body, "Org As Code");
      },
    );

    await t.step(
      `Fetch the api/skills json ok`,
      async () => {
        const response = await fetch(`http://localhost:${PORT}/api/skills`);
        assertEquals(response.status, 200);
        assertEquals(response.headers.get("content-type"), "application/json");
        const json = await response.json();
        VERBOSE && console.log("response json:", json);
        assertEquals(Object.keys(json).length >= 4, true);
      },
    );

    await t.step(
      `Fetch the api/people json ok`,
      async () => {
        const response = await fetch(`http://localhost:${PORT}/api/people`);
        assertEquals(response.status, 200);
        assertEquals(response.headers.get("content-type"), "application/json");
        const json = await response.json();
        VERBOSE && console.log("response json:", json);
        assertEquals(Object.keys(json).length >= 1, true);
        const person = Object.values(json)[0]!;
        VERBOSE && console.log(person);
        assertEquals(Object.keys(person).length, 5);
        assertHasKeys(person, ["tag", "name", "skills", "type"]);
      },
    );

    await t.step(
      `Fetch public/  ok`,
      async () => {
        const response = await fetch(
          `http://localhost:${PORT}/public/styles.css`,
        );
        assertEquals(response.status, 200);
        assertEquals(response.headers.get("content-type"), "text/css");
        assertStringIncludes(await response.text(), "styles.css");
      },
    );
  } finally {
    serverProcess.stdout.cancel();
    serverProcess.stderr.cancel();
    serverProcess.kill();
    // Give server time to stop
    await pollPortInUse(PORT, SERVER_POLL, SERVER_TIMEOUT, false);
  }
});
