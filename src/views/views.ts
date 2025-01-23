// Routes and handlers for /
import nunjucks from "npm:nunjucks"; // https://mozilla.github.io/nunjucks/
import { RegistryData } from "../types.ts";

nunjucks.configure("src/views", { autoescape: true });

export function indexHandler(_request: Request): Response {
  const timestamp = new Date().toLocaleString();
  const html = nunjucks.render("index.html", {
    title: "Org As Code",
    timestamp,
  });
  return new Response(html, {
    status: 200,
    headers: {
      "content-type": "text/html",
    },
  });
}

export function peopleHandler(
  _request: Request,
  peopleData: Record<string, RegistryData>,
): Response {
  const html = nunjucks.render("people.njk", {
    data: peopleData,
  });
  return new Response(html, {
    status: 200,
    headers: {
      "content-type": "text/html",
    },
  });
}

export function skillsHandler(
  _request: Request,
  skillsData: Record<string, RegistryData>,
): Response {
  const html = nunjucks.render("skills.njk", {
    data: skillsData,
  });
  return new Response(html, {
    status: 200,
    headers: {
      "content-type": "text/html",
    },
  });
}

export function teamsHandler(
  _request: Request,
  teamsData: Record<string, RegistryData>,
): Response {
  const html = nunjucks.render("teams.njk", {
    data: teamsData,
  });
  return new Response(html, {
    status: 200,
    headers: {
      "content-type": "text/html",
    },
  });
}

export function filesHandler(request: Request): Response {
  const url = new URL(request.url);
  const filepath = decodeURIComponent(url.pathname);
  try {
    const file = Deno.openSync("." + filepath, { read: true });
    return new Response(file.readable);
  } catch {
    return new Response("404 Not Found", { status: 404 });
  }
}
