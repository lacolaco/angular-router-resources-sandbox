import { Injectable } from '@angular/core';

export interface User {
  id: string;
  name: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private users: User[] = [
    { id: '1', name: 'Alice' },
    { id: '2', name: 'Bob' },
    { id: '3', name: 'Alicia' },
  ];

  async getUser(id: string): Promise<User> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const user = this.users.find((u) => u.id === id);
    if (!user) {
      throw new Error(`User ${id} not found`);
    }
    return user;
  }

  async searchUsers(q: string): Promise<User[]> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return this.users.filter((u) => u.name.toLowerCase().includes(q.toLowerCase()));
  }

  async getUsers(): Promise<User[]> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return [...this.users];
  }

  async saveUser(user: User): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    this.users = this.users.map((u) => (u.id === user.id ? { ...user } : u));
  }
}
