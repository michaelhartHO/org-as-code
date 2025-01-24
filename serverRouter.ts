import { extname } from "https://deno.land/std@0.224.0/path/mod.ts";

export type RequestHandlerFn = (request: Request) => string | Response;
export type Route = [URLPattern | string, RequestHandlerFn | undefined];

export class ServerRouter {
  private routes: Route[];

  constructor(routes: Route[], private publicPath: string = "./src/public") {
    this.routes = routes.map(([path, callback]) => [
      typeof path === "string" ? new URLPattern({ pathname: path }) : path,
      callback,
    ]);
  }

  async handle(request: Request): Promise<Response> {
    const url = new URL(request.url);

    // Check for public file streaming
    if (url.pathname.startsWith("/public/")) {
      return this.streamPublicFile(url.pathname);
    }

    // Find matching route
    for (const [pattern, handler] of this.routes) {
      const matcher = pattern instanceof URLPattern // TODO: refactor into constructor
        ? pattern
        : new URLPattern({ pathname: pattern });

      if (matcher.test(request.url)) {
        if (handler === undefined) {
          return new Response(undefined, { status: 204 }); // No Content
        }

        const result = await handler(request);

        // Convert string to appropriate response
        if (typeof result === "string") {
          let contentType = "text/html";
          if (url.pathname.startsWith("/api")) {
            contentType = "application/json";
          }

          return new Response(result, {
            headers: { "Content-Type": contentType },
          });
        }

        return result;
      }
    }

    // Default 404 response
    return new Response("Not Found", { status: 404 });
  }

  private async streamPublicFile(pathname: string): Promise<Response> {
    // TODO sanitize the hell out of `pathname` and secure `filePath`
    const filePath = `${this.publicPath}${pathname.replace("/public", "")}`; // TODO make /public configurable via constructor so it can be tested

    try {
      const file = await Deno.open(filePath, { read: true });
      const fileInfo = await Deno.stat(filePath);

      const ext = extname(filePath).toLowerCase();
      const contentTypeMap: Record<string, string> = {
        ".html": "text/html",
        ".css": "text/css",
        ".js": "application/javascript",
        ".json": "application/json",
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".gif": "image/gif",
        ".svg": "image/svg+xml",
      };

      return new Response(file.readable, {
        headers: {
          "Content-Type": contentTypeMap[ext] || "application/octet-stream",
          "Content-Length": fileInfo.size.toString(),
        },
      });
    } catch (_error) {
      return new Response("File Not Found", { status: 404 });
    }
  }
}
