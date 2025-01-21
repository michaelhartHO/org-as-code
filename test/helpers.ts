import { assert } from "jsr:@std/assert";

export function assertHasKeys(obj: unknown, keys: string[]) {
  assert(obj && typeof obj === "object", "Expected an object");
  keys.forEach((key) => {
    assert(
      Object.hasOwn(obj, key),
      `Expected object to have key "${key}"`,
    );
  });
}

// Create a temporary listener (server) to check if a port is in use
// deno-lint-ignore require-await
export async function isPortInUse(port: number): Promise<boolean> {
  try {
    const listener = Deno.listen({ port });
    listener.close();
    return false;
  } catch (error) {
    if (error instanceof Deno.errors.AddrInUse) {
      return true;
    }
    throw error;
  }
}

// Get a random free port within a range
export async function getRandomFreePort(
  low: number,
  high: number,
): Promise<number> {
  const getRandomPort = () =>
    Math.floor(Math.random() * (high - low + 1)) + low;

  let port: number;
  let isFree: boolean;

  do {
    port = getRandomPort();
    isFree = await isPortInUse(port);
  } while (isFree);

  return port;
}

export function getRandomString(): string {
  return Math.random().toString(36).slice(2);
}
