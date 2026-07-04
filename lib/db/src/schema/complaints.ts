import { pgTable, serial, text, integer, real, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const complaintsTable = pgTable("complaints", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  location: text("location").notNull(),
  landmark: text("landmark"),
  ward: text("ward"),
  status: text("status").notNull().default("pending"),
  priority: text("priority"),
  category: text("category"),
  department: text("department"),
  severity: text("severity"),
  impactScore: real("impact_score"),
  duplicateCount: integer("duplicate_count").notNull().default(0),
  incidentGroupId: integer("incident_group_id"),
  imageUrl: text("image_url"),
  submittedBy: integer("submitted_by"),
  submitterName: text("submitter_name"),
  aiAnalysis: jsonb("ai_analysis"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertComplaintSchema = createInsertSchema(complaintsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertComplaint = z.infer<typeof insertComplaintSchema>;
export type Complaint = typeof complaintsTable.$inferSelect;
