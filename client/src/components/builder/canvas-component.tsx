import { useDrag } from 'react-dnd';
import { Component, ComponentType } from '@shared/schema';
import { DragItemTypes } from '@/lib/drag-drop-utils';
import { Trash2, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CanvasComponentProps {
  component: Component;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onUpdatePosition: (id: string, position: { x: number; y: number }) => void;
}

export function CanvasComponent({
  component,
  isSelected,
  onSelect,
  onDelete,
  onDuplicate,
  onUpdatePosition
}: CanvasComponentProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: DragItemTypes.CANVAS_COMPONENT,
    item: { id: component.id, type: component.type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(component.id);
  };

  const renderComponent = () => {
    const { type, props, styles } = component;
    const combinedStyles = {
      ...styles,
      ...(component.position && {
        position: 'relative' as const,
        left: `${component.position.x}px`,
        top: `${component.position.y}px`
      })
    };

    switch (type) {
      case 'heading':
        const HeadingTag = (props.tag || 'h2') as keyof JSX.IntrinsicElements;
        return (
          <HeadingTag 
            className={props.className}
            style={combinedStyles}
          >
            {props.content || 'Heading'}
          </HeadingTag>
        );

      case 'paragraph':
        return (
          <p 
            className={props.className}
            style={combinedStyles}
          >
            {props.content || 'Paragraph text'}
          </p>
        );

      case 'button':
        return (
          <button 
            className={props.className}
            style={combinedStyles}
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
            className={props.className}
            style={combinedStyles}
          />
        );

      case 'image':
        return (
          <img
            src={props.src || 'https://via.placeholder.com/300x200'}
            alt={props.alt || 'Image'}
            className={props.className}
            style={combinedStyles}
          />
        );

      case 'link':
        return (
          <a
            href={props.href || '#'}
            className={props.className}
            style={combinedStyles}
          >
            {props.content || 'Link'}
          </a>
        );

      case 'container':
        return (
          <div
            className={props.className}
            style={combinedStyles}
          >
            {component.children?.map((child) => (
              <CanvasComponent
                key={child.id}
                component={child}
                isSelected={false}
                onSelect={onSelect}
                onDelete={onDelete}
                onDuplicate={onDuplicate}
                onUpdatePosition={onUpdatePosition}
              />
            ))}
            {(!component.children || component.children.length === 0) && (
              <div className="text-center py-4 text-gray-400 text-sm">
                Container - Drop components here
              </div>
            )}
          </div>
        );

      case 'grid':
        const gridCols = props.columns || 2;
        return (
          <div
            className={props.className}
            style={{
              ...combinedStyles,
              display: 'grid',
              gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
              gap: props.gap || '16px'
            }}
          >
            {component.children?.map((child) => (
              <CanvasComponent
                key={child.id}
                component={child}
                isSelected={false}
                onSelect={onSelect}
                onDelete={onDelete}
                onDuplicate={onDuplicate}
                onUpdatePosition={onUpdatePosition}
              />
            ))}
            {Array.from({ length: Math.max(0, gridCols - (component.children?.length || 0)) }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="min-h-16 border border-gray-200 rounded bg-gray-50 flex items-center justify-center text-gray-400 text-sm"
              >
                Drop content here
              </div>
            ))}
          </div>
        );

      case 'flexbox':
        return (
          <div
            className={props.className}
            style={{
              ...combinedStyles,
              display: 'flex',
              flexDirection: props.direction || 'row',
              gap: props.gap || '16px'
            }}
          >
            {component.children?.map((child) => (
              <CanvasComponent
                key={child.id}
                component={child}
                isSelected={false}
                onSelect={onSelect}
                onDelete={onDelete}
                onDuplicate={onDuplicate}
                onUpdatePosition={onUpdatePosition}
              />
            ))}
            {(!component.children || component.children.length === 0) && (
              <div className="text-center py-4 text-gray-400 text-sm">
                Flexbox - Drop components here
              </div>
            )}
          </div>
        );

      case 'form':
        return (
          <form
            className={props.className}
            style={combinedStyles}
            onSubmit={(e) => e.preventDefault()}
          >
            {component.children?.map((child) => (
              <CanvasComponent
                key={child.id}
                component={child}
                isSelected={false}
                onSelect={onSelect}
                onDelete={onDelete}
                onDuplicate={onDuplicate}
                onUpdatePosition={onUpdatePosition}
              />
            ))}
            {(!component.children || component.children.length === 0) && (
              <div className="text-center py-4 text-gray-400 text-sm">
                Form - Drop form elements here
              </div>
            )}
          </form>
        );

      case 'select':
        return (
          <select
            className={props.className}
            style={combinedStyles}
          >
            {(props.options || ['Option 1', 'Option 2']).map((option: string, index: number) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case 'checkbox':
        return (
          <label className={props.className} style={combinedStyles}>
            <input type="checkbox" className="mr-2" />
            {props.label || 'Checkbox'}
          </label>
        );

      case 'textarea':
        return (
          <textarea
            placeholder={props.placeholder}
            rows={props.rows || 3}
            className={props.className}
            style={combinedStyles}
          />
        );

      default:
        return (
          <div 
            className="p-4 border border-gray-300 rounded-lg bg-gray-50"
            style={combinedStyles}
          >
            <span className="text-gray-600">{type} Component</span>
          </div>
        );
    }
  };

  return (
    <div
      ref={drag}
      className={`relative group transition-all ${
        isSelected ? 'ring-2 ring-primary ring-offset-2' : ''
      } ${isDragging ? 'opacity-50' : ''}`}
      onClick={handleClick}
    >
      {renderComponent()}
      
      {/* Component controls */}
      {isSelected && (
        <div className="absolute -top-2 -right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="sm"
            variant="outline"
            className="w-6 h-6 p-0 bg-white"
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate(component.id);
            }}
          >
            <Copy className="w-3 h-3" />
          </Button>
          <Button
            size="sm"
            variant="destructive"
            className="w-6 h-6 p-0"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(component.id);
            }}
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      )}
    </div>
  );
}
