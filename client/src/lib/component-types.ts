import { ComponentType } from "@shared/schema";

export interface ComponentDefinition {
  type: ComponentType;
  name: string;
  icon: string;
  category: 'basic' | 'layout' | 'form';
  description: string;
  defaultProps: Record<string, any>;
  defaultStyles: Record<string, string>;
}

export const COMPONENT_DEFINITIONS: ComponentDefinition[] = [
  // Basic Components
  {
    type: 'heading',
    name: 'Heading',
    icon: 'fas fa-heading',
    category: 'basic',
    description: 'H1-H6 elements',
    defaultProps: {
      tag: 'h2',
      content: 'New Heading',
      className: 'text-2xl font-semibold text-gray-900'
    },
    defaultStyles: {
      fontSize: '24px',
      fontWeight: '600',
      color: '#111827'
    }
  },
  {
    type: 'paragraph',
    name: 'Paragraph',
    icon: 'fas fa-paragraph',
    category: 'basic',
    description: 'Text content',
    defaultProps: {
      content: 'New paragraph text',
      className: 'text-gray-700'
    },
    defaultStyles: {
      fontSize: '16px',
      color: '#374151'
    }
  },
  {
    type: 'button',
    name: 'Button',
    icon: 'fas fa-mouse-pointer',
    category: 'basic',
    description: 'Interactive button',
    defaultProps: {
      content: 'Click Me',
      className: 'px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors'
    },
    defaultStyles: {
      backgroundColor: '#2563EB',
      color: '#FFFFFF',
      padding: '8px 16px',
      borderRadius: '8px'
    }
  },
  {
    type: 'input',
    name: 'Input',
    icon: 'fas fa-edit',
    category: 'basic',
    description: 'Text input field',
    defaultProps: {
      type: 'text',
      placeholder: 'Enter text here',
      className: 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent'
    },
    defaultStyles: {
      border: '1px solid #D1D5DB',
      padding: '8px 12px',
      borderRadius: '8px'
    }
  },
  {
    type: 'image',
    name: 'Image',
    icon: 'fas fa-image',
    category: 'basic',
    description: 'Image element',
    defaultProps: {
      src: 'https://via.placeholder.com/300x200',
      alt: 'Placeholder image',
      className: 'w-full h-auto rounded-lg'
    },
    defaultStyles: {
      width: '100%',
      height: 'auto'
    }
  },
  {
    type: 'link',
    name: 'Link',
    icon: 'fas fa-link',
    category: 'basic',
    description: 'Anchor link',
    defaultProps: {
      href: '#',
      content: 'Click here',
      className: 'text-primary hover:underline'
    },
    defaultStyles: {
      color: '#2563EB'
    }
  },
  
  // Layout Components
  {
    type: 'container',
    name: 'Container',
    icon: 'fas fa-square-full',
    category: 'layout',
    description: 'Wrapper element',
    defaultProps: {
      className: 'p-4 border border-gray-200 rounded-lg'
    },
    defaultStyles: {
      padding: '16px',
      border: '1px solid #E5E7EB',
      borderRadius: '8px'
    }
  },
  {
    type: 'grid',
    name: 'Grid',
    icon: 'fas fa-th',
    category: 'layout',
    description: 'CSS Grid layout',
    defaultProps: {
      columns: 2,
      gap: '16px',
      className: 'grid grid-cols-2 gap-4 p-4 border border-gray-300 rounded-lg min-h-32'
    },
    defaultStyles: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '16px',
      padding: '16px'
    }
  },
  {
    type: 'flexbox',
    name: 'Flexbox',
    icon: 'fas fa-arrows-alt-h',
    category: 'layout',
    description: 'Flexible layout',
    defaultProps: {
      direction: 'row',
      className: 'flex gap-4 p-4 border border-gray-300 rounded-lg'
    },
    defaultStyles: {
      display: 'flex',
      flexDirection: 'row',
      gap: '16px',
      padding: '16px'
    }
  },
  
  // Form Components
  {
    type: 'form',
    name: 'Form',
    icon: 'fas fa-wpforms',
    category: 'form',
    description: 'Form wrapper',
    defaultProps: {
      method: 'post',
      className: 'space-y-4 p-4 border border-gray-300 rounded-lg'
    },
    defaultStyles: {
      padding: '16px'
    }
  },
  {
    type: 'select',
    name: 'Select',
    icon: 'fas fa-list',
    category: 'form',
    description: 'Dropdown select',
    defaultProps: {
      options: ['Option 1', 'Option 2', 'Option 3'],
      className: 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent'
    },
    defaultStyles: {
      border: '1px solid #D1D5DB',
      padding: '8px 12px',
      borderRadius: '8px'
    }
  },
  {
    type: 'checkbox',
    name: 'Checkbox',
    icon: 'fas fa-check-square',
    category: 'form',
    description: 'Boolean input',
    defaultProps: {
      label: 'Check me',
      className: 'flex items-center space-x-2'
    },
    defaultStyles: {}
  },
  {
    type: 'textarea',
    name: 'Textarea',
    icon: 'fas fa-align-left',
    category: 'form',
    description: 'Multi-line text',
    defaultProps: {
      placeholder: 'Enter text here...',
      rows: 3,
      className: 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none'
    },
    defaultStyles: {
      border: '1px solid #D1D5DB',
      padding: '8px 12px',
      borderRadius: '8px'
    }
  }
];

export function getComponentDefinition(type: ComponentType): ComponentDefinition | undefined {
  return COMPONENT_DEFINITIONS.find(def => def.type === type);
}

export function getComponentsByCategory(category: 'basic' | 'layout' | 'form'): ComponentDefinition[] {
  return COMPONENT_DEFINITIONS.filter(def => def.category === category);
}
