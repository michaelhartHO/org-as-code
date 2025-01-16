import {RegistrarInterface} from "../../../../src/registrar.ts";

export function register(registrar: RegistrarInterface) {
  registrar
    .on("1995-08-28")
    .addPerson({
      tag: "keyser.söze",
      name: "Keyser Söze",
      skills: [["Pachinko", 7], ["Pokémon", 9]],
    });
}