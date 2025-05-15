import React, { createContext, useState, useContext, useEffect } from 'react';
import { Book, BookFilter } from '../types';
import { mockBooks } from '../data/mockData';

interface BookContextProps {
  books: Book[];
  filteredBooks: Book[];
  loading: boolean;
  error: string | null;
  getBook: (id: string) => Book | undefined;
  checkoutBook: (bookId: string, userId: string) => void;
  returnBook: (bookId: string) => void;
  addBook: (book: Omit<Book, 'id'>) => void;
  removeBook: (bookId: string) => void;
  updateBook: (bookId: string, updates: Partial<Book>) => void;
  filterBooks: (filters: BookFilter) => void;
}

const BookContext = createContext<BookContextProps | undefined>(undefined);

export const useBooks = () => {
  const context = useContext(BookContext);
  if (context === undefined) {
    throw new Error('useBooks must be used within a BookProvider');
  }
  return context;
};

export const BookProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // In a real app, this would fetch from an API
    try {
      setBooks(mockBooks);
      setFilteredBooks(mockBooks);
    } catch (err) {
      setError('Failed to load books');
    } finally {
      setLoading(false);
    }
  }, []);

  const getBook = (id: string) => {
    return books.find(book => book.id === id);
  };

  const checkoutBook = (bookId: string, userId: string) => {
    setBooks(books.map(book => 
      book.id === bookId 
        ? { 
            ...book, 
            isAvailable: false,
            borrowedBy: userId,
            dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 days from now
          } 
        : book
    ));
    setFilteredBooks(filteredBooks.map(book => 
      book.id === bookId 
        ? { 
            ...book, 
            isAvailable: false,
            borrowedBy: userId,
            dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
          } 
        : book
    ));
  };

  const returnBook = (bookId: string) => {
    setBooks(books.map(book => 
      book.id === bookId 
        ? { 
            ...book, 
            isAvailable: true,
            borrowedBy: undefined,
            dueDate: undefined
          } 
        : book
    ));
    setFilteredBooks(filteredBooks.map(book => 
      book.id === bookId 
        ? { 
            ...book, 
            isAvailable: true,
            borrowedBy: undefined,
            dueDate: undefined
          } 
        : book
    ));
  };

  const addBook = (book: Omit<Book, 'id'>) => {
    const newBook = {
      ...book,
      id: `book-${Date.now()}`,
      isAvailable: true,
    };
    setBooks([...books, newBook as Book]);
    setFilteredBooks([...filteredBooks, newBook as Book]);
  };

  const removeBook = (bookId: string) => {
    setBooks(books.filter(book => book.id !== bookId));
    setFilteredBooks(filteredBooks.filter(book => book.id !== bookId));
  };

  const updateBook = (bookId: string, updates: Partial<Book>) => {
    setBooks(books.map(book => 
      book.id === bookId ? { ...book, ...updates } : book
    ));
    setFilteredBooks(filteredBooks.map(book => 
      book.id === bookId ? { ...book, ...updates } : book
    ));
  };

  const filterBooks = (filters: BookFilter) => {
    let result = [...books];
    
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(
        book => 
          book.title.toLowerCase().includes(searchTerm) ||
          book.author.toLowerCase().includes(searchTerm) ||
          book.isbn.toLowerCase().includes(searchTerm)
      );
    }
    
    if (filters.genre && filters.genre !== 'all') {
      result = result.filter(book => book.genre === filters.genre);
    }
    
    if (filters.availability !== undefined) {
      result = result.filter(book => book.isAvailable === filters.availability);
    }
    
    if (filters.sortBy) {
      result = result.sort((a, b) => {
        switch (filters.sortBy) {
          case 'title':
            return a.title.localeCompare(b.title);
          case 'author':
            return a.author.localeCompare(b.author);
          case 'publishedDate':
            return new Date(a.publishedDate).getTime() - new Date(b.publishedDate).getTime();
          default:
            return 0;
        }
      });
    }
    
    setFilteredBooks(result);
  };

  const value = {
    books,
    filteredBooks,
    loading,
    error,
    getBook,
    checkoutBook,
    returnBook,
    addBook,
    removeBook,
    updateBook,
    filterBooks,
  };

  return <BookContext.Provider value={value}>{children}</BookContext.Provider>;
};