// EventType is the category of data-point that can be stored.
export enum EventType {
  Skill = "skill",
  Person = "person",
  Team = "team",
}

export type EventTag = string;

export type EventsMap = Map<EventTag, RegistryData>;

export interface EventBase {
  tag: EventTag;
}

// The Skill, Person, and Team interfaces represent the data that Users will provide as data-points
export interface Skill extends EventBase {
  description: string;
  reference: string;
}
export interface Person extends EventBase {
  name: string;
  skills: [string, number][];
}
export interface Team extends EventBase {
  name: string;
  lead: string;
  services: string[];
}
export interface RegistryBase extends EventBase {
  type: EventType;
  date?: string;
}

// The SkillEvent, PersonEvent, and TeamEvent interfaces represent the data structures (built from data-points) that will be stored in the registry
export interface SkillEvent extends RegistryBase, Skill {
  type: EventType.Skill;
}

export interface PersonEvent extends RegistryBase, Person {
  type: EventType.Person;
}

export interface TeamEvent extends RegistryBase, Team {
  type: EventType.Team;
}

export type RegistryData = SkillEvent | PersonEvent | TeamEvent;
