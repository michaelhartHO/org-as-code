// registerDataPoints.ts consumes the data-points found in the data-points directory.
// Each file is processed through a Registrar and inserted into the database.

import { RegistrarFactory } from "./registrar.ts";

export async function registerDataPoints(
  registrarFactory: RegistrarFactory,
  dataPointsPath: string,
) {
  let resolvedPath: string;
  try {
    resolvedPath = Deno.realPathSync(dataPointsPath);
  } catch (_error) {
    throw new Error(
      `data-points directory not found: ${dataPointsPath}\n` + _error,
    );
  }

  const dataPointsDir = Deno.readDirSync(resolvedPath);
  for (const dirEntry of dataPointsDir) {
    if (dirEntry.isFile && dirEntry.name.endsWith(".ts")) {
      const dataPointModule = await import(
        `${resolvedPath}/${dirEntry.name}`
      );
      dataPointModule.register(registrarFactory());
    }
  }
}
