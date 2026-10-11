import { Injectable } from '@angular/core';

export interface User {
  id: string;
  name: string;
}

const USERS: User[] = [
  { id: '1', name: 'Alice' },
  { id: '2', name: 'Bob' },
  { id: '3', name: 'Alicia' },
];

@Injectable({ providedIn: 'root' })
export class UserService {
  async getUser(id: string): Promise<User> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const user = USERS.find((u) => u.id === id);
    if (!user) {
      throw new Error(`User ${id} not found`);
    }
    return user;
  }

  async searchUsers(q: string): Promise<User[]> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return USERS.filter((u) => u.name.toLowerCase().includes(q.toLowerCase()));
  }
}
