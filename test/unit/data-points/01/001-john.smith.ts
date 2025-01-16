// 001-john.smith.ts

import {RegistrarInterface} from "../../../../src/registrar.ts";

// Used in tests
export const ON_DATE_12_11_2021 = "12 Nov 2021";

export function register(registrar: RegistrarInterface) {
  registrar
    .on(ON_DATE_12_11_2021)
    .addPerson({
      tag: "john.smith",
      name: "John Smith",
      skills: [["java11", 5]],
    });
}
