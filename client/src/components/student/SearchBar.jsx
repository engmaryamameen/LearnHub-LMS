import React, { useState } from "react";
import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom";

const SearchBar = ({data}) => {
  const navigate = useNavigate();
  const [input, setInput] = useState(data ? data : '');
  const [isFocused, setIsFocused] = useState(false);

  const onSearchHandler = (e) => {
    e.preventDefault();
    if (input.trim()) {
      navigate('/course-list/' + input);
    }
  }

  return (
    <div className="w-full">
      <form onSubmit={onSearchHandler} className="relative group">
        {/* Enhanced Search Container */}
        <div className={`
          relative w-full h-16 flex items-center 
          bg-white/80 backdrop-blur-md border-2 rounded-2xl shadow-lg
          transition-all duration-300 ease-in-out
          ${isFocused 
            ? 'border-blue-500 shadow-blue-500/20 shadow-xl' 
            : 'border-gray-200 hover:border-gray-300 hover:shadow-xl'
          }
        `}>
          {/* Search Icon */}
          <div className="flex items-center justify-center w-16 h-full">
            <svg
              className={`w-6 h-6 transition-colors duration-200 ${
                isFocused ? 'text-blue-600' : 'text-gray-400'
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Input Field */}
          <input
            onChange={e => setInput(e.target.value)}
            value={input}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            type="text"
            placeholder="Search for courses, skills, or instructors..."
            className="flex-1 h-full bg-transparent outline-none text-gray-700 placeholder-gray-500 text-lg font-medium pr-4"
          />

          {/* Search Button */}
          <button
            type="submit"
            className={`
              relative h-12 mx-2 px-8 rounded-xl font-semibold text-white
              bg-gradient-to-r from-blue-600 to-indigo-600
              hover:from-blue-700 hover:to-indigo-700
              transform hover:scale-105 active:scale-95
              transition-all duration-200 ease-in-out
              shadow-lg hover:shadow-xl
              ${input.trim() ? 'opacity-100' : 'opacity-70'}
            `}
          >
            <span className="relative z-10">Search</span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
          </button>
        </div>

        {/* Popular Searches */}
        {isFocused && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white/90 backdrop-blur-md border border-gray-200 rounded-xl shadow-lg z-50 p-4">
            <p className="text-sm font-medium text-gray-700 mb-3">Popular searches:</p>
            <div className="flex flex-wrap gap-2">
              {['JavaScript', 'Python', 'React', 'Design', 'Business', 'Marketing'].map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => {
                    setInput(term);
                    navigate('/course-list/' + term);
                  }}
                  className="px-3 py-1 bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-700 rounded-full text-sm font-medium transition-colors duration-200"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}
      </form>

      {/* Search Suggestions */}
      <div className="mt-4 flex flex-wrap justify-center gap-4 text-sm text-gray-500">
        <div className="flex items-center space-x-1">
          <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>500+ courses available</span>
        </div>
        <div className="flex items-center space-x-1">
          <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>Instant access</span>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
