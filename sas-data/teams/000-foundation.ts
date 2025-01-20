// 000-foundation.ts presents the foundational teams

import {RegistrarInterface} from "../../src/registrar.ts";

export function register(registrar: RegistrarInterface) {
  registrar
    .on("1 Jan 2021")
    .addTeam({
        tag: "intel-tech",
        name: "Intelligence Technology",
        lead: "luthimer.bressimier2", 
        services: ["Service A", "Service B"],
    });
}
