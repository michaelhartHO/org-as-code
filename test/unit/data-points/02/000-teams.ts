import { RegistrarInterface } from "../../../../src/types.ts";

export const ON_DATE_01_01_2021 = "01-01-2021";

export function register(registrar: RegistrarInterface) {
  registrar
    .on(ON_DATE_01_01_2021)
    .addTeam({
        tag: "team",
        name: "Team",
        lead: "Lead",
        services: ["Service"],
    });
}
