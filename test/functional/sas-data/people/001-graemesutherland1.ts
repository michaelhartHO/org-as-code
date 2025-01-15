import { RegistrarInterface } from "../../src/types.ts";

export function register(registrar: RegistrarInterface) {
  registrar
    .on("2023-01-01T00:00:00Z")
    .addPerson({
      tag: "graeme.sutherland1",
      name: "Graeme Sutherland",
      skills: [["java11", 5], ["TypeScript 5", 3]],
    });
}