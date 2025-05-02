import React, { useState, useRef, useEffect } from 'react';

interface SearchBoxProps {
  onSearch: (query: string) => void;
  initialQuery?: string;
  isSearching: boolean;
}

const SearchBox: React.FC<SearchBoxProps> = ({ onSearch, initialQuery = '', isSearching }) => {
  const [query, setQuery] = useState(initialQuery);
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle search form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isSearching) {
      onSearch(query.trim());
    }
  };

  // Setup keyboard shortcut for focusing search input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // '/' key focuses the search input
      if (e.key === '/' && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
      
      // 'Escape' key clears search if focused
      if (e.key === 'Escape' && document.activeElement === inputRef.current) {
        setQuery('');
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <form id="searchForm" className="w-full max-w-2xl relative" onSubmit={handleSubmit}>
      <div className="relative flex w-full">
        <input 
          ref={inputRef}
          type="text" 
          className="w-full px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:border-g-blue focus:ring-1 focus:ring-g-blue shadow-sm" 
          placeholder="Search for anything..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoComplete="off"
          aria-label="Search input"
          disabled={isSearching}
        />
        <button 
          type="submit"
          className="absolute right-1 top-1/2 -translate-y-1/2 p-2 text-g-blue rounded-full hover:bg-gray-100"
          aria-label="Search"
          disabled={isSearching}
        >
          <span className="material-icons">search</span>
        </button>
        <button 
          type="button"
          className="absolute right-12 top-1/2 -translate-y-1/2 p-2 text-g-blue rounded-full hover:bg-gray-100"
          aria-label="Voice search"
          disabled={isSearching}
        >
          <span className="material-icons">mic</span>
        </button>
      </div>
    </form>
  );
};

export default SearchBox;
