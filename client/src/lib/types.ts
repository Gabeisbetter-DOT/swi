export interface SearchResult {
  title: string;
  link: string;
  displayLink: string;
  snippet: string;
  position: number;
}

export interface SearchResponse {
  results: SearchResult[];
  totalResults: number;
  searchTime: number;
  query: string;
  page: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface SearchSettings {
  safeSearch: boolean;
  resultsPerPage: number;
  openInNewTab: boolean;
  theme: 'light' | 'dark' | 'system';
}
