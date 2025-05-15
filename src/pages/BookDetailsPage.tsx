import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Book as BookIcon, User, Globe, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useBooks } from '../context/BookContext';
import { useAuth } from '../context/AuthContext';
import { Book } from '../types';

const BookDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getBook, checkoutBook, returnBook } = useBooks();
  const { currentUser, isAuthenticated } = useAuth();
  const [book, setBook] = useState<Book | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  useEffect(() => {
    if (id) {
      const bookData = getBook(id);
      if (bookData) {
        setBook(bookData);
      } else {
        // Book not found, redirect to home
        navigate('/', { replace: true });
      }
      setLoading(false);
    }
  }, [id, getBook, navigate]);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-700"></div>
      </div>
    );
  }
  
  if (!book) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Book Not Found</h2>
        <p className="text-gray-600 mb-4">The book you're looking for doesn't exist or has been removed.</p>
        <Link
          to="/"
          className="inline-flex items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Library
        </Link>
      </div>
    );
  }
  
  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Format due date
  const formatDueDate = (date: Date | undefined) => {
    if (!date) return 'N/A';
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
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
  
  const handleCheckout = () => {
    if (!currentUser) return;
    
    setActionLoading(true);
    setTimeout(() => {
      checkoutBook(book.id, currentUser.id);
      setBook({
        ...book,
        isAvailable: false,
        borrowedBy: currentUser.id,
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
      });
      setSuccessMessage('Book checked out successfully! Return by ' + 
        formatDueDate(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)));
      setActionLoading(false);
    }, 600); // Simulate API call
  };
  
  const handleReturn = () => {
    setActionLoading(true);
    setTimeout(() => {
      returnBook(book.id);
      setBook({
        ...book,
        isAvailable: true,
        borrowedBy: undefined,
        dueDate: undefined
      });
      setSuccessMessage('Book returned successfully!');
      setActionLoading(false);
    }, 600); // Simulate API call
  };
  
  const isUserBook = book.borrowedBy === currentUser?.id;
  const daysUntilDue = getDaysUntilDue(book.dueDate);
  
  return (
    <div>
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center text-indigo-600 hover:text-indigo-800 transition duration-150"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Library
        </Link>
      </div>
      
      {successMessage && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
          <div className="flex">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            <p className="text-green-700">{successMessage}</p>
          </div>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="md:flex">
          {/* Book Cover */}
          <div className="md:w-1/3 p-6 flex justify-center bg-gray-50">
            <img
              src={book.coverImage}
              alt={`Cover of ${book.title}`}
              className="w-full max-w-xs object-contain rounded-md shadow-md"
            />
          </div>
          
          {/* Book Details */}
          <div className="md:w-2/3 p-6">
            <div className="flex justify-between items-start">
              <h1 className="text-2xl font-bold text-gray-800 mb-2 font-serif">{book.title}</h1>
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
            
            <p className="text-lg text-gray-600 mb-4">by {book.author}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">ISBN</h3>
                <p className="text-gray-800">{book.isbn}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Genre</h3>
                <p className="text-gray-800">{book.genre}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Published</h3>
                <p className="text-gray-800 flex items-center">
                  <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                  {formatDate(book.publishedDate)}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Publisher</h3>
                <p className="text-gray-800">{book.publisher}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Pages</h3>
                <p className="text-gray-800 flex items-center">
                  <BookIcon className="h-4 w-4 mr-1 text-gray-400" />
                  {book.pages}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Language</h3>
                <p className="text-gray-800 flex items-center">
                  <Globe className="h-4 w-4 mr-1 text-gray-400" />
                  {book.language}
                </p>
              </div>
            </div>
            
            {!book.isAvailable && book.dueDate && (
              <div className={`p-3 mb-6 rounded-md ${daysUntilDue < 3 ? 'bg-red-50' : 'bg-gray-50'}`}>
                <h3 className="font-medium flex items-center">
                  <Clock className={`h-4 w-4 mr-1 ${daysUntilDue < 3 ? 'text-red-500' : 'text-gray-500'}`} />
                  {isUserBook ? 'Your Return Date' : 'Currently Checked Out'}
                </h3>
                <p className={`text-sm ${daysUntilDue < 3 ? 'text-red-600' : 'text-gray-500'}`}>
                  Due by {formatDueDate(book.dueDate)} 
                  {daysUntilDue < 3 && ' (Soon!)'}
                </p>
              </div>
            )}
            
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-800 mb-2">Description</h3>
              <p className="text-gray-600">{book.description}</p>
            </div>
            
            {isAuthenticated ? (
              <div className="flex">
                {book.isAvailable ? (
                  <button
                    onClick={handleCheckout}
                    disabled={actionLoading}
                    className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                      actionLoading ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {actionLoading ? (
                      <>
                        <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                        Processing...
                      </>
                    ) : (
                      'Check Out Book'
                    )}
                  </button>
                ) : isUserBook ? (
                  <button
                    onClick={handleReturn}
                    disabled={actionLoading}
                    className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
                      actionLoading ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {actionLoading ? (
                      <>
                        <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                        Processing...
                      </>
                    ) : (
                      'Return Book'
                    )}
                  </button>
                ) : (
                  <button
                    disabled
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-500 bg-gray-100 cursor-not-allowed"
                  >
                    <User className="mr-2 h-4 w-4" />
                    Checked Out by Another User
                  </button>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Login to Check Out
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailsPage;