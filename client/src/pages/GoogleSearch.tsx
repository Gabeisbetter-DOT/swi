import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { SearchResult, SearchResponse } from '@shared/schema';

const GoogleSearch: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [useIframe, setUseIframe] = useState<boolean>(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  // Regular search API result states (only used if iframe fails)
  const [results, setResults] = useState<SearchResult[]>([]);
  const [totalResults, setTotalResults] = useState<number>(0);
  const [searchTime, setSearchTime] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);
  const [hasPreviousPage, setHasPreviousPage] = useState<boolean>(false);
  
  // Get query from URL on load
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q');
    const page = urlParams.get('p');
    
    if (query) {
      setSearchQuery(query);
      if (page) {
        setCurrentPage(parseInt(page, 10));
      }
      
      // If using the iframe method, don't call the regular search API
      if (useIframe) {
        performIframeSearch(query, page ? parseInt(page, 10) : 1);
      } else {
        performApiSearch(query, page ? parseInt(page, 10) : 1);
      }
    }
  }, [useIframe]);
  
  // Handle iframe load errors
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data === 'iframe-load-error') {
        console.log('Iframe loading failed, switching to API search');
        setUseIframe(false);
        if (searchQuery) {
          performApiSearch(searchQuery, currentPage);
        }
      }
    };
    
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [searchQuery, currentPage]);
  
  // Perform search using iframe proxy
  const performIframeSearch = (query: string, page: number = 1) => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    setError(null);
    setHasSearched(true);
    
    // Update URL with search query (for browser history)
    const url = new URL(window.location.href);
    url.searchParams.set('q', query);
    url.searchParams.set('p', page.toString());
    window.history.pushState({}, '', url);
    
    // Update iframe source
    if (iframeRef.current) {
      iframeRef.current.src = `/api/proxysearch?q=${encodeURIComponent(query)}&p=${page}`;
    }
    
    // The iframe onload handler will set isLoading to false
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };
  
  // Fallback: Perform search using our API
  const performApiSearch = async (query: string, page: number = 1) => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    setError(null);
    setHasSearched(true);
    
    try {
      // Update URL with search query
      const url = new URL(window.location.href);
      url.searchParams.set('q', query);
      url.searchParams.set('p', page.toString());
      window.history.pushState({}, '', url);
      
      // Call our server API
      const response = await axios.get<SearchResponse>(`/api/search?q=${encodeURIComponent(query)}&p=${page}`);
      
      // Update state with results
      setResults(response.data.results);
      setTotalResults(response.data.totalResults);
      setSearchTime(response.data.searchTime);
      setCurrentPage(response.data.page);
      setHasNextPage(response.data.hasNextPage);
      setHasPreviousPage(response.data.hasPreviousPage);
      
      // Save to search history if user is logged in
      try {
        await axios.post('/api/search/history', {
          query,
          resultsCount: response.data.totalResults,
          searchTime: response.data.searchTime
        });
      } catch (historyError) {
        // Silently fail if user is not logged in or history can't be saved
        console.log('Could not save to search history:', historyError);
      }
    } catch (err) {
      console.error('Search error:', err);
      setError('An error occurred while searching. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      if (useIframe) {
        performIframeSearch(searchQuery, 1);
      } else {
        performApiSearch(searchQuery, 1);
      }
    }
  };
  
  // Handle fallback pagination
  const handlePageChange = (newPage: number) => {
    if (useIframe) {
      performIframeSearch(searchQuery, newPage);
    } else {
      performApiSearch(searchQuery, newPage);
    }
    window.scrollTo(0, 0);
  };
  
  // Toggle between iframe and API search modes
  const toggleSearchMode = () => {
    setUseIframe(!useIframe);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header with gradient */}
      <header className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white py-4 shadow-md">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-medium mb-2 sm:mb-0">GoogleSearch Proxy</h1>
          <div className="flex gap-4 items-center">
            <p className="text-sm text-white/80">Search without leaving the site</p>
            <a 
              href="/search" 
              className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded transition-colors"
            >
              Advanced Search
            </a>
          </div>
        </div>
      </header>

      {/* Search Form */}
      <div className={`w-full ${hasSearched ? 'bg-gray-100 py-3 border-b border-gray-200' : 'flex-grow flex items-center justify-center'}`}>
        <div className={`max-w-3xl mx-auto px-4 ${hasSearched ? '' : 'w-full'}`}>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Google..."
              className="flex-grow px-4 py-3 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <button
              type="submit"
              className="px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Search'}
            </button>
          </form>
        </div>
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="flex-grow flex flex-col items-center p-8">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 max-w-lg text-left">
            <h3 className="text-lg font-medium text-yellow-800">Search Error</h3>
            <p className="text-yellow-700 mt-1">{error}</p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => useIframe ? performIframeSearch(searchQuery, currentPage) : performApiSearch(searchQuery, currentPage)}
              className="px-5 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Try Again
            </button>
            <button
              onClick={toggleSearchMode}
              className="px-5 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              Try {useIframe ? 'API Search' : 'Iframe Mode'}
            </button>
          </div>
        </div>
      )}
      
      {/* Iframe for Google search results */}
      {useIframe && !isLoading && !error && hasSearched && (
        <div className="flex-grow w-full bg-white">
          <div className="flex flex-col h-full">
            {/* Iframe toolbar */}
            <div className="bg-gray-100 p-2 border-b border-gray-200 flex justify-between items-center">
              <div className="text-sm text-gray-500">
                Viewing Google search results directly
              </div>
              <button 
                onClick={toggleSearchMode}
                className="px-3 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                Switch to API Mode
              </button>
            </div>
            
            {/* The actual iframe */}
            <iframe
              ref={iframeRef}
              src={hasSearched ? `/api/proxysearch?q=${encodeURIComponent(searchQuery)}&p=${currentPage}` : ''}
              className="w-full flex-grow border-0 h-[85vh]"
              title="Google Search Results"
              sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
              onLoad={() => setIsLoading(false)}
            ></iframe>
          </div>
        </div>
      )}

      {/* API Search Results (fallback) */}
      {!useIframe && !isLoading && !error && hasSearched && (
        <div className="flex-grow w-full bg-white">
          <div className="max-w-4xl mx-auto px-4 py-6">
            {/* Fallback mode notice */}
            <div className="mb-4 bg-blue-50 border border-blue-200 p-3 rounded flex justify-between items-center">
              <span className="text-sm text-blue-700">
                Using API search mode. Results may differ from Google's original layout.
              </span>
              <button 
                onClick={toggleSearchMode}
                className="px-3 py-1 text-xs bg-blue-200 text-blue-800 rounded hover:bg-blue-300"
              >
                Try Iframe Mode
              </button>
            </div>
            
            {/* Stats */}
            <div className="text-sm text-gray-500 mb-4">
              About {totalResults.toLocaleString()} results ({searchTime.toFixed(2)} seconds)
            </div>
            
            {/* Results list */}
            <div className="space-y-8">
              {results.map((result, index) => (
                <div key={index} className="result">
                  <div className="text-sm text-gray-500 mb-1">{result.displayLink}</div>
                  <h3 className="text-xl font-medium text-blue-600 hover:underline mb-1">
                    <a 
                      href={`/api/visit?url=${encodeURIComponent(result.link)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {result.title}
                    </a>
                  </h3>
                  <p className="text-sm text-gray-700">{result.snippet}</p>
                </div>
              ))}
            </div>
            
            {/* Pagination */}
            {results.length > 0 && (
              <div className="flex justify-center mt-10 space-x-2">
                {hasPreviousPage && (
                  <button 
                    onClick={() => handlePageChange(currentPage - 1)} 
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded border border-gray-300"
                  >
                    Previous
                  </button>
                )}
                <span className="px-4 py-2 bg-blue-50 text-blue-800 font-medium rounded border border-blue-200">
                  Page {currentPage}
                </span>
                {hasNextPage && (
                  <button 
                    onClick={() => handlePageChange(currentPage + 1)} 
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded border border-gray-300"
                  >
                    Next
                  </button>
                )}
              </div>
            )}
            
            {/* No results */}
            {results.length === 0 && hasSearched && !isLoading && (
              <div className="text-center py-10">
                <p className="text-lg text-gray-700 mb-2">No results found for "{searchQuery}"</p>
                <p className="text-gray-500">Try different keywords or check your spelling.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* No results state */}
      {!hasSearched && (
        <div className="flex-grow flex flex-col items-center justify-center text-center text-gray-500 max-w-lg mx-auto px-4 pb-20">
          <div className="text-8xl mb-6 font-bold">
            <span className="text-blue-500">G</span>
            <span className="text-red-500">o</span>
            <span className="text-yellow-500">o</span>
            <span className="text-blue-500">g</span>
            <span className="text-green-500">l</span>
            <span className="text-red-500">e</span>
          </div>
          <p className="mb-6 text-lg">Enter your search query above to start searching.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md">
            <div className="bg-white p-4 rounded-lg shadow border border-gray-200 hover:shadow-md transition-shadow">
              <h3 className="font-medium text-lg mb-2 text-blue-600">No Redirects</h3>
              <p className="text-sm text-gray-600">Results display directly within this page.</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border border-gray-200 hover:shadow-md transition-shadow">
              <h3 className="font-medium text-lg mb-2 text-blue-600">Fast Access</h3>
              <p className="text-sm text-gray-600">Bypass network restrictions with our proxy.</p>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-3 text-center text-xs text-gray-500">
        <p>This is an educational project and is not affiliated with Google Inc.</p>
      </footer>
    </div>
  );
};

export default GoogleSearch;