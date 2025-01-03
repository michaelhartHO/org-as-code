import { LibDate } from "./libDate.ts";

// Events represent the category of time series data that can be stored.
export enum Events {
  Skill = "skill",
  Person = "person",
  Team = "team",
}

export type EventTag = string;
export interface RegistryData {
  tag: EventTag;
}

export interface Skill extends RegistryData {
  description: string;
  reference: string;
}

export interface Person extends RegistryData {
  name: string;
  skills: [string, number][];
}

export type EventsMap = Map<EventTag, RegistryData>;

export interface RegistrarInterface {
  on(date: LibDate | Date | string): this;
  addSkill(skill: Skill): this;
  addPerson(person: Person): this;
}
