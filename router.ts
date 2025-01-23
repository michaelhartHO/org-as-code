// router.ts Provides an http server route handler for Deno.serve

// Clients define their routes and handlers with Route.
// The Request handler callback returns a string or object that will be 
// serialized to JSON in the Response

export type RequestHandlerFn = (request: Request) => string | object | Response;

export type Route = [
  URLPattern | string,
  RequestHandlerFn,
];

// _Route is the internal representation of a Route, with the guaranteed URLPattern
type _Route = [
  URLPattern,
  RequestHandlerFn,
];

export class Router {
  private routes: _Route[];

  constructor(routes: Route[]) {
    this.routes = routes.map(([path, callback]) => [
      typeof path === "string" ? new URLPattern({ pathname: path }) : path,
      callback,
    ]);
  }

  private matchRoute(request: Request): { callback: RequestHandlerFn, url: URL } | null {
    const url = new URL(request.url);
    for (const [route, callback] of this.routes) {
      if (route.test(url)) {
        return { callback, url };
      }
    }
    return null;
  }

  private createResponseBody(data: string | object, timestamp: string): object {
    return {
      timestamp,
      data,
    };
  }

  public router(request: Request): Response {
    const timestamp = new Date().toISOString();
    const matchedRoute = this.matchRoute(request);

    if (matchedRoute) {
      const { callback } = matchedRoute;
      const data = callback(request);
      if (data instanceof Response) {
        return data;
      }
      const responseBody = this.createResponseBody(data, timestamp);
      return this.createResponse(responseBody, 200);
    }

    const responseBody = this.createResponseBody({ message: "NOT FOUND" }, timestamp);
    return this.createResponse(responseBody, 404);
  }

  private createResponse(body: object, status: number): Response {
    return new Response(JSON.stringify(body, null, 2), {
      status,
      headers: {
        "content-type": "application/json; charset=utf-8",
      },
    });
  }
}
