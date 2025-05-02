import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Define the search history table
export const searchHistory = pgTable("search_history", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  query: text("query").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  resultsCount: integer("results_count"),
  searchTime: integer("search_time"), // in milliseconds
});

// Define search history relations
export const searchHistoryRelations = relations(searchHistory, ({ one }) => ({
  user: one(users, {
    fields: [searchHistory.userId],
    references: [users.id],
  }),
}));

export const insertHistorySchema = createInsertSchema(searchHistory).omit({
  id: true,
  timestamp: true,
});

export type InsertHistory = z.infer<typeof insertHistorySchema>;
export type SearchHistory = typeof searchHistory.$inferSelect;

// Schema for search settings
export const searchSettings = pgTable("search_settings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  safeSearch: boolean("safe_search").notNull().default(true),
  resultsPerPage: integer("results_per_page").notNull().default(10),
  openInNewTab: boolean("open_in_new_tab").notNull().default(false),
  theme: text("theme").notNull().default("light"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Define settings relations
export const searchSettingsRelations = relations(searchSettings, ({ one }) => ({
  user: one(users, {
    fields: [searchSettings.userId],
    references: [users.id],
  }),
}));

export const insertSettingsSchema = createInsertSchema(searchSettings).omit({
  id: true,
  updatedAt: true,
});

// Search result model (for type-safety in frontend)
export const searchResultSchema = z.object({
  title: z.string(),
  link: z.string().url(),
  displayLink: z.string(),
  snippet: z.string(),
  position: z.number(),
});

export type SearchResult = z.infer<typeof searchResultSchema>;

export const searchResponseSchema = z.object({
  results: z.array(searchResultSchema),
  totalResults: z.number(),
  searchTime: z.number(),
  query: z.string(),
  page: z.number(),
  hasNextPage: z.boolean(),
  hasPreviousPage: z.boolean()
});

export type SearchResponse = z.infer<typeof searchResponseSchema>;

// Define user relations after all tables are defined
export const usersRelations = relations(users, ({ many }) => ({
  searchHistory: many(searchHistory),
  searchSettings: many(searchSettings),
}));
