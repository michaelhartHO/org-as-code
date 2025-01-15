// registrar.ts registers the events declared in a data-point function with the time series database.

import {
  EventType,
  Person,
  PersonEvent,
  RegistrarInterface,
  RegistryData,
  Skill,
  SkillEvent,
  Team,
  TeamEvent,
} from "./types.ts";
import { DbInsertFn } from "./timeSeriesDb.ts";
import { LibDate } from "./libDate.ts";

export class Registrar implements RegistrarInterface {
  private dbInsertFn: DbInsertFn;
  private _dataPointDate: LibDate | null = null;

  constructor(dbInsertFn: DbInsertFn) {
    this.dbInsertFn = dbInsertFn;
  }

  // `on` must be the first method called when registering a data point.
  on(date: LibDate | Date | string): this {
    this._dataPointDate = date instanceof LibDate ? date : new LibDate(date);
    return this;
  }

  addSkill(skill: Skill): this {
    this.validate();
    this.insert(this.createSkill(skill));
    return this;
  }

  createSkill(data: Skill): SkillEvent {
    return {
        ...data,
        type: EventType.Skill
    };
  }

  addPerson(person: Person): this {
    this.validate();
    this.insert(this.createPerson(person));
    return this;
  }

  createPerson(data: Person): PersonEvent {
    return {
        ...data,
        type: EventType.Person
    };
  }

  addTeam(team: Team): this {
    this.validate();
    this.insert(this.createTeam(team));
    return this;
  }

  createTeam(data: Team): TeamEvent {
    return {
        ...data,
        type: EventType.Team
    };
  }


  private insert(data: RegistryData) {
    if (this._dataPointDate) {
      this.dbInsertFn(this._dataPointDate, data.type, data);
    } else {
      throw new Error(`No data point date set. Call "on()" first.`);
    }
  }

  private validate() {
    if (!this._dataPointDate) {
      throw new Error(`No data point date set. Call "on()" first.`);
    }
  }
}

export function registrarFactory(dbInsertFn: DbInsertFn) {
  return () => new Registrar(dbInsertFn);
}
