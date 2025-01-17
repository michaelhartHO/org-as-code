import { assert, assertEquals } from "jsr:@std/assert";
import { Router } from "../../router.ts";

Deno.test("Server tear-down test", async (t) => {
  const createServer = (port: number, responseText: string) => {
    const controller = new AbortController();
    const { signal } = controller;
    const server = Deno.serve({ port, signal }, (_req) => {
      return new Response(responseText);
    });
    return { server, controller };
  };

  await t.step(
    "First Server launch on 8000, request and tear-down",
    async () => {
      const { server, controller } = createServer(8000, "Hello World");

      const response = await fetch("http://localhost:8000");
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
    "Second Server launch on 8000, request and tear-down",
    async () => {
      const { server, controller } = createServer(8000, "Hello Again");

      const response = await fetch("http://localhost:8000");
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

const getRandomString = () => Math.random().toString(36).slice(2);

Deno.test("Router GET two routes 200 ok", async (t) => {
  const rootMsg = `Hello Deno! ${getRandomString()}`;
  const deepMsg = `Deeper levels ${getRandomString()}`;

  const router = new Router([
    ["/", () => rootMsg],
    ["/deep/route", () => deepMsg],
  ]);

  const { server, controller } = createRouterServer(8000, router);

  await t.step("GET /", async () => {
    const response = await fetch("http://localhost:8000");
    assertEquals(response.status, 200);
    const responseBody = await response.json();
    assertEquals(responseBody.data, rootMsg);
  });

  await t.step("GET /deep/route", async () => {
    const response = await fetch("http://localhost:8000/deep/route");
    assertEquals(response.status, 200);
    const responseBody = await response.json();
    assertEquals(responseBody.data, deepMsg);
  });

  controller.abort();
  await server.finished;
});

Deno.test("Router GET unknown 404 ok", async (t) => {
  const router = new Router([
    ["/", () => "Hello Deno!"],
  ]);

  const { server, controller } = createRouterServer(8000, router);

  await t.step("GET /unknown", async () => {
    const response = await fetch("http://localhost:8000/unknown");
    assertEquals(response.status, 404);
    const responseBody = await response.json();
    assertEquals(responseBody.data.message, "NOT FOUND");
  });

  controller.abort();
  await server.finished;
});
