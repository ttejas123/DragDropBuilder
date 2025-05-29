import { useDrop } from 'react-dnd';
import { useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Component, ComponentType } from '@shared/schema';
import { DragItemTypes, getDropPosition } from '@/lib/drag-drop-utils';
import { CanvasComponent } from './canvas-component';
import { Undo, Redo, ZoomIn, ZoomOut, Eye, Smartphone, Tablet, Monitor } from 'lucide-react';

interface CanvasAreaProps {
  components: Component[];
  selectedComponentId: string | null;
  onAddComponent: (type: ComponentType, position?: { x: number; y: number }) => void;
  onSelectComponent: (id: string | null) => void;
  onDeleteComponent: (id: string) => void;
  onDuplicateComponent: (id: string) => void;
  onMoveComponent: (id: string, position: { x: number; y: number }) => void;
}

export function CanvasArea({
  components,
  selectedComponentId,
  onAddComponent,
  onSelectComponent,
  onDeleteComponent,
  onDuplicateComponent,
  onMoveComponent
}: CanvasAreaProps) {
  const canvasRef = useRef<HTMLDivElement>(null);

  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: [DragItemTypes.COMPONENT, DragItemTypes.CANVAS_COMPONENT],
    drop: (item: { type: string; id?: string }, monitor) => {
      if (!monitor.didDrop()) {
        const position = getDropPosition(monitor, canvasRef);
        
        if (item.id) {
          // Moving existing component
          onMoveComponent(item.id, position);
        } else {
          // Adding new component
          onAddComponent(item.type as ComponentType, position);
        }
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
      canDrop: monitor.canDrop(),
    }),
  }));

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onSelectComponent(null);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-100">
      {/* Canvas Toolbar */}
      <div className="bg-white border-b border-gray-200 p-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="text-sm font-medium text-gray-700">Canvas</span>
          
          {/* Viewport selector */}
          <Select defaultValue="desktop">
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desktop">
                <div className="flex items-center space-x-2">
                  <Monitor className="w-4 h-4" />
                  <span>Desktop</span>
                </div>
              </SelectItem>
              <SelectItem value="tablet">
                <div className="flex items-center space-x-2">
                  <Tablet className="w-4 h-4" />
                  <span>Tablet</span>
                </div>
              </SelectItem>
              <SelectItem value="mobile">
                <div className="flex items-center space-x-2">
                  <Smartphone className="w-4 h-4" />
                  <span>Mobile</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

          <div className="h-4 w-px bg-gray-300" />
          
          {/* Undo/Redo */}
          <Button variant="ghost" size="sm" disabled>
            <Undo className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" disabled>
            <Redo className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Zoom:</span>
          <Button variant="ghost" size="sm">
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-sm text-gray-600 px-2">100%</span>
          <Button variant="ghost" size="sm">
            <ZoomIn className="w-4 h-4" />
          </Button>
          
          <div className="h-4 w-px bg-gray-300 mx-2" />
          
          <Button variant="outline" size="sm">
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
        </div>
      </div>

      {/* Canvas Content */}
      <div className="flex-1 p-8 overflow-auto">
        <div className="max-w-4xl mx-auto">
          <Card
            ref={(node) => {
              canvasRef.current = node;
              drop(node);
            }}
            className={`min-h-96 p-6 relative transition-all ${
              isOver && canDrop ? 'ring-2 ring-primary ring-offset-2 bg-blue-50' : 'bg-white'
            }`}
            onClick={handleCanvasClick}
          >
            {/* Drop zone indicator */}
            {components.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400 pointer-events-none">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <i className="fas fa-plus-circle text-2xl" />
                  </div>
                  <p className="text-lg font-medium mb-2">Drop components here to start building</p>
                  <p className="text-sm">Drag components from the left panel to create your UI</p>
                </div>
              </div>
            )}

            {/* Canvas components */}
            <div className="space-y-4">
              {components.map((component) => (
                <CanvasComponent
                  key={component.id}
                  component={component}
                  isSelected={selectedComponentId === component.id}
                  onSelect={onSelectComponent}
                  onDelete={onDeleteComponent}
                  onDuplicate={onDuplicateComponent}
                  onUpdatePosition={onMoveComponent}
                  onAddComponent={onAddComponent}
                />
              ))}
            </div>

            {/* Drop zone overlay */}
            {isOver && canDrop && (
              <div className="absolute inset-0 border-2 border-dashed border-primary rounded-lg flex items-center justify-center bg-blue-50 bg-opacity-50 pointer-events-none">
                <div className="text-center">
                  <i className="fas fa-plus-circle text-4xl text-primary mb-2" />
                  <p className="text-primary font-medium">Drop component here</p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
