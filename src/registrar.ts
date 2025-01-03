// registrar.ts registers the events declared in a data-point function with the time series database.

import { Events, Person, RegistrarInterface, RegistryData, Skill } from "./types.ts";
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
    this.insert(Events.Skill, skill);
    return this;
  }

  addPerson(person: Person): this {
    this.validate();
    this.insert(Events.Person, person);
    return this;
  }

  private insert(event: Events, data: RegistryData) {
    if (this._dataPointDate) {
      this.dbInsertFn(this._dataPointDate, event, data);
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
