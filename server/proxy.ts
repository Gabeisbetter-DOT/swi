import axios from 'axios';
import { parseGoogleResults } from './parser';
import { SearchResponse } from '../shared/schema';

// Constants for search
const GOOGLE_SEARCH_URL = 'https://www.google.com/search';
const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Safari/605.1.15',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:94.0) Gecko/20100101 Firefox/94.0'
];

// Helper to get a random user agent
function getRandomUserAgent(): string {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
}

/**
 * Performs a Google search and returns parsed results
 */
export async function searchGoogle(
  query: string,
  page: number = 1,
  resultsPerPage: number = 10,
  safeSearch: boolean = true
): Promise<SearchResponse> {
  try {
    // Calculate start index (Google uses 0-based indexing)
    const start = (page - 1) * resultsPerPage;
    
    // Configure request
    const params = new URLSearchParams({
      q: query,
      start: start.toString(),
      num: resultsPerPage.toString(),
      safe: safeSearch ? 'active' : 'off',
      hl: 'en',  // Language: English
      ie: 'UTF-8',
      oe: 'UTF-8'
    });
    
    // Prepare headers to mimic a real browser
    const headers = {
      'User-Agent': getRandomUserAgent(),
      'Accept': 'text/html,application/xhtml+xml,application/xml',
      'Accept-Language': 'en-US,en;q=0.9',
      'Connection': 'keep-alive',
      'Referer': 'https://www.google.com/'
    };
    
    // Make the request with a timeout
    const response = await axios.get(`${GOOGLE_SEARCH_URL}?${params.toString()}`, {
      headers,
      timeout: 5000
    });
    
    // Parse the HTML response
    return parseGoogleResults(response.data, query, page, resultsPerPage);
  } catch (error) {
    console.error('Error during Google search:', error);
    
    // Return empty results with error
    return {
      results: [],
      totalResults: 0,
      searchTime: 0,
      query,
      page,
      hasNextPage: false,
      hasPreviousPage: page > 1
    };
  }
}

/**
 * Proxies a Google search directly - this version allows iframe embedding
 */
export async function proxyGoogleSearch(
  query: string,
  page: number = 1,
  resultsPerPage: number = 10,
  safeSearch: boolean = true
): Promise<{ content: string; contentType: string }> {
  try {
    // Calculate start index
    const start = (page - 1) * resultsPerPage;
    
    // Configure request
    const params = new URLSearchParams({
      q: query,
      start: start.toString(),
      num: resultsPerPage.toString(),
      safe: safeSearch ? 'active' : 'off',
      hl: 'en',
      ie: 'UTF-8',
      oe: 'UTF-8'
    });
    
    // Prepare headers to mimic a real browser
    const headers = {
      'User-Agent': getRandomUserAgent(),
      'Accept': 'text/html,application/xhtml+xml,application/xml',
      'Accept-Language': 'en-US,en;q=0.9',
      'Connection': 'keep-alive',
      'Referer': 'https://www.google.com/'
    };
    
    // Make the request
    const response = await axios.get(`${GOOGLE_SEARCH_URL}?${params.toString()}`, {
      headers,
      timeout: 5000,
      responseType: 'arraybuffer'
    });
    
    // Get content type
    const contentType = response.headers['content-type'] || 'text/html';
    
    let content = response.data.toString('utf-8');
    
    // Modify the HTML to make it work in an iframe
    if (contentType.includes('text/html')) {
      // Replace external links with our proxy
      content = content.replace(
        /href="(https?:\/\/[^"]+)"/g, 
        'href="/api/visit?url=$1"'
      );
      
      // Fix form actions
      content = content.replace(
        /action="(https?:\/\/[^"]+)"/g, 
        'action="/api/proxy?url=$1"'
      );
      
      // Fix Google search form
      content = content.replace(
        /<form[^>]*action="\/search"[^>]*>/g,
        (match) => match.replace('action="/search"', `action="/api/proxysearch"`)
      );
      
      // Add base tag for relative URLs
      content = content.replace(
        /<head>/i, 
        `<head><base href="https://www.google.com">`
      );
      
      // Add CSS to make it look better in iframe
      content = content.replace(
        /<\/head>/i,
        `<style>
          body { max-width: 100%; overflow-x: hidden; }
          #searchform { max-width: 100%; }
          .g { width: 100%; max-width: 600px; }
        </style></head>`
      );
    }
    
    return { content, contentType };
  } catch (error) {
    console.error('Error proxying Google search:', error);
    
    // Return an error page
    const errorHTML = `
      <html>
        <head>
          <title>Search Error</title>
          <style>
            body { font-family: sans-serif; max-width: 800px; margin: 0 auto; padding: 2rem; }
            .error { background: #fee; border: 1px solid #f99; padding: 1rem; border-radius: 4px; }
          </style>
        </head>
        <body>
          <h1>Search Error</h1>
          <div class="error">
            <p>There was an error retrieving search results:</p>
            <p>${error instanceof Error ? error.message : 'Unknown error'}</p>
          </div>
          <p><a href="/">&larr; Return to search</a></p>
        </body>
      </html>
    `;
    
    return { content: errorHTML, contentType: 'text/html' };
  }
}

/**
 * Fetches a webpage and returns it with modified links to route through our proxy
 */
export async function fetchWebpage(url: string): Promise<{ content: string; contentType: string }> {
  try {
    // Check if URL is valid
    new URL(url);
    
    // Make the request
    const response = await axios.get(url, {
      headers: {
        'User-Agent': getRandomUserAgent(),
      },
      responseType: 'arraybuffer',
      maxRedirects: 5,
      timeout: 10000
    });
    
    // Get content type
    const contentType = response.headers['content-type'] || 'text/html';
    
    // Only process HTML content
    if (contentType.includes('text/html')) {
      let content = response.data.toString('utf-8');
      
      // Rewrite links to stay within our proxy
      content = content.replace(
        /href="(https?:\/\/[^"]+)"/g, 
        'href="/api/visit?url=$1"'
      );
      
      content = content.replace(
        /action="(https?:\/\/[^"]+)"/g, 
        'action="/api/visit?url=$1"'
      );
      
      // Add base tag to handle relative URLs
      content = content.replace(
        /<head>/i, 
        `<head><base href="${url}">`
      );
      
      return { content, contentType };
    }
    
    // For non-HTML content, return as-is
    return { 
      content: response.data.toString('utf-8'), 
      contentType 
    };
  } catch (error) {
    console.error('Error fetching webpage:', error);
    throw error;
  }
}
