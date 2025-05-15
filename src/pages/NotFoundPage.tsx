import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpenCheck, ArrowLeft } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-12">
      <BookOpenCheck className="h-20 w-20 text-indigo-500 mb-6" />
      <h1 className="text-4xl font-bold text-gray-800 mb-3 font-serif">404 - Page Not Found</h1>
      <p className="text-lg text-gray-600 mb-8 max-w-md">
        Sorry, the page you are looking for might have been removed or is temporarily unavailable.
      </p>
      <Link
        to="/"
        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Home
      </Link>
    </div>
  );
};

export default NotFoundPage;