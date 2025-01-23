import { RegistrarInterface } from "../../src/registrar.ts";

export function register(registrar: RegistrarInterface) {
  registrar
    .on("2023-03-11T00:00:00Z")
    .addPerson({
      tag: "anunt.till",
      name: "Anunt Reithlus Till",
      skills: [["React 18", 6], ["Python 3.6", 3]],
    })
    .on("March 29, 2022")
    .addSkill(
      {
        tag: "React 18",
        description: "React 18 development",
        reference:
          "https://github.com/facebook/react/blob/main/CHANGELOG.md#1800-march-29-2022",
      },
    );
}
