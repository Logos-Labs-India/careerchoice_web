import { pgTable, text, serial, integer, boolean, timestamp, jsonb, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  googleId: text("google_id").unique(),
  username: text("username").unique(),
  password: text("password"),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  phoneNumber: text("phone_number"),
  grade: text("grade"),
  school: text("school"),
  occupation: text("occupation"),
  profilePicture: text("profile_picture"),
  assessmentComplete: boolean("assessment_complete").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  lastLogin: timestamp("last_login"),
});

// RIASEC assessment results
export const riasecResults = pgTable("riasec_results", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  realistic: real("realistic").notNull(),
  investigative: real("investigative").notNull(),
  artistic: real("artistic").notNull(),
  social: real("social").notNull(),
  enterprising: real("enterprising").notNull(),
  conventional: real("conventional").notNull(),
  completedAt: timestamp("completed_at").defaultNow(),
});

// Aptitude assessment results
export const aptitudeResults = pgTable("aptitude_results", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  numerical: real("numerical").notNull(),
  verbal: real("verbal").notNull(),
  spatial: real("spatial").notNull(),
  logical: real("logical").notNull(),
  mechanical: real("mechanical").notNull(),
  completedAt: timestamp("completed_at").defaultNow(),
});

// OCEAN personality assessment results
export const oceanResults = pgTable("ocean_results", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  openness: real("openness").notNull(),
  conscientiousness: real("conscientiousness").notNull(),
  extraversion: real("extraversion").notNull(),
  agreeableness: real("agreeableness").notNull(),
  neuroticism: real("neuroticism").notNull(),
  completedAt: timestamp("completed_at").defaultNow(),
});

// Career matches
export const careerMatches = pgTable("career_matches", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  matches: jsonb("matches").notNull(),
  generatedAt: timestamp("generated_at").defaultNow(),
});

// Waitlist entries
export const waitlist = pgTable("waitlist", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  occupation: text("occupation"),
  interests: text("interests"),
  newsletter: boolean("newsletter").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Career data
export const careers = pgTable("careers", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  skills: jsonb("skills").notNull(),
  riasecProfile: jsonb("riasec_profile").notNull(),
  aptitudeRequirements: jsonb("aptitude_requirements").notNull(),
  oceanFit: jsonb("ocean_fit").notNull(),
});

// Schemas for insertion
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  lastLogin: true,
});

export const insertWaitlistSchema = createInsertSchema(waitlist).omit({
  id: true, 
  createdAt: true,
});

export const insertRiasecResultSchema = createInsertSchema(riasecResults).omit({
  id: true,
  completedAt: true,
});

export const insertAptitudeResultSchema = createInsertSchema(aptitudeResults).omit({
  id: true,
  completedAt: true,
});

export const insertOceanResultSchema = createInsertSchema(oceanResults).omit({
  id: true,
  completedAt: true,
});

// Type definitions
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type WaitlistEntry = typeof waitlist.$inferSelect;
export type InsertWaitlistEntry = z.infer<typeof insertWaitlistSchema>;

export type RiasecResult = typeof riasecResults.$inferSelect;
export type InsertRiasecResult = z.infer<typeof insertRiasecResultSchema>;

export type AptitudeResult = typeof aptitudeResults.$inferSelect;
export type InsertAptitudeResult = z.infer<typeof insertAptitudeResultSchema>;

export type OceanResult = typeof oceanResults.$inferSelect;
export type InsertOceanResult = z.infer<typeof insertOceanResultSchema>;

export type CareerMatch = typeof careerMatches.$inferSelect;
export type Career = typeof careers.$inferSelect;

// Combined assessment results
export type AssessmentResults = {
  riasec: RiasecResult | null;
  aptitude: AptitudeResult | null;
  ocean: OceanResult | null;
  careerMatches: {
    title: string;
    description: string;
    matchPercentage: number;
    traits: string[];
  }[] | null;
};
