import { Component } from '@shared/schema';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

// JSON Renderer - renders components from JSON structure
export function JsonRenderer({ component }: { component: Component }) {
  const { type, props, styles } = component;

  const renderComponent = () => {
    switch (type) {
      case 'heading':
        const HeadingTag = (props.tag || 'h2') as keyof JSX.IntrinsicElements;
        const getHeadingSize = (tag: string): string => {
          switch (tag) {
            case 'h1': return 'text-4xl';
            case 'h2': return 'text-3xl';
            case 'h3': return 'text-2xl';
            case 'h4': return 'text-xl';
            case 'h5': return 'text-lg';
            case 'h6': return 'text-base';
            default: return 'text-2xl';
          }
        };
        
        return (
          <HeadingTag 
            className={`${getHeadingSize(props.tag)} font-semibold`}
            style={styles}
          >
            {props.content || 'Heading'}
          </HeadingTag>
        );

      case 'paragraph':
        return (
          <p className="text-gray-700" style={styles}>
            {props.content || 'Paragraph text'}
          </p>
        );

      case 'button':
        return (
          <button 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            style={styles}
            type="button"
          >
            {props.content || 'Button'}
          </button>
        );

      case 'input':
        return (
          <input
            type={props.type || 'text'}
            placeholder={props.placeholder}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            style={styles}
          />
        );

      case 'image':
        return (
          <img
            src={props.src || 'https://via.placeholder.com/300x200'}
            alt={props.alt || 'Image'}
            className="w-full h-auto rounded-lg"
            style={styles}
          />
        );

      case 'link':
        return (
          <a
            href={props.href || '#'}
            className="text-blue-600 hover:underline"
            style={styles}
          >
            {props.content || 'Link'}
          </a>
        );

      case 'container':
        return (
          <div className="p-4 space-y-4" style={styles}>
            {component.children?.map((child: Component) => (
              <JsonRenderer key={child.id} component={child} />
            ))}
          </div>
        );

      case 'grid':
        const gridCols = props.columns || 2;
        return (
          <div
            className="grid gap-4 p-4"
            style={{
              ...styles,
              gridTemplateColumns: `repeat(${gridCols}, 1fr)`
            }}
          >
            {component.children?.map((child: Component) => (
              <JsonRenderer key={child.id} component={child} />
            ))}
          </div>
        );

      case 'flexbox':
        return (
          <div
            className="flex gap-4 p-4"
            style={{
              ...styles,
              flexDirection: props.direction || 'row'
            }}
          >
            {component.children?.map((child: Component) => (
              <JsonRenderer key={child.id} component={child} />
            ))}
          </div>
        );

      case 'form':
        return (
          <form className="space-y-4 p-4" style={styles}>
            {component.children?.map((child: Component) => (
              <JsonRenderer key={child.id} component={child} />
            ))}
          </form>
        );

      case 'select':
        return (
          <select className="w-full px-3 py-2 border border-gray-300 rounded-lg" style={styles}>
            {(props.options || ['Option 1', 'Option 2']).map((option: string, index: number) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case 'checkbox':
        return (
          <label className="flex items-center space-x-2" style={styles}>
            <input type="checkbox" />
            <span>{props.label || 'Checkbox'}</span>
          </label>
        );

      case 'textarea':
        return (
          <textarea
            placeholder={props.placeholder}
            rows={props.rows || 3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            style={styles}
          />
        );

      // Data Display Components
      case 'card':
        return (
          <div className="border border-gray-200 rounded-lg p-4 shadow-sm bg-white" style={styles}>
            {props.title && <h3 className="text-lg font-semibold mb-2">{props.title}</h3>}
            <div>{props.content || 'Card content goes here'}</div>
            {component.children?.map((child: Component) => (
              <JsonRenderer key={child.id} component={child} />
            ))}
          </div>
        );

      case 'badge':
        return (
          <span 
            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
            style={styles}
          >
            {props.content || 'Badge'}
          </span>
        );

      case 'tag':
        return (
          <span 
            className="inline-flex items-center px-2 py-1 rounded text-sm bg-gray-100 text-gray-800"
            style={styles}
          >
            {props.content || 'Tag'}
            {props.closable && <button className="ml-1 text-gray-500 hover:text-gray-700">×</button>}
          </span>
        );

      case 'avatar':
        return (
          <div className="w-10 h-10 rounded-full overflow-hidden" style={styles}>
            <img 
              src={props.src || 'https://via.placeholder.com/40x40'} 
              alt={props.alt || 'Avatar'}
              className="w-full h-full object-cover"
            />
          </div>
        );

      case 'table':
        return (
          <table className="w-full border-collapse border border-gray-300" style={styles}>
            <thead>
              <tr>
                {(props.headers || ['Column 1', 'Column 2']).map((header: string, index: number) => (
                  <th key={index} className="border border-gray-300 px-4 py-2 bg-gray-50">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(props.rows || [['Data 1', 'Data 2']]).map((row: string[], rowIndex: number) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="border border-gray-300 px-4 py-2">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        );

      case 'list':
        const ListTag = props.type === 'ordered' ? 'ol' : 'ul';
        return (
          <ListTag className="space-y-2" style={styles}>
            {(props.items || ['Item 1', 'Item 2']).map((item: string, index: number) => (
              <li key={index} className="text-gray-700">{item}</li>
            ))}
          </ListTag>
        );

      // Feedback Components
      case 'alert':
        const alertColors = {
          info: 'bg-blue-50 border-blue-200 text-blue-800',
          success: 'bg-green-50 border-green-200 text-green-800',
          warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
          error: 'bg-red-50 border-red-200 text-red-800'
        };
        return (
          <div 
            className={`p-4 rounded-lg border ${alertColors[props.type as keyof typeof alertColors] || alertColors.info}`}
            style={styles}
          >
            {props.showIcon && <span className="mr-2">ℹ️</span>}
            {props.message || 'This is an alert message'}
          </div>
        );

      case 'progress':
        return (
          <div className="w-full" style={styles}>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${props.percentage || 60}%` }}
              ></div>
            </div>
            {props.showText && (
              <div className="text-sm text-gray-600 mt-1">{props.percentage || 60}%</div>
            )}
          </div>
        );

      case 'rate':
        return (
          <div className="flex space-x-1" style={styles}>
            {Array.from({ length: props.count || 5 }, (_, index) => (
              <span 
                key={index}
                className={`text-lg ${index < (props.value || 3) ? 'text-yellow-400' : 'text-gray-300'}`}
              >
                ⭐
              </span>
            ))}
          </div>
        );

      // Navigation Components
      case 'breadcrumb':
        return (
          <nav className="flex items-center space-x-2 text-sm text-gray-600" style={styles}>
            {(props.items || ['Home', 'Page']).map((item: string, index: number, array: string[]) => (
              <span key={index} className="flex items-center">
                <span className="hover:text-blue-600 cursor-pointer">{item}</span>
                {index < array.length - 1 && (
                  <span className="mx-2 text-gray-400">{props.separator || '/'}</span>
                )}
              </span>
            ))}
          </nav>
        );

      case 'steps':
        return (
          <div className="flex items-center justify-between" style={styles}>
            {(props.steps || ['Step 1', 'Step 2']).map((step: string, index: number) => (
              <div key={index} className="flex items-center">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    index <= (props.current || 0) ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {index + 1}
                </div>
                <span className="ml-2 text-sm text-gray-700">{step}</span>
                {index < (props.steps || []).length - 1 && (
                  <div className="w-8 h-0.5 bg-gray-300 mx-4"></div>
                )}
              </div>
            ))}
          </div>
        );

      case 'tabs':
        return (
          <div className="w-full" style={styles}>
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8">
                {(props.items || [{ key: '1', label: 'Tab 1', content: 'Content 1' }]).map((tab: any) => (
                  <button
                    key={tab.key}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      tab.key === (props.activeKey || '1')
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
            <div className="mt-4">
              {(props.items || [{ key: '1', content: 'Content 1' }]).find((tab: any) => tab.key === (props.activeKey || '1'))?.content}
            </div>
          </div>
        );

      // Layout Components (Additional)
      case 'divider':
        return props.orientation === 'vertical' ? (
          <div className="border-l border-gray-300 h-8 mx-4" style={styles}>
            {props.text && <span className="text-sm text-gray-500">{props.text}</span>}
          </div>
        ) : (
          <div className="border-t border-gray-300 my-4 relative" style={styles}>
            {props.text && (
              <span className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-sm text-gray-500">
                {props.text}
              </span>
            )}
          </div>
        );

      case 'collapse':
        return (
          <div className="border border-gray-200 rounded-lg" style={styles}>
            <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50">
              <span className="font-medium">{props.title || 'Panel Title'}</span>
              <span>▼</span>
            </div>
            {props.defaultExpanded && (
              <div className="p-4 border-t border-gray-200">
                {props.content || 'Panel content goes here'}
              </div>
            )}
          </div>
        );

      // Form Components (Additional)
      case 'switch':
        return (
          <label className="flex items-center space-x-2" style={styles}>
            <div className={`relative inline-flex h-6 w-11 items-center rounded-full ${props.checked ? 'bg-blue-600' : 'bg-gray-200'}`}>
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${props.checked ? 'translate-x-6' : 'translate-x-1'}`} />
            </div>
            <span>{props.label || 'Switch'}</span>
          </label>
        );

      case 'slider':
        return (
          <div className="w-full" style={styles}>
            <input
              type="range"
              min={props.min || 0}
              max={props.max || 100}
              defaultValue={props.value || 50}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        );

      default:
        return (
          <div className="p-4 border border-gray-300 rounded-lg bg-gray-50" style={styles}>
            <span className="text-gray-600">{type} Component</span>
          </div>
        );
    }
  };

  return renderComponent();
}

// Component to render the full JSON structure
export function JsonTreeRenderer({ components }: { components: Component[] }) {
  return (
    <div className="space-y-4">
      {components.map((component) => (
        <JsonRenderer key={component.id} component={component} />
      ))}
    </div>
  );
}