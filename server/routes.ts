import type { Express, Request, Response } from 'express';
import { createServer, type Server } from 'http';
import { searchGoogle, fetchWebpage, proxyGoogleSearch } from './proxy';
import { searchResponseSchema, insertHistorySchema, insertSettingsSchema } from '@shared/schema';
import { storage } from './storage';

export async function registerRoutes(app: Express): Promise<Server> {
  // --- User Authentication Routes ---
  
  // Register endpoint
  app.post('/api/auth/register', async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
      }
      
      // Check if username exists
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(409).json({ message: 'Username already exists' });
      }
      
      // Create user
      const user = await storage.createUser({ username, password });
      
      // Initialize default settings for the user
      await storage.createSearchSettings({
        userId: user.id,
        safeSearch: true,
        resultsPerPage: 10,
        openInNewTab: false,
        theme: 'light'
      });
      
      res.status(201).json({ 
        message: 'User registered successfully',
        user: { id: user.id, username: user.username }
      });
    } catch (error) {
      console.error('Error in register route:', error);
      res.status(500).json({ 
        message: 'An error occurred during registration',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
  
  // Login endpoint
  app.post('/api/auth/login', async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
      }
      
      // Find user
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      // Validate password (in a real app, you'd use bcrypt to compare hashed passwords)
      if (user.password !== password) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      // Set user in session (in a real app, you'd use JWT tokens or proper sessions)
      if (req.session) {
        req.session.userId = user.id;
      }
      
      res.json({ 
        message: 'Login successful',
        user: { id: user.id, username: user.username }
      });
    } catch (error) {
      console.error('Error in login route:', error);
      res.status(500).json({ 
        message: 'An error occurred during login',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
  
  // Get current user
  app.get('/api/auth/me', async (req: Request, res: Response) => {
    try {
      // Get user from session
      const userId = req.session?.userId;
      if (!userId) {
        return res.status(401).json({ message: 'Not authenticated' });
      }
      
      // Get user
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      res.json({
        user: { id: user.id, username: user.username }
      });
    } catch (error) {
      console.error('Error in get user route:', error);
      res.status(500).json({ 
        message: 'An error occurred',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
  
  // Logout endpoint
  app.post('/api/auth/logout', (req: Request, res: Response) => {
    if (req.session) {
      req.session.destroy((err) => {
        if (err) {
          return res.status(500).json({ message: 'Logout failed', error: err.message });
        }
        res.json({ message: 'Logout successful' });
      });
    } else {
      res.json({ message: 'Logout successful' });
    }
  });
  
  // --- Search History Routes ---
  
  // Get search history for a user
  app.get('/api/search/history', async (req: Request, res: Response) => {
    try {
      // Get user from session
      const userId = req.session?.userId;
      if (!userId) {
        return res.status(401).json({ message: 'Not authenticated' });
      }
      
      // Get limit from query params
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
      
      // Get history
      const history = await storage.getSearchHistory(userId, limit);
      
      res.json({ history });
    } catch (error) {
      console.error('Error in get history route:', error);
      res.status(500).json({ 
        message: 'An error occurred',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
  
  // Add search to history
  app.post('/api/search/history', async (req: Request, res: Response) => {
    try {
      // Get user from session
      const userId = req.session?.userId;
      if (!userId) {
        return res.status(401).json({ message: 'Not authenticated' });
      }
      
      const { query, resultsCount, searchTime } = req.body;
      
      if (!query) {
        return res.status(400).json({ message: 'Query is required' });
      }
      
      // Add to history
      const record = await storage.addSearchHistory({
        userId,
        query,
        resultsCount,
        searchTime
      });
      
      res.status(201).json({ record });
    } catch (error) {
      console.error('Error in add history route:', error);
      res.status(500).json({ 
        message: 'An error occurred',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
  
  // --- Search Settings Routes ---
  
  // Get settings for a user
  app.get('/api/search/settings', async (req: Request, res: Response) => {
    try {
      // Get user from session
      const userId = req.session?.userId;
      if (!userId) {
        return res.status(401).json({ message: 'Not authenticated' });
      }
      
      // Get settings
      let settings = await storage.getSearchSettings(userId);
      
      // If no settings, create default ones
      if (!settings) {
        settings = await storage.createSearchSettings({
          userId,
          safeSearch: true,
          resultsPerPage: 10,
          openInNewTab: false,
          theme: 'light'
        });
      }
      
      res.json({ settings });
    } catch (error) {
      console.error('Error in get settings route:', error);
      res.status(500).json({ 
        message: 'An error occurred',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
  
  // Update settings
  app.put('/api/search/settings', async (req: Request, res: Response) => {
    try {
      // Get user from session
      const userId = req.session?.userId;
      if (!userId) {
        return res.status(401).json({ message: 'Not authenticated' });
      }
      
      const { safeSearch, resultsPerPage, openInNewTab, theme } = req.body;
      
      // Update settings
      const settings = await storage.updateSearchSettings(userId, {
        safeSearch,
        resultsPerPage,
        openInNewTab,
        theme
      });
      
      if (!settings) {
        // If no settings were updated, create them
        const newSettings = await storage.createSearchSettings({
          userId,
          safeSearch: safeSearch ?? true,
          resultsPerPage: resultsPerPage ?? 10,
          openInNewTab: openInNewTab ?? false,
          theme: theme ?? 'light'
        });
        
        return res.json({ settings: newSettings });
      }
      
      res.json({ settings });
    } catch (error) {
      console.error('Error in update settings route:', error);
      res.status(500).json({ 
        message: 'An error occurred',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
  // Search endpoint
  app.get('/api/search', async (req: Request, res: Response) => {
    try {
      const query = req.query.q as string;
      const page = parseInt(req.query.p as string || '1', 10);
      const resultsPerPage = parseInt(req.query.num as string || '10', 10);
      const safeSearch = req.query.safe === '1';
      
      if (!query) {
        return res.status(400).json({ message: 'Query parameter is required' });
      }
      
      const results = await searchGoogle(query, page, resultsPerPage, safeSearch);
      
      // Validate response with zod schema
      const validatedResults = searchResponseSchema.parse(results);
      
      res.json(validatedResults);
    } catch (error) {
      console.error('Error in search route:', error);
      res.status(500).json({ 
        message: 'An error occurred while processing your search',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
  
  // Direct Google proxy endpoint that allows iframe embedding
  app.get('/api/proxysearch', async (req: Request, res: Response) => {
    try {
      const query = req.query.q as string;
      const page = parseInt(req.query.p as string || '1', 10);
      const resultsPerPage = parseInt(req.query.num as string || '10', 10);
      const safeSearch = req.query.safe === '1';
      
      if (!query) {
        return res.status(400).json({ message: 'Query parameter is required' });
      }
      
      // Use our special proxy function that removes X-Frame-Options
      const { content, contentType } = await proxyGoogleSearch(query, page, resultsPerPage, safeSearch);
      
      // Store search in history if user is logged in
      try {
        const userId = req.session?.userId;
        if (userId) {
          await storage.addSearchHistory({
            userId,
            query,
            resultsCount: 0, // We don't know the count here
            searchTime: 0,  // We don't know the time here
          });
        }
      } catch (historyError) {
        console.error('Error saving to history:', historyError);
        // Continue even if history saving fails
      }
      
      // Remove X-Frame-Options header and set other headers
      res.removeHeader('X-Frame-Options');
      res.removeHeader('Content-Security-Policy');
      res.setHeader('Content-Type', contentType);
      
      // Send the modified content
      res.send(content);
    } catch (error) {
      console.error('Error in proxy search route:', error);
      
      // Send an error page
      res.status(500).send(`
        <html>
          <head>
            <title>Search Error</title>
            <style>
              body { font-family: sans-serif; padding: 2rem; max-width: 800px; margin: 0 auto; }
              .error { background: #fee; border: 1px solid #f99; padding: 1rem; border-radius: 4px; }
            </style>
          </head>
          <body>
            <h1>Search Error</h1>
            <div class="error">
              <p>There was an error processing your search:</p>
              <p>Error: ${error instanceof Error ? error.message : 'Unknown error'}</p>
            </div>
            <p><a href="/">&larr; Return to search</a></p>
          </body>
        </html>
      `);
    }
  });
  
  // Process proxied form submissions
  app.post('/api/proxysearch', async (req: Request, res: Response) => {
    try {
      // Extract query from form data
      const query = req.body.q || '';
      
      if (!query) {
        return res.redirect('/');
      }
      
      // Redirect to the GET endpoint
      res.redirect(`/api/proxysearch?q=${encodeURIComponent(query)}`);
    } catch (error) {
      console.error('Error handling search form:', error);
      res.redirect('/');
    }
  });
  
  // Generic proxy for any URL
  app.get('/api/proxy', async (req: Request, res: Response) => {
    try {
      const url = req.query.url as string;
      
      if (!url) {
        return res.status(400).json({ message: 'URL parameter is required' });
      }
      
      // Validate URL
      try {
        new URL(url);
      } catch (e) {
        return res.status(400).json({ message: 'Invalid URL' });
      }
      
      // Fetch the webpage and proxy it
      const { content, contentType } = await fetchWebpage(url);
      
      // Remove X-Frame-Options header
      res.removeHeader('X-Frame-Options');
      res.removeHeader('Content-Security-Policy');
      res.setHeader('Content-Type', contentType);
      
      res.send(content);
    } catch (error) {
      console.error('Error in proxy route:', error);
      res.status(500).send(`
        <html>
          <head>
            <title>Error Loading Page</title>
            <style>
              body { font-family: sans-serif; padding: 2rem; max-width: 800px; margin: 0 auto; }
              .error { background: #fee; border: 1px solid #f99; padding: 1rem; border-radius: 4px; }
            </style>
          </head>
          <body>
            <h1>Error Loading Page</h1>
            <div class="error">
              <p>There was an error loading the requested page</p>
              <p>Error: ${error instanceof Error ? error.message : 'Unknown error'}</p>
            </div>
            <p><a href="/">&larr; Return to search</a></p>
          </body>
        </html>
      `);
    }
  });
  
  // Proxy visit endpoint - allows users to visit links through our proxy
  app.get('/api/visit', async (req: Request, res: Response) => {
    try {
      const url = req.query.url as string;
      
      if (!url) {
        return res.status(400).json({ message: 'URL parameter is required' });
      }
      
      // Validate URL
      try {
        new URL(url);
      } catch (e) {
        return res.status(400).json({ message: 'Invalid URL' });
      }
      
      const { content, contentType } = await fetchWebpage(url);
      
      // Set the appropriate content type
      res.setHeader('Content-Type', contentType);
      res.send(content);
    } catch (error) {
      console.error('Error in visit route:', error);
      
      // Send an error page with the original URL
      const originalUrl = req.query.url as string;
      res.status(500).send(`
        <html>
          <head>
            <title>Error Loading Page</title>
            <style>
              body { font-family: sans-serif; padding: 2rem; max-width: 800px; margin: 0 auto; }
              .error { background: #fee; border: 1px solid #f99; padding: 1rem; border-radius: 4px; }
            </style>
          </head>
          <body>
            <h1>Error Loading Page</h1>
            <div class="error">
              <p>There was an error loading the requested page:</p>
              <p><strong>${originalUrl}</strong></p>
              <p>Error: ${error instanceof Error ? error.message : 'Unknown error'}</p>
            </div>
            <p><a href="/">&larr; Return to search</a></p>
          </body>
        </html>
      `);
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
