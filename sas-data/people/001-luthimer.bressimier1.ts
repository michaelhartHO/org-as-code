import {RegistrarInterface} from "../../src/registrar.ts";

export function register(registrar: RegistrarInterface) {
  registrar
    .on("2023-01-01T00:00:00Z")
    .addPerson({
      tag: "luthimer.bressimier1",
      name: "Luthimer Bressimier",
      skills: [["java11", 5], ["TypeScript 5", 3]],
    });
}