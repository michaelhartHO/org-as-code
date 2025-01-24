import { assertEquals, assertObjectMatch, assertStringIncludes } from "jsr:@std/assert";
import { Route, ServerRouter } from "../../serverRouter.ts";
import { getRandomFreePort } from "../helpers.ts";


const PUBLIC_PATH = "./test/integration/public";

const createServer = (port: number, routes: Route[]) => {
  const controller = new AbortController();
  const { signal } = controller;
  const router = new ServerRouter(routes, PUBLIC_PATH);
  const server = Deno.serve(
    { port, signal },
    router.handle.bind(router),
  );
  return { server, controller };
};

Deno.test("ServerRouter GET / 200 ok", async (t) => {
  const port = await getRandomFreePort();
  const { server, controller } = createServer(port, [
    ["/", () => "Hello Deno!"],
  ]);

  await t.step("GET /", async () => {
    const response = await fetch(`http://localhost:${port}`);
    assertEquals(response.status, 200);
    assertEquals(response.headers.get("content-type"), "text/html");
    assertStringIncludes(await response.text(), "Hello Deno!");
  });

  // Shutdown the server
  controller.abort();
  await server.finished;
});

Deno.test("ServerRouter GET /api 200 ok", async (t) => {
  const port = await getRandomFreePort();
  const { server, controller } = createServer(port, [
    ["/api", () => JSON.stringify({ a: 1, b: 2 })],
  ]);

  await t.step("GET /api", async () => {
    const response = await fetch(`http://localhost:${port}/api`);
    assertEquals(response.status, 200);
    assertEquals(response.headers.get("content-type"), "application/json");
    const json = await response.json();
    console.log(json);
    assertObjectMatch(json, { a: 1, b: 2 });
  });

  controller.abort();
  await server.finished;
});

Deno.test("ServerRouter GET /public/test-file.css 200 ok", async (t) => {
  const port = await getRandomFreePort();
  const { server, controller } = createServer(port, [
    ["/public", undefined],
  ]);

  await t.step("GET /public/test-file.css", async () => {
    const response = await fetch(`http://localhost:${port}/public/test-file.css`);
    assertEquals(response.status, 200);
    assertEquals(response.headers.get("content-type"), "text/css");
    assertStringIncludes(await response.text(), "test-file.css");
  });

  controller.abort();
  await server.finished;
});



