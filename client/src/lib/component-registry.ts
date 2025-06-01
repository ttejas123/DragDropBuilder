import { LucideIcon, Type, AlignLeft, MousePointer, Edit3, Image, Link, Square, Grid3X3, FileText, List, CheckSquare, CreditCard, AlertTriangle } from 'lucide-react';

// Property types that components can have
export type PropertyType = 'string' | 'number' | 'boolean' | 'select' | 'color' | 'icon' | 'image';

// Interface for component property definition
export interface ComponentProperty {
  name: string;
  type: PropertyType;
  label: string;
  description?: string;
  defaultValue?: any;
  options?: { label: string; value: any }[]; // For select type
  required?: boolean;
}

// Interface for component style definition
export interface ComponentStyle {
  name: string;
  type: 'string' | 'color' | 'size' | 'select';
  label: string;
  description?: string;
  defaultValue?: string;
  options?: { label: string; value: string }[];
  category: 'layout' | 'typography' | 'spacing' | 'colors' | 'effects';
}

// Interface for component definition
export interface ComponentDefinition {
  type: string;
  name: string;
  category: 'basic' | 'layout' | 'form' | 'data' | 'feedback' | 'navigation';
  icon: LucideIcon;
  description: string;
  properties: ComponentProperty[];
  styles: ComponentStyle[];
  defaultProps?: Record<string, any>;
  defaultStyles?: Record<string, string>;
  allowChildren?: boolean;
  validation?: {
    maxChildren?: number;
    allowedChildren?: string[];
    requiredChildren?: string[];
  };
}

// Component Registry
export const componentRegistry: Record<string, ComponentDefinition> = {
  heading: {
    type: 'heading',
    name: 'Heading',
    category: 'basic',
    icon: Type,
    description: 'Section or content heading',
    properties: [
      {
        name: 'content',
        type: 'string',
        label: 'Text Content',
        description: 'The text to display in the heading',
        required: true,
      },
      {
        name: 'level',
        type: 'select',
        label: 'Heading Level',
        options: [
          { label: 'H1', value: 'h1' },
          { label: 'H2', value: 'h2' },
          { label: 'H3', value: 'h3' },
          { label: 'H4', value: 'h4' },
          { label: 'H5', value: 'h5' },
          { label: 'H6', value: 'h6' },
        ],
        defaultValue: 'h2',
      },
    ],
    styles: [
      {
        name: 'fontSize',
        type: 'size',
        label: 'Font Size',
        category: 'typography',
        defaultValue: '1.5rem',
      },
      {
        name: 'fontWeight',
        type: 'select',
        label: 'Font Weight',
        category: 'typography',
        options: [
          { label: 'Normal', value: '400' },
          { label: 'Medium', value: '500' },
          { label: 'Semibold', value: '600' },
          { label: 'Bold', value: '700' },
        ],
        defaultValue: '600',
      },
      {
        name: 'color',
        type: 'color',
        label: 'Text Color',
        category: 'colors',
      },
      {
        name: 'marginBottom',
        type: 'size',
        label: 'Bottom Margin',
        category: 'spacing',
        defaultValue: '1rem',
      },
    ],
    defaultProps: {
      content: 'New Heading',
      level: 'h2',
    },
  },

  paragraph: {
    type: 'paragraph',
    name: 'Paragraph',
    category: 'basic',
    icon: AlignLeft,
    description: 'Text paragraph block',
    properties: [
      {
        name: 'content',
        type: 'string',
        label: 'Text Content',
        description: 'The text content of the paragraph',
        required: true,
      },
    ],
    styles: [
      {
        name: 'fontSize',
        type: 'size',
        label: 'Font Size',
        category: 'typography',
        defaultValue: '1rem',
      },
      {
        name: 'lineHeight',
        type: 'size',
        label: 'Line Height',
        category: 'typography',
        defaultValue: '1.5',
      },
      {
        name: 'color',
        type: 'color',
        label: 'Text Color',
        category: 'colors',
      },
      {
        name: 'marginBottom',
        type: 'size',
        label: 'Bottom Margin',
        category: 'spacing',
        defaultValue: '1rem',
      },
    ],
    defaultProps: {
      content: 'New paragraph text',
    },
  },

  button: {
    type: 'button',
    name: 'Button',
    category: 'basic',
    icon: MousePointer,
    description: 'Clickable button element',
    properties: [
      {
        name: 'content',
        type: 'string',
        label: 'Button Text',
        required: true,
      },
      {
        name: 'variant',
        type: 'select',
        label: 'Variant',
        options: [
          { label: 'Default', value: 'default' },
          { label: 'Secondary', value: 'secondary' },
          { label: 'Destructive', value: 'destructive' },
          { label: 'Outline', value: 'outline' },
          { label: 'Ghost', value: 'ghost' },
        ],
        defaultValue: 'default',
      },
      {
        name: 'size',
        type: 'select',
        label: 'Size',
        options: [
          { label: 'Default', value: 'default' },
          { label: 'Small', value: 'sm' },
          { label: 'Large', value: 'lg' },
        ],
        defaultValue: 'default',
      },
    ],
    styles: [
      {
        name: 'width',
        type: 'size',
        label: 'Width',
        category: 'layout',
      },
      {
        name: 'margin',
        type: 'size',
        label: 'Margin',
        category: 'spacing',
      },
    ],
    defaultProps: {
      content: 'Button',
      variant: 'default',
      size: 'default',
    },
  },

  input: {
    type: 'input',
    name: 'Text Input',
    category: 'form',
    icon: Edit3,
    description: 'Text input field',
    properties: [
      {
        name: 'placeholder',
        type: 'string',
        label: 'Placeholder',
      },
      {
        name: 'type',
        type: 'select',
        label: 'Input Type',
        options: [
          { label: 'Text', value: 'text' },
          { label: 'Email', value: 'email' },
          { label: 'Password', value: 'password' },
          { label: 'Number', value: 'number' },
          { label: 'Tel', value: 'tel' },
        ],
        defaultValue: 'text',
      },
      {
        name: 'required',
        type: 'boolean',
        label: 'Required',
        defaultValue: false,
      },
    ],
    styles: [
      {
        name: 'width',
        type: 'size',
        label: 'Width',
        category: 'layout',
        defaultValue: '100%',
      },
      {
        name: 'margin',
        type: 'size',
        label: 'Margin',
        category: 'spacing',
      },
    ],
    defaultProps: {
      type: 'text',
      placeholder: 'Enter text...',
      required: false,
    },
  },

  image: {
    type: 'image',
    name: 'Image',
    category: 'basic',
    icon: Image,
    description: 'Image element',
    properties: [
      {
        name: 'src',
        type: 'image',
        label: 'Image Source',
        required: true,
      },
      {
        name: 'alt',
        type: 'string',
        label: 'Alt Text',
        description: 'Alternative text for accessibility',
        required: true,
      },
    ],
    styles: [
      {
        name: 'width',
        type: 'size',
        label: 'Width',
        category: 'layout',
      },
      {
        name: 'height',
        type: 'size',
        label: 'Height',
        category: 'layout',
      },
      {
        name: 'objectFit',
        type: 'select',
        label: 'Object Fit',
        category: 'layout',
        options: [
          { label: 'Cover', value: 'cover' },
          { label: 'Contain', value: 'contain' },
          { label: 'Fill', value: 'fill' },
        ],
        defaultValue: 'cover',
      },
    ],
    defaultProps: {
      src: '',
      alt: 'Image',
    },
  },

  container: {
    type: 'container',
    name: 'Container',
    category: 'layout',
    icon: Square,
    description: 'Container for grouping elements',
    properties: [],
    styles: [
      {
        name: 'padding',
        type: 'size',
        label: 'Padding',
        category: 'spacing',
      },
      {
        name: 'backgroundColor',
        type: 'color',
        label: 'Background Color',
        category: 'colors',
      },
      {
        name: 'border',
        type: 'string',
        label: 'Border',
        category: 'effects',
      },
      {
        name: 'borderRadius',
        type: 'size',
        label: 'Border Radius',
        category: 'effects',
      },
    ],
    allowChildren: true,
  },

  grid: {
    type: 'grid',
    name: 'Grid',
    category: 'layout',
    icon: Grid3X3,
    description: 'Grid layout container',
    properties: [
      {
        name: 'columns',
        type: 'number',
        label: 'Columns',
        defaultValue: 2,
      },
      {
        name: 'gap',
        type: 'string',
        label: 'Gap',
        defaultValue: '1rem',
      },
    ],
    styles: [
      {
        name: 'padding',
        type: 'size',
        label: 'Padding',
        category: 'spacing',
      },
      {
        name: 'backgroundColor',
        type: 'color',
        label: 'Background Color',
        category: 'colors',
      },
    ],
    allowChildren: true,
    defaultProps: {
      columns: 2,
      gap: '1rem',
    },
  },
};

// Helper functions
export function getComponentDefinition(type: string): ComponentDefinition | undefined {
  return componentRegistry[type];
}

export function getDefaultProps(type: string): Record<string, any> {
  const definition = componentRegistry[type];
  return definition?.defaultProps || {};
}

export function getDefaultStyles(type: string): Record<string, string> {
  const definition = componentRegistry[type];
  return definition?.defaultStyles || {};
}

export function getComponentsByCategory(category: string): ComponentDefinition[] {
  return Object.values(componentRegistry).filter(
    (component) => component.category === category
  );
} 