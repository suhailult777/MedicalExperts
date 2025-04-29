import { pgTable, text, serial, integer, boolean, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Doctor schema
export const doctors = pgTable("doctors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  image: text("image"),
  specialization: text("specialization").notNull(),
  internalMedicine: boolean("internal_medicine").default(false),
  experience: integer("experience").notNull(),
  qualification: text("qualification").notNull(),
  location: text("location").notNull(),
  hospital: text("hospital").notNull(),
  price: integer("price").notNull(),
  cashback: integer("cashback").default(0),
  languages: text("languages").array(),
  rating: integer("rating").default(0),
  totalRatings: integer("total_ratings").default(0),
  availableIn: integer("available_in").default(0),
  isHourDoctor: boolean("is_hour_doctor").default(false),
  modes: text("modes").array(),
  facility: text("facility"),
});

export const insertDoctorSchema = createInsertSchema(doctors).omit({
  id: true,
});

// Filter schema
export const filterSchema = z.object({
  search: z.string().optional(),
  modes: z.array(z.string()).optional(),
  experienceRange: z.array(z.array(z.number())).optional(),
  priceRange: z.array(z.array(z.number())).optional(),
  languages: z.array(z.string()).optional(),
  facilities: z.array(z.string()).optional(),
  page: z.number().default(1),
  limit: z.number().default(10),
  sort: z.enum(["relevance", "experience", "price_low_to_high", "price_high_to_low", "rating"]).default("relevance"),
});

export type InsertDoctor = z.infer<typeof insertDoctorSchema>;
export type Doctor = typeof doctors.$inferSelect;
export type FilterParams = z.infer<typeof filterSchema>;
