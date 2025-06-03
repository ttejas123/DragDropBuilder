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

// Grid configuration schema
export const GridSchema = z.object({
  xs: z.number().optional(),
  sm: z.number().optional(),
  md: z.number().optional(),
  lg: z.number().optional(),
  xl: z.number().optional(),
  xxl: z.number().optional(),
});

// Layout configuration schema
export const LayoutConfigSchema = z.object({
  order: z.number(),
  divider: z.boolean().optional(),
  visible: z.boolean(),
});

// API configuration schema
export const ApiConfigSchema = z.object({
  url: z.string(),
  payload: z.array(z.any()),
  data_keys: z.array(z.string()),
  method_type: z.string(),
});

// Context dependency schema
export const ContextDependencySchema = z.object({
  key: z.string(),
  value: z.string(),
});

// Component type enum
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
  'link',
  'card',
  'badge',
  'tag',
  'alert',
  'avatar',
  'breadcrumb',
  'steps',
  'table',
  'list',
  'divider',
  'progress',
  'timeline',
  'collapse',
  'tabs',
  'switch',
  'slider',
  'rate',
  'tooltip',
  'modal',
  'drawer',
  'notification'
]);

// UI Template schema
export const UITemplateSchema = z.object({
  id: ComponentTypeSchema,
  grid: GridSchema,
  props: z.record(z.any()).optional(),
  style: z.record(z.string()).optional(),
  gutter: z.any().nullable(),
});

export type ComponentType = z.infer<typeof ComponentTypeSchema>;

// Event configuration schema
export const EventHandlerSchema = z.object({
  type: z.enum([
    'click',
    'change',
    'submit',
    'focus',
    'blur',
    'mouseenter',
    'mouseleave',
    'keydown',
    'keyup'
  ]),
  handler: z.object({
    key: z.string(),
    value: z.string()
  }),
  dependencies: z.array(z.string()).optional()
});

// Component schema with lazy evaluation for recursive structure
export const ComponentSchema: z.ZodType<any> = z.lazy(() => z.object({
  id: z.string(),
  // Metadata
  mf_id: z.string(),
  data_id: z.string(),
  
  // UI Configuration
  ui_template: UITemplateSchema,
  
  // Hierarchy
  parent_id: z.string().nullable(),
  
  // Layout
  layout_config: LayoutConfigSchema,
  
  // API Configuration
  api: z.array(ApiConfigSchema),
  
  // Type
  type: z.enum(['MODULE', 'FIELD']),

  position: z.object({
    x: z.number(),
    y: z.number()  
  }).optional(),
  
  // Event Handlers
  events: z.array(EventHandlerSchema).optional(),
  
  // Dependencies
  application_context_dependency: z.array(ContextDependencySchema),
  local_context_dependency: z.array(ContextDependencySchema),
  
  // Audit fields
  created_at: z.string().nullable(),
  created_by: z.string().nullable(),
  updated_at: z.string().nullable(),
  updated_by: z.string().nullable(),
  deleted_at: z.string().nullable(),
  deleted_by: z.string().nullable(),
  remarks: z.string().nullable(),
  
  // Child components
  components: z.array(ComponentSchema).optional(),
}));

export type Component = z.infer<typeof ComponentSchema>;

// Helper types
export type ComponentProps = Record<string, any>;
export type ComponentStyles = Record<string, string>;

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

export type ComponentTree = z.infer<typeof ComponentTreeSchema>;
