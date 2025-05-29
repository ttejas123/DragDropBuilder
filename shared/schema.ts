import { pgTable, text, serial, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  componentTree: jsonb("component_tree").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;

// Component definitions for the builder
export const ComponentTypeSchema = z.enum([
  'heading',
  'paragraph', 
  'button',
  'input',
  'image',
  'container',
  'grid',
  'flexbox',
  'form',
  'select',
  'checkbox',
  'textarea',
  'link'
]);

export const ComponentPropsSchema = z.record(z.any());

export const ComponentStylesSchema = z.record(z.string());

export const ComponentSchema: z.ZodType<any> = z.lazy(() => z.object({
  id: z.string(),
  type: ComponentTypeSchema,
  props: ComponentPropsSchema,
  styles: ComponentStylesSchema.optional(),
  dataId: z.string().optional(),
  children: z.array(ComponentSchema).optional(),
  position: z.object({
    x: z.number(),
    y: z.number()
  }).optional()
}));

export const ComponentTreeSchema = z.object({
  version: z.string(),
  components: z.array(ComponentSchema),
  metadata: z.object({
    created: z.string(),
    canvasSize: z.object({
      width: z.number(),
      height: z.number()
    })
  })
});

export type ComponentType = z.infer<typeof ComponentTypeSchema>;
export type Component = z.infer<typeof ComponentSchema>;
export type ComponentTree = z.infer<typeof ComponentTreeSchema>;
