// 000-skills.ts is a data-point file that registers two skills.
import { RegistrarInterface } from "../../../src/types.ts";

// Used in tests
export const ON_DATE_1_JAN_2021 = "1 Jan 2021";
export const ON_DATE_01_01_2025 = "01/01/2025";
export const TAG_1 = "java11";
export const TAG_2 = "TypeScript 5.7";
export const DESCRIPTION_1 = "Java v11 development";
export const DESCRIPTION_2 = "TypeScript 5.7 development";
export const REFERENCE_1 = "https://docs.oracle.com/en/java/javase/11/";
export const REFERENCE_2 =
  "https://devblogs.microsoft.com/typescript/announcing-typescript-5-7/";

export function register(registrar: RegistrarInterface) {
  registrar
    .on(ON_DATE_1_JAN_2021)
    .addSkill({
      tag: TAG_1,
      description: DESCRIPTION_1,
      reference: REFERENCE_1,
    })
    .on(ON_DATE_01_01_2025)
    .addSkill({
      tag: TAG_2,
      description: DESCRIPTION_2,
      reference: REFERENCE_2,
    });
}
