// router.ts Provides an http server route handler for Deno.serve
//

// Clients define their routes and handlers with Route.
// The Request handler callback returns a string or object that will be serialized to JSON in the Response
export type Route = [
  URLPattern | string,
  (request: Request) => string | object,
];

// _Route is the internal representation of a Route
type _Route = [
  URLPattern,
  (request: Request) => string | object,
];

export class Router {
  private routes: _Route[];

  constructor(routes: Route[]) {
    this.routes = routes.map(([path, callback]) => [
      typeof path === "string" ? new URLPattern({ pathname: path }) : path,
      callback,
    ]);
  }

  public router(request: Request): Response {
    const url = new URL(request.url);
    const timestamp = new Date().toISOString();
    let responseBody = {};
    let status = 200;

    let matched = false;
    for (const [route, callback] of this.routes) {
      if (route.test(url)) {
        responseBody = {
          timestamp,
          data: callback(request),
        };
        matched = true;
        break;
      }
    }

    if (!matched) {
      status = 404;
      responseBody = { timestamp, data: { message: "NOT FOUND" } };
    }

    return new Response(JSON.stringify(responseBody, null, 2), {
      status,
      headers: {
        "content-type": "application/json; charset=utf-8",
      },
    });
  }
}
