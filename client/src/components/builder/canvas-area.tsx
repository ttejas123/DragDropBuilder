import { useDrop } from 'react-dnd';
import { useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Component, ComponentType } from '@shared/schema';
import { DragItemTypes, getDropPosition } from '@/lib/drag-drop-utils';
import { CanvasComponent } from './canvas-component';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { JsonTreeRenderer } from './json-renderer';
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
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('mobile');
  const [zoom, setZoom] = useState(100);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

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

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 25));
  };

  const handlePreview = () => {
    setIsPreviewOpen(true);
  };

  const getCanvasSize = () => {
    switch (viewport) {
      case 'mobile':
        return { width: 375, height: 667 };
      case 'tablet':
        return { width: 768, height: 1024 };
      default:
        return { width: 1200, height: 800 };
    }
  };

  const canvasSize = getCanvasSize();
  const scaledWidth = (canvasSize.width * zoom) / 100;
  const scaledHeight = (canvasSize.height * zoom) / 100;

  return (
    <div className="flex-1 flex flex-col bg-muted/50">
      {/* Toolbar */}
      <div className="p-2 flex items-center justify-between border-b bg-background">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleZoomOut}
            disabled={zoom <= 25}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm tabular-nums">
            {zoom}%
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={handleZoomIn}
            disabled={zoom >= 200}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <Select
            value={viewport}
            onValueChange={(value) => setViewport(value as typeof viewport)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desktop">
                <div className="flex items-center">
                  <Monitor className="w-4 h-4 mr-2" />
                  Desktop
                </div>
              </SelectItem>
              <SelectItem value="tablet">
                <div className="flex items-center">
                  <Tablet className="w-4 h-4 mr-2" />
                  Tablet
                </div>
              </SelectItem>
              <SelectItem value="mobile">
                <div className="flex items-center">
                  <Smartphone className="w-4 h-4 mr-2" />
                  Mobile
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="icon"
            onClick={handlePreview}
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 p-8 overflow-auto">
        <div className="flex items-center justify-center min-h-full">
          <Card
            ref={drop}
            className={`p-6 relative transition-all ${
              isOver && canDrop ? 'ring-2 ring-primary ring-offset-2 bg-primary/5' : 'bg-background'
            }`}
            style={{
              width: `${scaledWidth}px`,
              height: `${scaledHeight}px`,
              transform: `scale(${zoom / 100})`,
              transformOrigin: 'top left',
            }}
            onClick={handleCanvasClick}
          >
            {/* Drop zone indicator */}
            {components.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground pointer-events-none">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
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
                  onAddComponent={onAddComponent}
                />
              ))}
            </div>

            {/* Drop zone overlay */}
            {isOver && canDrop && (
              <div className="absolute inset-0 border-2 border-dashed border-primary rounded-lg flex items-center justify-center bg-primary/5 pointer-events-none">
                <div className="text-center">
                  <i className="fas fa-plus-circle text-4xl text-primary mb-2" />
                  <p className="text-primary font-medium">Drop component here</p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
      
      {/* Preview Modal */}
      <Dialog open={isPreviewOpen} onOpenChange={() => setIsPreviewOpen(false)}>
        <DialogContent className="max-w-4xl w-full h-[80vh]">
          <DialogHeader>
            <DialogTitle>Preview</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-auto p-4 bg-muted rounded-lg">
            {components.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Eye className="w-16 h-16 mx-auto mb-4" />
                <p className="text-lg font-medium mb-2">No components to preview</p>
                <p className="text-sm">Add some components to see the preview</p>
              </div>
            ) : (
              <div className="bg-background p-6 rounded-lg shadow-sm">
                <JsonTreeRenderer components={components} />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
