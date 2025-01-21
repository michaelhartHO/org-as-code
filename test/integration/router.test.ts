import { assertEquals, assertStringIncludes } from "jsr:@std/assert";
import { Router } from "../../router.ts";
import { getRandomFreePort, getRandomString } from "../helpers.ts";

const PORT_LO = 50000;
const PORT_HI = 51000;

Deno.test("Server tear-down test", async (t) => {
  const createServer = (port: number, responseText: string) => {
    const controller = new AbortController();
    const { signal } = controller;
    const server = Deno.serve({ port, signal }, (_req) => {
      return new Response(responseText);
    });
    return { server, controller };
  };

  const port = await getRandomFreePort(PORT_LO, PORT_HI);

  await t.step(
    `First Server launch on ${port}, request and tear-down`,
    async () => {
      const { server, controller } = createServer(port, "Hello World");

      const response = await fetch(`http://localhost:${port}`);
      assertEquals(response.status, 200);
      assertEquals(await response.text(), "Hello World");

      // Shutdown the server
      controller.abort();
      await server.finished;
    },
  );

  // Short delay required to ensure the first server has shut down completely
  await new Promise((resolve) => setTimeout(resolve, 100));

  await t.step(
    `Second Server launch on ${port}, request and tear-down`,
    async () => {
      const { server, controller } = createServer(port, "Hello Again");

      const response = await fetch(`http://localhost:${port}`);
      assertEquals(response.status, 200);
      assertEquals(await response.text(), "Hello Again");

      // Shutdown the server
      controller.abort();
      await server.finished;
    },
  );
});

const createRouterServer = (port: number, router: Router) => {
  const controller = new AbortController();
  const { signal } = controller;
  const server = Deno.serve({ port, signal }, router.router.bind(router));
  return { server, controller };
};


Deno.test("Router GET two routes 200 ok", async (t) => {
  const rootMsg = `Hello Deno! ${getRandomString()}`;
  const deepMsg = `Deeper levels ${getRandomString()}`;

  const router = new Router([
    ["/", () => rootMsg],
    ["/deep/route", () => deepMsg],
  ]);

  const port = await getRandomFreePort(PORT_LO, PORT_HI);
  const { server, controller } = createRouterServer(port, router);

  await t.step("GET /", async () => {
    const response = await fetch(`http://localhost:${port}`);
    assertEquals(response.status, 200);
    assertStringIncludes(await response.text(), rootMsg);
  });

  await t.step("GET /deep/route", async () => {
    const response = await fetch(`http://localhost:${port}/deep/route`);
    assertEquals(response.status, 200);
    assertStringIncludes(await response.text(), deepMsg);
  });

  // Shutdown the server
  controller.abort();
  await server.finished;
});

Deno.test("Router GET unknown 404 ok", async (t) => {
  const router = new Router([
    ["/", () => "Hello Deno!"],
  ]);

  const port = await getRandomFreePort(PORT_LO, PORT_HI);
  const { server, controller } = createRouterServer(port, router);

  await t.step("GET /unknown", async () => {
    const response = await fetch(`http://localhost:${port}/unknown`);
    assertEquals(response.status, 404);
    const responseBody = await response.json();
    assertEquals(responseBody.data.message, "NOT FOUND");
  });

  controller.abort();
  await server.finished;
});
