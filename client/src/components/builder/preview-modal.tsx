import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Component } from '@shared/schema';
import { X, Smartphone, Tablet, Monitor } from 'lucide-react';
import { useState } from 'react';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  components: Component[];
}

function PreviewComponent({ component }: { component: Component }) {
  const { type, props, styles } = component;
  
  switch (type) {
    case 'heading':
      const HeadingTag = (props.tag || 'h2') as keyof JSX.IntrinsicElements;
      return (
        <HeadingTag 
          className={props.className}
          style={styles}
        >
          {props.content || 'Heading'}
        </HeadingTag>
      );

    case 'paragraph':
      return (
        <p 
          className={props.className}
          style={styles}
        >
          {props.content || 'Paragraph text'}
        </p>
      );

    case 'button':
      return (
        <button 
          className={props.className}
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
          className={props.className}
          style={styles}
        />
      );

    case 'image':
      return (
        <img
          src={props.src || 'https://via.placeholder.com/300x200'}
          alt={props.alt || 'Image'}
          className={props.className}
          style={styles}
        />
      );

    case 'link':
      return (
        <a
          href={props.href || '#'}
          className={props.className}
          style={styles}
        >
          {props.content || 'Link'}
        </a>
      );

    case 'container':
      return (
        <div
          className={props.className}
          style={styles}
        >
          {component.children?.map((child: Component) => (
            <PreviewComponent key={child.id} component={child} />
          ))}
        </div>
      );

    case 'grid':
      const gridCols = props.columns || 2;
      return (
        <div
          className={props.className}
          style={{
            ...styles,
            display: 'grid',
            gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
            gap: props.gap || '16px'
          }}
        >
          {component.children?.map((child: Component) => (
            <PreviewComponent key={child.id} component={child} />
          ))}
        </div>
      );

    case 'flexbox':
      return (
        <div
          className={props.className}
          style={{
            ...styles,
            display: 'flex',
            flexDirection: props.direction || 'row',
            gap: props.gap || '16px'
          }}
        >
          {component.children?.map((child: Component) => (
            <PreviewComponent key={child.id} component={child} />
          ))}
        </div>
      );

    case 'form':
      return (
        <form
          className={props.className}
          style={styles}
          onSubmit={(e) => e.preventDefault()}
        >
          {component.children?.map((child: Component) => (
            <PreviewComponent key={child.id} component={child} />
          ))}
        </form>
      );

    case 'select':
      return (
        <select
          className={props.className}
          style={styles}
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
        <label className={props.className} style={styles}>
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
          style={styles}
        />
      );

    default:
      return (
        <div 
          className="p-4 border border-gray-300 rounded-lg bg-gray-50"
          style={styles}
        >
          <span className="text-gray-600">{type} Component</span>
        </div>
      );
  }
}

export function PreviewModal({ isOpen, onClose, components }: PreviewModalProps) {
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const getDeviceStyles = () => {
    switch (previewDevice) {
      case 'mobile':
        return { width: '375px', height: '667px' };
      case 'tablet':
        return { width: '768px', height: '1024px' };
      default:
        return { width: '1200px', height: '800px' };
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl w-full h-[90vh] flex flex-col">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="flex items-center space-x-2">
            <span>Preview</span>
          </DialogTitle>
          
          <div className="flex items-center space-x-2">
            {/* Device selector */}
            <div className="flex items-center space-x-1 border rounded-lg p-1">
              <Button
                size="sm"
                variant={previewDevice === 'desktop' ? 'default' : 'ghost'}
                onClick={() => setPreviewDevice('desktop')}
                className="px-2 py-1"
              >
                <Monitor className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant={previewDevice === 'tablet' ? 'default' : 'ghost'}
                onClick={() => setPreviewDevice('tablet')}
                className="px-2 py-1"
              >
                <Tablet className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant={previewDevice === 'mobile' ? 'default' : 'ghost'}
                onClick={() => setPreviewDevice('mobile')}
                className="px-2 py-1"
              >
                <Smartphone className="w-4 h-4" />
              </Button>
            </div>
            
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 flex items-center justify-center bg-gray-100 rounded-lg p-8 overflow-auto">
          <div 
            className="bg-white rounded-lg shadow-lg overflow-auto"
            style={getDeviceStyles()}
          >
            <div className="p-6 space-y-4">
              {components.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Monitor className="w-16 h-16 mx-auto mb-4" />
                  <p className="text-lg font-medium mb-2">No components to preview</p>
                  <p className="text-sm">Add some components to see the preview</p>
                </div>
              ) : (
                components.map((component) => (
                  <PreviewComponent key={component.id} component={component} />
                ))
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}