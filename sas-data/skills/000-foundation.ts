// 000-foundation.ts presents the foundational skills

import { RegistrarInterface } from "../../src/registrar.ts";

export function register(registrar: RegistrarInterface) {
  registrar
    .on("3 Dec 2008")
    .addSkill({
      tag: "Python 3.0",
      description: "Python 3.0 development",
      reference: "https://docs.python.org/3/whatsnew/3.0.html",
    })
    .on("Dec 3, 2015")
    .addSkill({
      tag: "PHP 7.0",
      description: "PHP 7.0 development",
      reference: "https://www.php.net/ChangeLog-7.php#PHP_7_0",
    })
    .on("1st Sept 2018")
    .addSkill({
      tag: "java11",
      description: "Java v11 development",
      reference: "https://docs.oracle.com/en/java/javase/11/",
    })
    .on("22/11/2024")
    .addSkill({
      tag: "TypeScript 5",
      description: "TypeScript 5 development",
      reference:
        "https://devblogs.microsoft.com/typescript/announcing-typescript-5-7/",
    });
}
