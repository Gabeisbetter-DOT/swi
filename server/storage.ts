import { 
  users, 
  searchHistory, 
  searchSettings,
  type User, 
  type InsertUser
} from "@shared/schema";

// Define the types
type SearchHistory = typeof searchHistory.$inferSelect;
type InsertHistory = {
  userId: number;
  query: string;
  resultsCount?: number;
  searchTime?: number;
};

type SearchSettings = typeof searchSettings.$inferSelect;
type InsertSettings = {
  userId: number;
  safeSearch?: boolean;
  resultsPerPage?: number;
  openInNewTab?: boolean;
  theme?: string;
};
import { db } from "./db";
import { eq } from "drizzle-orm";

// modify the interface with any CRUD methods
// you might need
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Search history methods
  getSearchHistory(userId: number, limit?: number): Promise<SearchHistory[]>;
  addSearchHistory(history: InsertHistory): Promise<SearchHistory>;
  
  // Search settings methods
  getSearchSettings(userId: number): Promise<SearchSettings | undefined>;
  createSearchSettings(settings: InsertSettings): Promise<SearchSettings>;
  updateSearchSettings(userId: number, settings: Partial<InsertSettings>): Promise<SearchSettings | undefined>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }
  
  // Search history methods
  async getSearchHistory(userId: number, limit: number = 10): Promise<SearchHistory[]> {
    return db.select()
      .from(searchHistory)
      .where(eq(searchHistory.userId, userId))
      .orderBy(searchHistory.timestamp)
      .limit(limit);
  }
  
  async addSearchHistory(history: InsertHistory): Promise<SearchHistory> {
    const [record] = await db
      .insert(searchHistory)
      .values(history)
      .returning();
    return record;
  }
  
  // Search settings methods
  async getSearchSettings(userId: number): Promise<SearchSettings | undefined> {
    const [settings] = await db
      .select()
      .from(searchSettings)
      .where(eq(searchSettings.userId, userId));
    return settings;
  }
  
  async createSearchSettings(settings: InsertSettings): Promise<SearchSettings> {
    const [record] = await db
      .insert(searchSettings)
      .values(settings)
      .returning();
    return record;
  }
  
  async updateSearchSettings(userId: number, settings: Partial<InsertSettings>): Promise<SearchSettings | undefined> {
    const [updated] = await db
      .update(searchSettings)
      .set({
        ...settings,
        updatedAt: new Date()
      })
      .where(eq(searchSettings.userId, userId))
      .returning();
    return updated;
  }
}

export const storage = new DatabaseStorage();
