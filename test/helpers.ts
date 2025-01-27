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

/**
 * Polls a specified port to check if it is in use within a given timeout period.
 *
 * @param port - The port number to check.
 * @param pollTimeout - The interval in milliseconds between each poll.
 * @param serverTimeout - The maximum duration in milliseconds to keep polling.
 * @param polarity - The expected state of the port (true if the port should be in use, false otherwise). Defaults to true.
 * @returns A promise that resolves when the port's state matches the expected polarity or the server timeout is reached.
 */
export async function pollPortInUse(
  port: number,
  pollTimeout: number,
  serverTimeout: number,
  polarity: boolean = true,
): Promise<boolean> {
  do {
    if (polarity === await isPortInUse(port)) {
      return true;
    }
    await new Promise((resolve) => setTimeout(resolve, pollTimeout));
  } while ((serverTimeout -= pollTimeout) > 0);
  return false;
}

// Get a random free port within a range
export async function getRandomFreePort(
  low: number = 50000,
  high: number = 51000,
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
