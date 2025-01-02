// Calling the registry elements "Events" for want of a better collective noun
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
}

export type EventsMap = Map<EventTag, RegistryData>;
