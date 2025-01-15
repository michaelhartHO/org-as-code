// integration-examples.test.ts examples of integration testing from https://medium.com/deno-the-complete-reference/testing-with-deno-part-5-integration-tests-efcac6570b0d
import { assert, assertExists } from "jsr:@std/assert";

Deno.test("GET deno.land", async () => {
  const res = await fetch("https://deno.land");
  const _resBody = await res.text();
  assert(res.ok === true, 'Response not ok');
  assert(res.status === 200, 'Status not 200');
  assert(res.redirected === true, 'Not Redirected, should be redirected to deno.com');
  assertExists(res.headers.get("content-type"));
});

Deno.test("GET deno.com", async () => {
  const res = await fetch("https://deno.com");
  const _resBody = await res.text();
  assert(res.ok === true, 'Response not ok');
  assert(res.status === 200, 'Status not 200');
  assert(res.redirected === false, 'Redirected, should not be redirected');
  assertExists(res.headers.get("content-type"));
});

Deno.test("POST deno.com", async () => {
  const res = await fetch("https://deno.com", {
    method: "POST",
  });
  const _resBody = await res.text();
  assert(res.ok === false, 'Response ok - should not be ok');
  assert(res.status === 405, 'Status not 405');
});
