Deno.serve({
  onListen({ port, hostname }) {
    console.log(`Server started at http://${hostname}:${port}`);
  },
}, (_req) => new Response("org-as-code " + new Date().toISOString()));
