import React, { useState } from 'react';
import { Book } from '../types';

interface AddBookFormProps {
  onAddBook: (book: Omit<Book, 'id'>) => void;
  onCancel: () => void;
}

const AddBookForm: React.FC<AddBookFormProps> = ({ onAddBook, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    description: '',
    coverImage: '',
    genre: '',
    publishedDate: '',
    publisher: '',
    pages: 0,
    language: 'English',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'pages' ? parseInt(value) || 0 : value
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.author.trim()) newErrors.author = 'Author is required';
    if (!formData.isbn.trim()) newErrors.isbn = 'ISBN is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.coverImage.trim()) newErrors.coverImage = 'Cover image URL is required';
    if (!formData.genre.trim()) newErrors.genre = 'Genre is required';
    if (!formData.publishedDate) newErrors.publishedDate = 'Published date is required';
    if (!formData.publisher.trim()) newErrors.publisher = 'Publisher is required';
    if (!formData.pages) newErrors.pages = 'Number of pages is required';

    // Validate ISBN format (basic check)
    if (formData.isbn && !(/^[0-9-]{10,17}$/.test(formData.isbn))) {
      newErrors.isbn = 'ISBN must be in a valid format';
    }

    // Validate URL format for cover image
    if (formData.coverImage && !formData.coverImage.startsWith('http')) {
      newErrors.coverImage = 'Cover image must be a valid URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onAddBook({
        ...formData,
        isAvailable: true,
      });
    }
  };

  const genres = ['Fiction', 'Science Fiction', 'Fantasy', 'Romance', 'Mystery', 'Biography', 'History', 'Self-Help'];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New Book</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
          </div>
          
          {/* Author */}
          <div>
            <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
              Author <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="author"
              name="author"
              value={formData.author}
              onChange={handleChange}
              className={`w-full p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${
                errors.author ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.author && <p className="mt-1 text-sm text-red-500">{errors.author}</p>}
          </div>
          
          {/* ISBN */}
          <div>
            <label htmlFor="isbn" className="block text-sm font-medium text-gray-700 mb-1">
              ISBN <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="isbn"
              name="isbn"
              value={formData.isbn}
              onChange={handleChange}
              placeholder="e.g., 978-3-16-148410-0"
              className={`w-full p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${
                errors.isbn ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.isbn && <p className="mt-1 text-sm text-red-500">{errors.isbn}</p>}
          </div>
          
          {/* Genre */}
          <div>
            <label htmlFor="genre" className="block text-sm font-medium text-gray-700 mb-1">
              Genre <span className="text-red-500">*</span>
            </label>
            <select
              id="genre"
              name="genre"
              value={formData.genre}
              onChange={handleChange}
              className={`w-full p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${
                errors.genre ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select a genre</option>
              {genres.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
            {errors.genre && <p className="mt-1 text-sm text-red-500">{errors.genre}</p>}
          </div>
          
          {/* Published Date */}
          <div>
            <label htmlFor="publishedDate" className="block text-sm font-medium text-gray-700 mb-1">
              Published Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="publishedDate"
              name="publishedDate"
              value={formData.publishedDate}
              onChange={handleChange}
              className={`w-full p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${
                errors.publishedDate ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.publishedDate && <p className="mt-1 text-sm text-red-500">{errors.publishedDate}</p>}
          </div>
          
          {/* Publisher */}
          <div>
            <label htmlFor="publisher" className="block text-sm font-medium text-gray-700 mb-1">
              Publisher <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="publisher"
              name="publisher"
              value={formData.publisher}
              onChange={handleChange}
              className={`w-full p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${
                errors.publisher ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.publisher && <p className="mt-1 text-sm text-red-500">{errors.publisher}</p>}
          </div>
          
          {/* Pages */}
          <div>
            <label htmlFor="pages" className="block text-sm font-medium text-gray-700 mb-1">
              Pages <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="pages"
              name="pages"
              value={formData.pages || ''}
              onChange={handleChange}
              min="1"
              className={`w-full p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${
                errors.pages ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.pages && <p className="mt-1 text-sm text-red-500">{errors.pages}</p>}
          </div>
          
          {/* Language */}
          <div>
            <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
              Language <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="language"
              name="language"
              value={formData.language}
              onChange={handleChange}
              className={`w-full p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${
                errors.language ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.language && <p className="mt-1 text-sm text-red-500">{errors.language}</p>}
          </div>
          
          {/* Cover Image */}
          <div className="md:col-span-2">
            <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700 mb-1">
              Cover Image URL <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="coverImage"
              name="coverImage"
              value={formData.coverImage}
              onChange={handleChange}
              placeholder="https://example.com/cover.jpg"
              className={`w-full p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${
                errors.coverImage ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.coverImage && <p className="mt-1 text-sm text-red-500">{errors.coverImage}</p>}
          </div>
          
          {/* Description */}
          <div className="md:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className={`w-full p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Add Book
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBookForm;