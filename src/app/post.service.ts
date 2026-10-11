import { Injectable } from '@angular/core';

export interface Post {
  id: string;
  userId: string;
  title: string;
}

const POSTS: Post[] = [
  { id: '1', userId: '1', title: 'Hello Router Resources' },
  { id: '2', userId: '1', title: 'Signals and the Router' },
  { id: '3', userId: '2', title: 'Parallel loading' },
];

@Injectable({ providedIn: 'root' })
export class PostService {
  async getPosts(userId: string): Promise<Post[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return POSTS.filter((p) => p.userId === userId);
  }
}
