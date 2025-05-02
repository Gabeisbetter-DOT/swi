import { SearchResult, SearchResponse } from '../shared/schema';

// Parse Google search results from HTML
export function parseGoogleResults(html: string, query: string, page: number, itemsPerPage: number): SearchResponse {
  try {
    // Extract search time
    const searchTimeMatch = html.match(/About ([\d,]+) results \(([\d.]+) seconds\)/);
    const totalResultsStr = searchTimeMatch?.[1]?.replace(/,/g, '') || '0';
    const searchTimeStr = searchTimeMatch?.[2] || '0';
    
    const totalResults = parseInt(totalResultsStr, 10) || 0;
    const searchTime = parseFloat(searchTimeStr) || 0;
    
    // Extract search results
    const results: SearchResult[] = [];
    
    // Use regex to find result blocks
    const resultBlockRegex = /<div class="g".*?<h3.*?<a href="(.*?)".*?>(.*?)<\/a>.*?<div class="VwiC3b".*?>(.*?)<\/div>/gs;
    let match;
    
    while ((match = resultBlockRegex.exec(html)) !== null) {
      const link = match[1];
      const title = match[2].replace(/<\/?[^>]+(>|$)/g, "");
      const snippet = match[3].replace(/<\/?[^>]+(>|$)/g, "");
      
      // Extract display link from the URL
      const urlObj = new URL(link);
      const displayLink = urlObj.hostname;
      
      results.push({
        title,
        link,
        displayLink,
        snippet,
        position: results.length + 1
      });
      
      // Limit to requested number of results
      if (results.length >= itemsPerPage) break;
    }
    
    // No results found - try a different parsing approach
    if (results.length === 0) {
      const simpleResultRegex = /<a href="(https?:\/\/.*?)".*?<h3.*?>(.*?)<\/h3>.*?<span.*?>(.*?)<\/span>/gs;
      
      while ((match = simpleResultRegex.exec(html)) !== null) {
        const link = match[1];
        const title = match[2].replace(/<\/?[^>]+(>|$)/g, "");
        const snippet = match[3].replace(/<\/?[^>]+(>|$)/g, "");
        
        if (!link.startsWith('https://www.google.com')) {
          // Extract display link from the URL
          let displayLink;
          try {
            const urlObj = new URL(link);
            displayLink = urlObj.hostname;
          } catch (e) {
            displayLink = link.split('/')[2] || link;
          }
          
          results.push({
            title,
            link,
            displayLink,
            snippet,
            position: results.length + 1
          });
          
          if (results.length >= itemsPerPage) break;
        }
      }
    }
    
    return {
      results,
      totalResults,
      searchTime,
      query,
      page,
      hasNextPage: page * itemsPerPage < totalResults,
      hasPreviousPage: page > 1
    };
  } catch (error) {
    console.error('Error parsing Google results:', error);
    
    // Return empty results on error
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
