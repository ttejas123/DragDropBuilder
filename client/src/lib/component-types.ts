import { ComponentType } from "@shared/schema";

export interface ComponentDefinition {
  type: ComponentType;
  name: string;
  icon: string;
  category: 'basic' | 'layout' | 'form' | 'data' | 'feedback' | 'navigation';
  description: string;
  defaultProps: Record<string, any>;
  defaultStyles: Record<string, string>;
}

export const COMPONENT_DEFINITIONS: ComponentDefinition[] = [
  // Basic Components
  {
    type: 'heading',
    name: 'Heading',
    icon: 'Type',
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
    icon: 'AlignLeft',
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
    icon: 'MousePointer',
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
    icon: 'Edit3',
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
    icon: 'Image',
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
    icon: 'Link',
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
    icon: 'Square',
    category: 'layout',
    description: 'Wrapper element',
    defaultProps: {
      className: 'p-4 border border-gray-200 rounded-lg min-h-24'
    },
    defaultStyles: {
      padding: '16px',
      border: '1px solid #E5E7EB',
      borderRadius: '8px',
      minHeight: '96px'
    }
  },
  {
    type: 'grid',
    name: 'Grid',
    icon: 'Grid3X3',
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
      padding: '16px',
      minHeight: '128px'
    }
  },
  {
    type: 'flexbox',
    name: 'Flexbox',
    icon: 'ArrowLeftRight',
    category: 'layout',
    description: 'Flexible layout',
    defaultProps: {
      direction: 'row',
      className: 'flex gap-4 p-4 border border-gray-300 rounded-lg min-h-24'
    },
    defaultStyles: {
      display: 'flex',
      flexDirection: 'row',
      gap: '16px',
      padding: '16px',
      minHeight: '96px'
    }
  },
  
  // Form Components
  {
    type: 'form',
    name: 'Form',
    icon: 'FileText',
    category: 'form',
    description: 'Form wrapper',
    defaultProps: {
      method: 'post',
      className: 'space-y-4 p-4 border border-gray-300 rounded-lg min-h-24'
    },
    defaultStyles: {
      padding: '16px',
      minHeight: '96px'
    }
  },
  {
    type: 'select',
    name: 'Select',
    icon: 'List',
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
    icon: 'CheckSquare',
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
    icon: 'AlignLeft',
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
  },

  // Data Display Components
  {
    type: 'card',
    name: 'Card',
    icon: 'CreditCard',
    category: 'data',
    description: 'Card container',
    defaultProps: {
      title: 'Card Title',
      content: 'Card content goes here',
      className: 'border border-gray-200 rounded-lg p-4 shadow-sm bg-white'
    },
    defaultStyles: {
      border: '1px solid #E5E7EB',
      borderRadius: '8px',
      padding: '16px'
    }
  },
  {
    type: 'badge',
    name: 'Badge',
    icon: 'Award',
    category: 'data',
    description: 'Status badge',
    defaultProps: {
      content: 'Badge',
      color: 'blue',
      className: 'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800'
    },
    defaultStyles: {
      backgroundColor: '#DBEAFE',
      color: '#1E40AF',
      padding: '4px 8px',
      borderRadius: '16px'
    }
  },
  {
    type: 'tag',
    name: 'Tag',
    icon: 'Tag',
    category: 'data',
    description: 'Label tag',
    defaultProps: {
      content: 'Tag',
      closable: false,
      className: 'inline-flex items-center px-2 py-1 rounded text-sm bg-gray-100 text-gray-800'
    },
    defaultStyles: {
      backgroundColor: '#F3F4F6',
      color: '#1F2937',
      padding: '4px 8px',
      borderRadius: '4px'
    }
  },
  {
    type: 'avatar',
    name: 'Avatar',
    icon: 'User',
    category: 'data',
    description: 'User avatar',
    defaultProps: {
      src: 'https://via.placeholder.com/40x40',
      alt: 'Avatar',
      size: 'medium',
      className: 'w-10 h-10 rounded-full'
    },
    defaultStyles: {
      width: '40px',
      height: '40px',
      borderRadius: '50%'
    }
  },
  {
    type: 'table',
    name: 'Table',
    icon: 'Table',
    category: 'data',
    description: 'Data table',
    defaultProps: {
      headers: ['Name', 'Age', 'City'],
      rows: [
        ['John Doe', '25', 'New York'],
        ['Jane Smith', '30', 'Los Angeles']
      ],
      className: 'w-full border-collapse border border-gray-300'
    },
    defaultStyles: {
      width: '100%',
      borderCollapse: 'collapse'
    }
  },
  {
    type: 'list',
    name: 'List',
    icon: 'List',
    category: 'data',
    description: 'List component',
    defaultProps: {
      items: ['Item 1', 'Item 2', 'Item 3'],
      type: 'unordered',
      className: 'space-y-2'
    },
    defaultStyles: {
      listStyle: 'disc',
      paddingLeft: '20px'
    }
  },

  // Feedback Components
  {
    type: 'alert',
    name: 'Alert',
    icon: 'AlertTriangle',
    category: 'feedback',
    description: 'Alert message',
    defaultProps: {
      message: 'This is an alert message',
      type: 'info',
      showIcon: true,
      className: 'p-4 rounded-lg bg-blue-50 border border-blue-200 text-blue-800'
    },
    defaultStyles: {
      padding: '16px',
      borderRadius: '8px',
      backgroundColor: '#EFF6FF'
    }
  },
  {
    type: 'progress',
    name: 'Progress',
    icon: 'TrendingUp',
    category: 'feedback',
    description: 'Progress bar',
    defaultProps: {
      percentage: 60,
      showText: true,
      className: 'w-full bg-gray-200 rounded-full h-2'
    },
    defaultStyles: {
      width: '100%',
      height: '8px',
      backgroundColor: '#E5E7EB',
      borderRadius: '9999px'
    }
  },
  {
    type: 'rate',
    name: 'Rate',
    icon: 'Star',
    category: 'feedback',
    description: 'Star rating',
    defaultProps: {
      value: 3,
      count: 5,
      allowHalf: true,
      className: 'flex space-x-1'
    },
    defaultStyles: {
      color: '#FCD34D'
    }
  },

  // Navigation Components
  {
    type: 'breadcrumb',
    name: 'Breadcrumb',
    icon: 'ChevronRight',
    category: 'navigation',
    description: 'Navigation breadcrumb',
    defaultProps: {
      items: ['Home', 'Category', 'Current Page'],
      separator: '/',
      className: 'flex items-center space-x-2 text-sm text-gray-600'
    },
    defaultStyles: {
      color: '#6B7280'
    }
  },
  {
    type: 'steps',
    name: 'Steps',
    icon: 'MoreHorizontal',
    category: 'navigation',
    description: 'Step indicator',
    defaultProps: {
      current: 1,
      steps: ['Step 1', 'Step 2', 'Step 3'],
      className: 'flex items-center justify-between'
    },
    defaultStyles: {}
  },
  {
    type: 'tabs',
    name: 'Tabs',
    icon: 'Folder',
    category: 'navigation',
    description: 'Tab navigation',
    defaultProps: {
      activeKey: '1',
      items: [
        { key: '1', label: 'Tab 1', content: 'Content 1' },
        { key: '2', label: 'Tab 2', content: 'Content 2' }
      ],
      className: 'w-full'
    },
    defaultStyles: {}
  },

  // Layout Components (Additional)
  {
    type: 'divider',
    name: 'Divider',
    icon: 'Minus',
    category: 'layout',
    description: 'Content divider',
    defaultProps: {
      orientation: 'horizontal',
      text: '',
      className: 'border-t border-gray-300 my-4'
    },
    defaultStyles: {
      borderTop: '1px solid #D1D5DB',
      margin: '16px 0'
    }
  },
  {
    type: 'collapse',
    name: 'Collapse',
    icon: 'ChevronDown',
    category: 'layout',
    description: 'Collapsible panel',
    defaultProps: {
      title: 'Panel Title',
      content: 'Panel content goes here',
      defaultExpanded: false,
      className: 'border border-gray-200 rounded-lg'
    },
    defaultStyles: {
      border: '1px solid #E5E7EB',
      borderRadius: '8px'
    }
  },

  // Form Components (Additional)
  {
    type: 'switch',
    name: 'Switch',
    icon: 'ToggleLeft',
    category: 'form',
    description: 'Toggle switch',
    defaultProps: {
      checked: false,
      label: 'Switch',
      className: 'flex items-center space-x-2'
    },
    defaultStyles: {}
  },
  {
    type: 'slider',
    name: 'Slider',
    icon: 'Sliders',
    category: 'form',
    description: 'Range slider',
    defaultProps: {
      min: 0,
      max: 100,
      value: 50,
      className: 'w-full'
    },
    defaultStyles: {
      width: '100%'
    }
  }
];

export function getComponentDefinition(type: ComponentType): ComponentDefinition | undefined {
  return COMPONENT_DEFINITIONS.find(def => def.type === type);
}

export function getComponentsByCategory(category: 'basic' | 'layout' | 'form' | 'data' | 'feedback' | 'navigation'): ComponentDefinition[] {
  return COMPONENT_DEFINITIONS.filter(def => def.category === category);
}
