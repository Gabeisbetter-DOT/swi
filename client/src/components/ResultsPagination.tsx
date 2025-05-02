import React, { useEffect } from 'react';

interface ResultsPaginationProps {
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  onPageChange: (page: number) => void;
}

const ResultsPagination: React.FC<ResultsPaginationProps> = ({
  currentPage,
  hasNextPage,
  hasPreviousPage,
  onPageChange
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt+N for next page
      if (e.altKey && e.key === 'n' && hasNextPage) {
        e.preventDefault();
        onPageChange(currentPage + 1);
      }
      
      // Alt+P for previous page
      if (e.altKey && e.key === 'p' && hasPreviousPage) {
        e.preventDefault();
        onPageChange(currentPage - 1);
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, hasNextPage, hasPreviousPage, onPageChange]);

  // Calculate page buttons to display (current page and +/- 2 pages)
  const pages = [];
  const maxPagesToShow = 5;
  const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
  const endPage = Math.min(startPage + maxPagesToShow - 1, currentPage + 5); // Assuming max 5 pages for simplicity
  
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="mt-8 flex justify-center">
      <div className="inline-flex rounded-md shadow-sm" role="group" aria-label="Pagination">
        <button 
          type="button" 
          className="px-4 py-2 text-sm font-medium text-blue-700 bg-white border border-gray-200 rounded-l-lg hover:bg-gray-100 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPreviousPage}
        >
          Previous
        </button>
        
        {pages.map(page => (
          <button 
            key={page} 
            type="button" 
            className={`px-4 py-2 text-sm font-medium ${
              page === currentPage
                ? 'text-white bg-blue-700 border border-blue-700 hover:bg-blue-800'
                : 'text-blue-700 bg-white border-t border-b border-gray-200 hover:bg-gray-100'
            } focus:outline-none`}
            onClick={() => page !== currentPage && onPageChange(page)}
          >
            {page}
          </button>
        ))}
        
        <button 
          type="button" 
          className="px-4 py-2 text-sm font-medium text-blue-700 bg-white border border-gray-200 rounded-r-lg hover:bg-gray-100 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNextPage}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ResultsPagination;
