// 000-foundation.ts presents the foundational skills
import { RegistrarInterface } from "../../../../src/types.ts";

export function register(registrar: RegistrarInterface) {
  registrar
    .on("12 Feb 1999")
    .addSkill({
      tag: "Pachinko",
      description: "Pachinko master",
      reference: "https://en.wikipedia.org/wiki/pachinko?variant=zh-cn",
    })
    .on("31/12/2001")
    .addSkill({
      tag: "Pokémon",
      description: "Pokémon master",
      reference: "https://www.pokemon.com",
    });
}