import { assertInstanceOf, assertThrows } from "jsr:@std/assert";
import { Registrar, registrarFactory } from "../src/registrar.ts";

Deno.test("Registrar initialisation ok", () => {
  const registrar = new Registrar(() => {});
  assertInstanceOf(registrar, Registrar);
});

Deno.test("Registrar addSkill ok", () => {
  const registrar = new Registrar(() => {});
  registrar
    .on("2021-01-01")
    .addSkill({ tag: "tag", description: "description" });
});

Deno.test("Registrar addSkill throws if on not called", () => {
  const registrar = new Registrar(() => {});
  assertThrows(
    () => registrar.addSkill({ tag: "tag", description: "description" }),
    Error,
    `No data point date set. Call "on()" first.`,
  );
});

Deno.test("Registrar registrarFactory ok", () => {
  const registrarFactoryFn = registrarFactory(() => {});
  const registrar = registrarFactoryFn();
  assertInstanceOf(registrar, Registrar);
});
