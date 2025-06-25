export class Account {
  id: string;
  userId: string;
  isAdmin: boolean;

  constructor(id: string, userId: string, isAdmin: boolean) {
    this.id = id;
    this.userId = userId;
    this.isAdmin = isAdmin;
  }
}
