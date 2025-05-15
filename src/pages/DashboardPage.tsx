import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Book, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useBooks } from '../context/BookContext';
import { Book as BookType } from '../types';

const DashboardPage: React.FC = () => {
  const { isAuthenticated, currentUser } = useAuth();
  const { books, returnBook } = useBooks();
  const navigate = useNavigate();
  
  const [borrowedBooks, setBorrowedBooks] = useState<BookType[]>([]);
  const [returnSuccess, setReturnSuccess] = useState('');
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});
  
  useEffect(() => {
    // Check if user is logged in
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    // Get borrowed books for the current user
    if (currentUser) {
      const userBooks = books.filter(book => book.borrowedBy === currentUser.id);
      setBorrowedBooks(userBooks);
    }
  }, [isAuthenticated, currentUser, books, navigate]);
  
  const handleReturnBook = (bookId: string) => {
    setActionLoading(prev => ({ ...prev, [bookId]: true }));
    
    // Simulate API call
    setTimeout(() => {
      returnBook(bookId);
      setBorrowedBooks(prev => prev.filter(book => book.id !== bookId));
      setReturnSuccess('Book returned successfully!');
      setActionLoading(prev => ({ ...prev, [bookId]: false }));
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setReturnSuccess('');
      }, 3000);
    }, 600);
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
  
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2 font-serif">
          Your Dashboard
        </h1>
        <p className="text-gray-600">
          Manage your borrowed books and account details.
        </p>
      </div>
      
      {returnSuccess && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
          <div className="flex">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            <p className="text-green-700">{returnSuccess}</p>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Currently Borrowed Books
            </h2>
            
            {borrowedBooks.length === 0 ? (
              <div className="bg-gray-50 rounded-lg p-6 text-center">
                <Book className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">No books borrowed</h3>
                <p className="text-gray-500 mb-4">
                  You haven't borrowed any books yet. Explore our collection to find your next read.
                </p>
                <Link
                  to="/"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Browse Books
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {borrowedBooks.map(book => {
                  const daysUntilDue = getDaysUntilDue(book.dueDate);
                  const isOverdue = daysUntilDue < 0;
                  
                  return (
                    <div 
                      key={book.id} 
                      className={`border rounded-lg overflow-hidden flex flex-col md:flex-row ${
                        isOverdue ? 'border-red-300 bg-red-50' : daysUntilDue < 3 ? 'border-yellow-300 bg-yellow-50' : 'border-gray-200'
                      }`}
                    >
                      <div className="md:w-1/4 p-4 flex justify-center bg-white">
                        <img 
                          src={book.coverImage} 
                          alt={`Cover of ${book.title}`} 
                          className="w-32 h-40 object-cover rounded"
                        />
                      </div>
                      <div className="md:w-3/4 p-4 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <h3 className="text-lg font-semibold text-gray-800">
                              {book.title}
                            </h3>
                            <div className={`text-sm px-2 py-1 rounded ${
                              isOverdue 
                                ? 'bg-red-100 text-red-800' 
                                : daysUntilDue < 3 
                                  ? 'bg-yellow-100 text-yellow-800' 
                                  : 'bg-blue-100 text-blue-800'
                            }`}>
                              {isOverdue 
                                ? 'Overdue!' 
                                : daysUntilDue < 3 
                                  ? 'Due Soon!' 
                                  : 'Borrowed'}
                            </div>
                          </div>
                          <p className="text-gray-600 mt-1">by {book.author}</p>
                          
                          <div className="mt-3 flex items-center">
                            <Clock className={`h-4 w-4 mr-1 ${
                              isOverdue 
                                ? 'text-red-500' 
                                : daysUntilDue < 3 
                                  ? 'text-yellow-500' 
                                  : 'text-gray-400'
                            }`} />
                            <span className={`text-sm ${
                              isOverdue 
                                ? 'text-red-600 font-medium' 
                                : daysUntilDue < 3 
                                  ? 'text-yellow-600 font-medium' 
                                  : 'text-gray-500'
                            }`}>
                              {isOverdue 
                                ? `Overdue by ${Math.abs(daysUntilDue)} days (Due: ${formatDueDate(book.dueDate)})` 
                                : `Due in ${daysUntilDue} days (${formatDueDate(book.dueDate)})`}
                            </span>
                          </div>
                        </div>
                        
                        <div className="mt-4 flex justify-between items-center">
                          <Link 
                            to={`/books/${book.id}`}
                            className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition duration-150"
                          >
                            View Details
                          </Link>
                          <button
                            onClick={() => handleReturnBook(book.id)}
                            disabled={actionLoading[book.id]}
                            className={`inline-flex items-center px-3 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
                              actionLoading[book.id] ? 'opacity-70 cursor-not-allowed' : ''
                            }`}
                          >
                            {actionLoading[book.id] ? (
                              <>
                                <div className="animate-spin mr-2 h-3 w-3 border-2 border-white border-t-transparent rounded-full"></div>
                                Processing...
                              </>
                            ) : (
                              'Return Book'
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        
        {/* Sidebar */}
        <div>
          {/* Account Summary */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Account Summary
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Name:</span>
                <span className="font-medium text-gray-800">{currentUser?.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium text-gray-800">{currentUser?.email}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Role:</span>
                <span className="font-medium capitalize text-gray-800">{currentUser?.role}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Books Borrowed:</span>
                <span className="font-medium text-gray-800">{borrowedBooks.length}</span>
              </div>
            </div>
          </div>
          
          {/* Library Hours */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Library Hours
            </h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Monday - Friday:</span>
                <span className="text-gray-800">9am - 8pm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Saturday:</span>
                <span className="text-gray-800">10am - 6pm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Sunday:</span>
                <span className="text-gray-800">12pm - 5pm</span>
              </div>
            </div>
            <div className="mt-4 p-3 border-l-4 border-amber-500 bg-amber-50">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0" />
                <p className="text-sm text-amber-700">
                  Remember to return books before their due date to avoid late fees.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;