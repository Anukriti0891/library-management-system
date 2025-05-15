import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Book, AlertCircle } from 'lucide-react';
import { useBooks } from '../context/BookContext';
import BookCard from '../components/BookCard';
import BookFilter from '../components/BookFilter';
import { BookFilter as BookFilterType } from '../types';

const HomePage: React.FC = () => {
  const location = useLocation();
  const { filteredBooks, loading, error, filterBooks } = useBooks();
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
  useEffect(() => {
    // Parse URL parameters
    const queryParams = new URLSearchParams(location.search);
    const filters: BookFilterType = {};
    
    // Set filters from URL
    if (queryParams.has('search')) filters.search = queryParams.get('search') || undefined;
    if (queryParams.has('genre')) filters.genre = queryParams.get('genre') || undefined;
    if (queryParams.has('available')) filters.availability = queryParams.get('available') === 'true';
    if (queryParams.has('sortBy')) filters.sortBy = queryParams.get('sortBy') as any;
    
    // Apply filters
    filterBooks(filters);
    setIsInitialLoad(false);
  }, [location.search]);
  
  const handleFilterChange = (filters: BookFilterType) => {
    filterBooks(filters);
  };
  
  return (
    <div>
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 font-serif">
          Welcome to LibraryHub
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Discover your next great read from our collection of timeless classics and contemporary masterpieces.
        </p>
      </div>
      
      <BookFilter onFilterChange={handleFilterChange} />
      
      {loading && isInitialLoad ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-700"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      ) : filteredBooks.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Book className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No books found</h3>
          <p className="text-gray-500">
            Try adjusting your search or filter criteria to find what you're looking for.
          </p>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-4">Showing {filteredBooks.length} books</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default HomePage;