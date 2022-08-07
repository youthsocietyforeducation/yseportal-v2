import { SuperRecord } from './SuperRecord';
export class User extends SuperRecord {
  firstName = '';
  lastName = '';
  profileImageURL = '';
  profileImageName = '';
  isProfileSet = false;
  email = '';
  uid = '';
  roles = [];

  constructor() {
    super();
  }
}
