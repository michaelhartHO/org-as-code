// 000-foundation.ts presents the foundational skills
import { RegistrarInterface } from "../../src/types.ts";

export function register(registrar: RegistrarInterface) {
  registrar
    .on("1 Jan 2021")
    .addSkill({
      tag: "java11",
      description: "Java v11 development",
      reference: "https://docs.oracle.com/en/java/javase/11/",
    })
    .on("22/11/2024")
    .addSkill({
      tag: "TypeScript 5",
      description: "TypeScript 5 development",
      reference: "https://devblogs.microsoft.com/typescript/announcing-typescript-5-7/",
    });
}