export class SuperRecord {
  created = '';
  updated = '';
  createdBy = '';
  updatedBy = '';
  active = true;

  constructor() {
    this.created = new Date().toString();
    this.updated = new Date().toString();
    this.createdBy = 'system';
    this.updatedBy = 'system';
    this.active = true;
  }
}
