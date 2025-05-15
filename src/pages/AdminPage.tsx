import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Users, Book, User, BookOpen, X, AlertCircle, Trash2, Edit } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useBooks } from '../context/BookContext';
import AddBookForm from '../components/AddBookForm';
import { Book as BookType } from '../types';

const AdminPage: React.FC = () => {
  const { isAuthenticated, isAdmin, currentUser } = useAuth();
  const { books, filteredBooks, addBook, removeBook } = useBooks();
  const navigate = useNavigate();
  
  const [showAddBookForm, setShowAddBookForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  
  // Stats
  const totalBooks = books.length;
  const availableBooks = books.filter(book => book.isAvailable).length;
  const checkedOutBooks = totalBooks - availableBooks;
  const totalUsers = 3; // Mock data
  
  useEffect(() => {
    // Redirect if not authenticated or not admin
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (!isAdmin) {
      navigate('/');
      return;
    }
  }, [isAuthenticated, isAdmin, navigate]);
  
  const handleAddBook = (book: Omit<BookType, 'id'>) => {
    addBook(book);
    setShowAddBookForm(false);
    setSuccessMessage('Book added successfully!');
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };
  
  const confirmDelete = (bookId: string) => {
    setDeleteConfirm(bookId);
  };
  
  const handleDeleteBook = (bookId: string) => {
    try {
      removeBook(bookId);
      setSuccessMessage('Book deleted successfully!');
      setDeleteConfirm(null);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      setErrorMessage('Failed to delete book. Please try again.');
      
      // Clear error message after 3 seconds
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    }
  };
  
  const cancelDelete = () => {
    setDeleteConfirm(null);
  };
  
  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  if (!isAuthenticated || !isAdmin) {
    return null; // Don't render anything while redirecting
  }
  
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2 font-serif">
          Admin Dashboard
        </h1>
        <p className="text-gray-600">
          Manage your library system, books, and users.
        </p>
      </div>
      
      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm leading-5 text-green-700">{successMessage}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Error Message */}
      {errorMessage && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm leading-5 text-red-700">{errorMessage}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
          <div className="p-3 rounded-full bg-indigo-100 text-indigo-500 mr-4">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Books</p>
            <p className="text-2xl font-semibold text-gray-800">{totalBooks}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
          <div className="p-3 rounded-full bg-green-100 text-green-500 mr-4">
            <Book className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Available Books</p>
            <p className="text-2xl font-semibold text-gray-800">{availableBooks}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
          <div className="p-3 rounded-full bg-amber-100 text-amber-500 mr-4">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Users</p>
            <p className="text-2xl font-semibold text-gray-800">{totalUsers}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
          <div className="p-3 rounded-full bg-red-100 text-red-500 mr-4">
            <User className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Checked Out</p>
            <p className="text-2xl font-semibold text-gray-800">{checkedOutBooks}</p>
          </div>
        </div>
      </div>
      
      {/* Add Book Form */}
      {showAddBookForm ? (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Add New Book</h2>
            <button
              onClick={() => setShowAddBookForm(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <AddBookForm 
            onAddBook={handleAddBook} 
            onCancel={() => setShowAddBookForm(false)} 
          />
        </div>
      ) : (
        <div className="mb-8">
          <button
            onClick={() => setShowAddBookForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Book
          </button>
        </div>
      )}
      
      {/* Book Management Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Book Management</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Book Details
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Author
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Published
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBooks.map(book => (
                <tr key={book.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-8 flex-shrink-0 mr-3">
                        <img 
                          className="h-10 w-8 object-cover" 
                          src={book.coverImage} 
                          alt={`Cover of ${book.title}`} 
                        />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{book.title}</div>
                        <div className="text-xs text-gray-500">ISBN: {book.isbn}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{book.author}</div>
                    <div className="text-xs text-gray-500">{book.genre}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatDate(book.publishedDate)}</div>
                    <div className="text-xs text-gray-500">{book.publisher}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {book.isAvailable ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Available
                      </span>
                    ) : (
                      <div>
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          Checked Out
                        </span>
                        {book.borrowedBy && book.dueDate && (
                          <div className="text-xs text-gray-500 mt-1">
                            Due: {new Date(book.dueDate).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {deleteConfirm === book.id ? (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleDeleteBook(book.id)}
                          className="text-red-600 hover:text-red-900 flex items-center"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={cancelDelete}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-3">
                        <button
                          className="text-indigo-600 hover:text-indigo-900 flex items-center"
                          title="Edit Book"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => confirmDelete(book.id)}
                          className="text-red-600 hover:text-red-900 flex items-center"
                          title="Delete Book"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredBooks.length === 0 && (
          <div className="p-6 text-center">
            <p className="text-gray-500">No books found. Add some books to your library.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;