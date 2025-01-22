// test with logging:
// $ VERBOSE=true deno test --allow-all test/integration/main.test.ts

import { assertEquals } from "jsr:@std/assert";
import { assertHasKeys } from "../helpers.ts";

const VERBOSE = Deno.env.get("VERBOSE") === "true";

Deno.test("Server serves data ok", async () => {
  const PORT = 51234;
  const process = new Deno.Command(Deno.execPath(), {
    args: ["run", "--allow-all", "main.ts"],
    env: { SERVER_PORT: PORT.toString() },
    stdout: "piped",
    stderr: "piped",
  }).spawn();

  // Give the server some time to start
  await new Promise((resolve) => setTimeout(resolve, 100));

  VERBOSE && console.log("process.pid", process.pid);

  assertEquals(true, true);
  try {
    let response = await fetch(`http://localhost:${PORT}/`);
    type ResponseData = {
      timestamp: string;
      data: string | Record<string, unknown>;
    };
    let json: ResponseData = await response.json();
    VERBOSE && console.log("response json:", json);
    assertEquals(json.data, "Welcome to org-as-code");

    response = await fetch(`http://localhost:${PORT}/skills`);
    json = await response.json();
    VERBOSE && console.log("response json:", json);
    assertEquals(Object.keys(json.data).length >= 4, true);

    response = await fetch(`http://localhost:${PORT}/people`);
    json = await response.json();
    VERBOSE && console.log("response json:", json);
    assertEquals(Object.keys(json.data).length >= 1, true);
    const person = Object.values(json.data)[0]!;
    VERBOSE && console.log(person);
    assertEquals(Object.keys(person).length, 5);
    assertHasKeys(person, ["tag", "name", "skills", "type"]);
  } finally {
    process.stdout.cancel();
    process.stderr.cancel();
    process.kill();
    // Give server time to stop
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
});
