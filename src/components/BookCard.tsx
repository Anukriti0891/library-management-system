import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, CheckCircle, XCircle } from 'lucide-react';
import { Book } from '../types';

interface BookCardProps {
  book: Book;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Format due date
  const formatDueDate = (date: Date | undefined) => {
    if (!date) return 'N/A';
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
  };
  
  // Calculate days until due
  const getDaysUntilDue = (dueDate: Date | undefined) => {
    if (!dueDate) return 0;
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };
  
  const daysUntilDue = getDaysUntilDue(book.dueDate);
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="relative h-56 overflow-hidden">
        <img 
          src={book.coverImage} 
          alt={`Cover of ${book.title}`} 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2">
          {book.isAvailable ? (
            <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
              <CheckCircle className="w-3 h-3 mr-1" /> Available
            </span>
          ) : (
            <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
              <XCircle className="w-3 h-3 mr-1" /> Checked Out
            </span>
          )}
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-1">
            {book.title}
          </h3>
          <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
            {book.genre}
          </span>
        </div>
        
        <p className="text-gray-600 mb-2">by {book.author}</p>
        
        <p className="text-gray-500 text-sm mb-3 line-clamp-2">
          {book.description}
        </p>
        
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500">
            <Calendar className="inline-block w-3.5 h-3.5 mr-1 mb-0.5" />
            {formatDate(book.publishedDate)}
          </span>
          
          {!book.isAvailable && book.dueDate && (
            <span className={`${daysUntilDue < 3 ? 'text-red-600' : 'text-gray-600'} text-xs`}>
              Due: {formatDueDate(book.dueDate)}
            </span>
          )}
        </div>
        
        <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
          <span className="text-xs text-gray-500">ISBN: {book.isbn}</span>
          <Link 
            to={`/books/${book.id}`}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition duration-150"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookCard;