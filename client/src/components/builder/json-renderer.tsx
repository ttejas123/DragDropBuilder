import { Component } from '@shared/schema';

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