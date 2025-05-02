import React from 'react';
import type { SearchResult } from '@/lib/types';

interface SearchResultsProps {
  results: SearchResult[];
  totalResults: number;
  searchTime: number;
  searchQuery: string;
  openInNewTab: boolean;
  onResultClick: (url: string) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  totalResults,
  searchTime,
  searchQuery,
  openInNewTab,
  onResultClick
}) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, url: string) => {
    e.preventDefault();
    onResultClick(url);
  };

  return (
    <div className="mt-8">
      <div className="flex items-center text-sm text-gray-500 mb-3">
        <p>About <span>{totalResults.toLocaleString()}</span> results (<span>{searchTime.toFixed(2)}</span> seconds)</p>
      </div>
      
      <div className="border-b border-gray-200 pb-2 mb-4 overflow-x-auto">
        <div className="flex space-x-6 text-sm min-w-max">
          <button className="flex items-center py-2 border-b-4 border-g-blue text-g-blue">
            <span className="material-icons text-base mr-1">search</span> All
          </button>
          <button className="flex items-center py-2 text-gray-600 hover:text-g-blue">
            <span className="material-icons text-base mr-1">image</span> Images
          </button>
          <button className="flex items-center py-2 text-gray-600 hover:text-g-blue">
            <span className="material-icons text-base mr-1">play_circle</span> Videos
          </button>
          <button className="flex items-center py-2 text-gray-600 hover:text-g-blue">
            <span className="material-icons text-base mr-1">article</span> News
          </button>
          <button className="flex items-center py-2 text-gray-600 hover:text-g-blue">
            <span className="material-icons text-base mr-1">map</span> Maps
          </button>
          <button className="flex items-center py-2 text-gray-600 hover:text-g-blue">
            <span className="material-icons text-base mr-1">more_vert</span> More
          </button>
        </div>
      </div>

      <div className="search-results divide-y divide-gray-100">
        {results.map((result, index) => (
          <div key={index} className="py-4">
            <div className="flex items-start">
              <div className="flex-1">
                <div className="text-sm text-gray-600 mb-1">{result.displayLink}</div>
                <h3 className="text-lg mb-1">
                  <a 
                    href={result.link} 
                    className="text-blue-800 hover:underline font-medium"
                    target={openInNewTab ? "_blank" : "_self"}
                    rel="noopener noreferrer"
                    onClick={(e) => handleClick(e, result.link)}
                    dangerouslySetInnerHTML={{ __html: result.title }}
                  ></a>
                </h3>
                <p className="text-sm text-gray-700 mb-1" dangerouslySetInnerHTML={{ __html: result.snippet }}></p>
              </div>
            </div>
          </div>
        ))}

        {results.length === 0 && (
          <div className="py-8 text-center">
            <p className="text-gray-500">No results found for "{searchQuery}"</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
