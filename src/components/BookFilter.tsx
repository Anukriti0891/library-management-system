import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Filter, SortAsc, SortDesc, Search as SearchIcon } from 'lucide-react';
import { BookFilter as BookFilterType } from '../types';

interface BookFilterProps {
  onFilterChange: (filters: BookFilterType) => void;
}

const BookFilter: React.FC<BookFilterProps> = ({ onFilterChange }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState(queryParams.get('search') || '');
  const [genre, setGenre] = useState(queryParams.get('genre') || 'all');
  const [availability, setAvailability] = useState<boolean | undefined>(
    queryParams.has('available') 
      ? queryParams.get('available') === 'true'
      : undefined
  );
  const [sortBy, setSortBy] = useState<'title' | 'author' | 'publishedDate'>(
    (queryParams.get('sortBy') as any) || 'title'
  );
  
  const genres = ['Fiction', 'Science Fiction', 'Fantasy', 'Romance', 'Mystery', 'Biography', 'History', 'Self-Help'];
  
  useEffect(() => {
    // Apply filters from URL on component mount
    const initialFilters: BookFilterType = {};
    
    if (search) initialFilters.search = search;
    if (genre && genre !== 'all') initialFilters.genre = genre;
    if (availability !== undefined) initialFilters.availability = availability;
    if (sortBy) initialFilters.sortBy = sortBy;
    
    onFilterChange(initialFilters);
  }, []);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Build filter object
    const filters: BookFilterType = {};
    if (search) filters.search = search;
    if (genre && genre !== 'all') filters.genre = genre;
    if (availability !== undefined) filters.availability = availability;
    if (sortBy) filters.sortBy = sortBy;
    
    // Update URL with filter parameters
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (genre && genre !== 'all') params.set('genre', genre);
    if (availability !== undefined) params.set('available', availability.toString());
    if (sortBy) params.set('sortBy', sortBy);
    
    navigate({ search: params.toString() });
    
    // Call the filter function
    onFilterChange(filters);
    
    // Close the filters on mobile
    setIsOpen(false);
  };
  
  const clearFilters = () => {
    setSearch('');
    setGenre('all');
    setAvailability(undefined);
    setSortBy('title');
    
    navigate('/');
    onFilterChange({});
    setIsOpen(false);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm mb-6 overflow-hidden">
      {/* Mobile Search */}
      <div className="p-4 md:hidden">
        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            placeholder="Search books..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full py-2 px-3 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <button type="submit" className="absolute right-3 top-2 text-gray-500">
            <SearchIcon className="h-5 w-5" />
          </button>
        </form>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="mt-2 w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <Filter className="h-4 w-4 mr-2" />
          {isOpen ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>
      
      {/* Filter Form */}
      <form 
        onSubmit={handleSubmit} 
        className={`p-4 border-t border-gray-100 ${!isOpen && 'hidden md:block'}`}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search - Hidden on Mobile (already shown above) */}
          <div className="hidden md:block">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <div className="relative">
              <input
                type="text"
                id="search"
                placeholder="Title, author, ISBN..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full py-2 px-3 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <SearchIcon className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
          
          {/* Genre Filter */}
          <div>
            <label htmlFor="genre" className="block text-sm font-medium text-gray-700 mb-1">
              Genre
            </label>
            <select
              id="genre"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Genres</option>
              {genres.map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
          
          {/* Availability Filter */}
          <div>
            <label htmlFor="availability" className="block text-sm font-medium text-gray-700 mb-1">
              Availability
            </label>
            <select
              id="availability"
              value={availability === undefined ? '' : availability.toString()}
              onChange={(e) => {
                const val = e.target.value;
                setAvailability(val === '' ? undefined : val === 'true');
              }}
              className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">All Books</option>
              <option value="true">Available Only</option>
              <option value="false">Checked Out Only</option>
            </select>
          </div>
          
          {/* Sort By */}
          <div>
            <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-1">
              Sort By
            </label>
            <select
              id="sortBy"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="title">Title</option>
              <option value="author">Author</option>
              <option value="publishedDate">Publication Date</option>
            </select>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="mt-4 flex justify-end space-x-3">
          <button
            type="button"
            onClick={clearFilters}
            className="py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Clear
          </button>
          <button
            type="submit"
            className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Apply Filters
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookFilter;