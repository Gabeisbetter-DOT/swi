import React, { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import ResearchLogo from '@/components/ResearchLogo';
import SearchBox from '@/components/SearchBox';
import LoadingSpinner from '@/components/LoadingSpinner';
import SearchResults from '@/components/SearchResults';
import ResultsPagination from '@/components/ResultsPagination';
import Footer from '@/components/Footer';
import SettingsModal from '@/components/SettingsModal';
import HelpModal from '@/components/HelpModal';
import type { SearchResponse, SearchSettings } from '@/lib/types';

const Home: React.FC = () => {
  const [location, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [settings, setSettings] = useState<SearchSettings>({
    safeSearch: true,
    resultsPerPage: 20,
    openInNewTab: false,
    theme: 'light'
  });

  // Get query params on load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q');
    const p = params.get('p');
    
    if (q) setSearchQuery(q);
    if (p) setPage(parseInt(p, 10) || 1);
    
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('searchSettings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (e) {
        console.error('Failed to parse saved settings', e);
      }
    }
  }, []);

  // Fetch search results
  const { 
    data: searchResponse, 
    isLoading, 
    error, 
    refetch 
  } = useQuery<SearchResponse>({
    queryKey: [`/api/search?q=${encodeURIComponent(searchQuery)}&p=${page}&num=${settings.resultsPerPage}&safe=${settings.safeSearch ? '1' : '0'}`],
    enabled: !!searchQuery,
  });

  // Handle search from form
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setPage(1);
    
    // Update URL with search query
    const params = new URLSearchParams();
    params.set('q', query);
    params.set('p', '1');
    setLocation(`/?${params.toString()}`);
  }, [setLocation]);

  // Handle page change
  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
    
    // Update URL with new page
    const params = new URLSearchParams(window.location.search);
    params.set('p', newPage.toString());
    setLocation(`/?${params.toString()}`);
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [setLocation]);

  // Handle result click - intercept and manage
  const handleResultClick = useCallback((url: string) => {
    if (settings.openInNewTab) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      // Wrap external URLs to stay within the app
      // This creates a proxy path to route through our backend
      window.location.href = `/api/visit?url=${encodeURIComponent(url)}`;
    }
  }, [settings.openInNewTab]);

  // Save settings
  const saveSettings = useCallback((newSettings: SearchSettings) => {
    setSettings(newSettings);
    localStorage.setItem('searchSettings', JSON.stringify(newSettings));
    
    // Refetch results if needed
    if (
      newSettings.safeSearch !== settings.safeSearch || 
      newSettings.resultsPerPage !== settings.resultsPerPage
    ) {
      refetch();
    }
  }, [settings, refetch]);

  // Check if we're on the results page (has search query)
  const isResultsPage = !!searchQuery;
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="w-full px-4 py-3 flex items-center justify-between border-b border-gray-200">
        <h1 className="text-lg font-medium sm:text-xl">Research Portal</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowHelpModal(true)}
            className="p-2 rounded-full hover:bg-gray-100"
            aria-label="Help"
          >
            <span className="material-icons">help_outline</span>
          </button>
          <button
            onClick={() => setShowSettingsModal(true)}
            className="p-2 rounded-full hover:bg-gray-100"
            aria-label="Settings"
          >
            <span className="material-icons">settings</span>
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 pb-10 w-full flex-grow">
        <div className={`flex flex-col items-center ${isResultsPage ? 'mt-6' : 'mt-14 sm:mt-24'}`}>
          {/* Always show logo, smaller on results page */}
          {isResultsPage ? (
            <div className="w-full flex justify-center mb-4">
              <div className="scale-75 origin-center">
                <ResearchLogo />
              </div>
            </div>
          ) : (
            <ResearchLogo />
          )}
          
          {/* Search box */}
          <SearchBox 
            onSearch={handleSearch} 
            initialQuery={searchQuery}
            isSearching={isLoading}
          />
          
          {/* Loading indicator */}
          {isLoading && <LoadingSpinner />}
          
          {/* Error message */}
          {error && !isLoading && (
            <div className="mt-8 text-center text-red-500">
              <p>Error loading search results. Please try again later.</p>
            </div>
          )}
          
          {/* Search results */}
          {!isLoading && searchResponse && (
            <>
              <SearchResults 
                results={searchResponse.results}
                totalResults={searchResponse.totalResults}
                searchTime={searchResponse.searchTime}
                searchQuery={searchResponse.query}
                openInNewTab={settings.openInNewTab}
                onResultClick={handleResultClick}
              />
              
              {searchResponse.results.length > 0 && (
                <ResultsPagination 
                  currentPage={searchResponse.page}
                  hasNextPage={searchResponse.hasNextPage}
                  hasPreviousPage={searchResponse.hasPreviousPage}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <Footer />
      
      {/* Modals */}
      <SettingsModal 
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        settings={settings}
        onSaveSettings={saveSettings}
      />
      
      <HelpModal 
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
      />
    </div>
  );
};

export default Home;
