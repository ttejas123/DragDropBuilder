import { EventHandlerSchema } from '@shared/schema';
import { z } from 'zod';

// These are example handler functions that would be available in the application
export const PREDEFINED_HANDLERS = [
  {
    key: 'handleSubmit',
    label: 'Handle Form Submit',
    description: 'Handles form submission with validation',
    category: 'form'
  },
  {
    key: 'handleInputChange',
    label: 'Handle Input Change',
    description: 'Handles input field value changes',
    category: 'form'
  },
  {
    key: 'handleClick',
    label: 'Handle Click',
    description: 'Basic click event handler',
    category: 'interaction'
  },
  {
    key: 'handleDoubleClick',
    label: 'Handle Double Click',
    description: 'Handles double click events',
    category: 'interaction'
  },
  {
    key: 'handleFocus',
    label: 'Handle Focus',
    description: 'Handles element focus events',
    category: 'interaction'
  },
  {
    key: 'handleBlur',
    label: 'Handle Blur',
    description: 'Handles element blur events',
    category: 'interaction'
  },
  {
    key: 'handleKeyPress',
    label: 'Handle Key Press',
    description: 'Handles keyboard press events',
    category: 'keyboard'
  },
  {
    key: 'handleKeyDown',
    label: 'Handle Key Down',
    description: 'Handles keyboard down events',
    category: 'keyboard'
  },
  {
    key: 'handleKeyUp',
    label: 'Handle Key Up',
    description: 'Handles keyboard up events',
    category: 'keyboard'
  },
  {
    key: 'handleMouseEnter',
    label: 'Handle Mouse Enter',
    description: 'Handles mouse enter events',
    category: 'mouse'
  },
  {
    key: 'handleMouseLeave',
    label: 'Handle Mouse Leave',
    description: 'Handles mouse leave events',
    category: 'mouse'
  },
  {
    key: 'handleScroll',
    label: 'Handle Scroll',
    description: 'Handles scroll events',
    category: 'scroll'
  },
  {
    key: 'handleDragStart',
    label: 'Handle Drag Start',
    description: 'Handles drag start events',
    category: 'drag'
  },
  {
    key: 'handleDrop',
    label: 'Handle Drop',
    description: 'Handles drop events',
    category: 'drag'
  },
  {
    key: 'handleToggle',
    label: 'Handle Toggle',
    description: 'Handles toggle state changes',
    category: 'state'
  },
  {
    key: 'handleSelect',
    label: 'Handle Select',
    description: 'Handles selection changes',
    category: 'state'
  },
  {
    key: 'handleTabChange',
    label: 'Handle Tab Change',
    description: 'Handles tab selection changes',
    category: 'navigation'
  },
  {
    key: 'handleMenuClick',
    label: 'Handle Menu Click',
    description: 'Handles menu item clicks',
    category: 'navigation'
  },
  {
    key: 'handleModalOpen',
    label: 'Handle Modal Open',
    description: 'Handles modal opening',
    category: 'modal'
  },
  {
    key: 'handleModalClose',
    label: 'Handle Modal Close',
    description: 'Handles modal closing',
    category: 'modal'
  }
] as const;

export type HandlerKey = typeof PREDEFINED_HANDLERS[number]['key'];

// Group handlers by category
export const HANDLER_CATEGORIES = Array.from(
  new Set(PREDEFINED_HANDLERS.map(handler => handler.category))
);

type EventType = z.infer<typeof EventHandlerSchema>['type'];

// Context Types
export const CONTEXT_TYPES = ['application', 'local'] as const;
export type ContextType = typeof CONTEXT_TYPES[number];

// Application (Global) Context Handlers
export const APPLICATION_CONTEXT_HANDLERS = {
  states: [
    {
      key: 'user_id',
      label: 'User ID',
      description: 'Current logged in user ID'
    },
    {
      key: 'account_id',
      label: 'Account ID',
      description: 'Current account identifier'
    },
    {
      key: 'shopper_id',
      label: 'Shopper ID',
      description: 'Current shopper identifier'
    },
    {
      key: 'date_range',
      label: 'Date Range',
      description: 'Selected date range'
    }
  ],
  functions: [
    {
      key: 'handleUserAction',
      label: 'Handle User Action',
      description: 'Global user action handler',
      eventTypes: ['click', 'submit'] as EventType[]
    },
    {
      key: 'handleAccountUpdate',
      label: 'Handle Account Update',
      description: 'Update account information',
      eventTypes: ['submit', 'change'] as EventType[]
    },
    {
      key: 'handleDateRangeChange',
      label: 'Handle Date Range Change',
      description: 'Update global date range',
      eventTypes: ['change'] as EventType[]
    },
    {
      key: 'handleGlobalSearch',
      label: 'Handle Global Search',
      description: 'Global search functionality',
      eventTypes: ['change', 'submit'] as EventType[]
    },
    {
      key: 'handleGlobalNavigation',
      label: 'Handle Global Navigation',
      description: 'Global navigation handler',
      eventTypes: ['click'] as EventType[]
    }
  ]
} as const;

// Local Context Handlers (Component Level)
export const LOCAL_CONTEXT_HANDLERS = {
  states: [
    {
      key: 'searchQuery',
      label: 'Search Query',
      description: 'Component level search query'
    },
    {
      key: 'sortColumn',
      label: 'Sort Column',
      description: 'Current sort column'
    },
    {
      key: 'sortDirection',
      label: 'Sort Direction',
      description: 'Current sort direction'
    },
    {
      key: 'selectedItems',
      label: 'Selected Items',
      description: 'Currently selected items'
    },
    {
      key: 'isOpen',
      label: 'Is Open',
      description: 'Component open/closed state'
    }
  ],
  functions: [
    {
      key: 'handleSearch',
      label: 'Handle Search',
      description: 'Component level search handler',
      eventTypes: ['change', 'submit'] as EventType[]
    },
    {
      key: 'handleSort',
      label: 'Handle Sort',
      description: 'Sort data in component',
      eventTypes: ['click', 'change'] as EventType[]
    },
    {
      key: 'handleSelect',
      label: 'Handle Select',
      description: 'Selection handler',
      eventTypes: ['click', 'change'] as EventType[]
    },
    {
      key: 'handleToggle',
      label: 'Handle Toggle',
      description: 'Toggle component state',
      eventTypes: ['click'] as EventType[]
    },
    {
      key: 'handleDelete',
      label: 'Handle Delete',
      description: 'Delete selected items',
      eventTypes: ['click'] as EventType[]
    }
  ]
} as const;

export type ApplicationHandler = typeof APPLICATION_CONTEXT_HANDLERS.functions[number];
export type LocalHandler = typeof LOCAL_CONTEXT_HANDLERS.functions[number];
export type ApplicationState = typeof APPLICATION_CONTEXT_HANDLERS.states[number];
export type LocalState = typeof LOCAL_CONTEXT_HANDLERS.states[number]; 