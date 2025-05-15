export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  description: string;
  coverImage: string;
  genre: string;
  publishedDate: string;
  publisher: string;
  pages: number;
  language: string;
  isAvailable: boolean;
  borrowedBy?: string;
  dueDate?: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'member';
  borrowedBooks?: string[];
}

export interface BookFilter {
  search?: string;
  genre?: string;
  availability?: boolean;
  sortBy?: 'title' | 'author' | 'publishedDate';
}