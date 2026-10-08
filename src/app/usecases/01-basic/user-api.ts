export interface User {
  id: string;
  name: string;
  role: string;
}

const users: User[] = [
  { id: '1', name: 'Ada Lovelace', role: 'Mathematician' },
  { id: '2', name: 'Grace Hopper', role: 'Computer scientist' },
  { id: '3', name: 'Alan Turing', role: 'Logician' },
];

export const API_DELAY_MS = 1500;

// ネットワーク越しの取得を模して、一定時間待ってから返す偽の API。
function delay<T>(value: () => T): Promise<T> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        resolve(value());
      } catch (error) {
        reject(error);
      }
    }, API_DELAY_MS);
  });
}

export function fetchUser(id: string): Promise<User> {
  return delay(() => {
    const user = users.find((user) => user.id === id);
    if (!user) {
      throw new Error(`User ${id} not found`);
    }
    return user;
  });
}

export const userSummaries = users.map(({ id, name }) => ({ id, name }));
