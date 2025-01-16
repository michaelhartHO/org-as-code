// 000-foundation.ts presents the foundational teams
import { RegistrarInterface } from "../../../../src/types.ts";

export function register(registrar: RegistrarInterface) {
  registrar
    .on("1 Jan 2021")
    .addTeam({
        tag: "Team Rocket",
        name: "Launch Capabilities",
        lead: "keyser.söze", 
        services: ["Engines", "Payload"],
    });
}
