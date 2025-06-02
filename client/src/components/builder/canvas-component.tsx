import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Component, ComponentType } from '@shared/schema';
import { DragItemTypes } from '@/lib/drag-drop-utils';
import { createComponent } from '@/lib/component-implementations';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Copy, Trash2 } from 'lucide-react';

interface CanvasComponentProps {
  component: Component;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onAddComponent: (type: ComponentType, position?: { x: number; y: number }, parentId?: string) => void;
}

// Container Drop Zone Component
function ContainerDropZone({
  component,
  onAddComponent,
  className,
  style,
  children,
}: {
  component: Component;
  onAddComponent: (type: ComponentType, position?: { x: number; y: number }, parentId?: string) => void;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: [DragItemTypes.COMPONENT, DragItemTypes.CANVAS_COMPONENT],
    drop: (item: { type: string; id?: string }, monitor) => {
      if (!monitor.didDrop()) {
        if (item.id) {
          // Moving existing component - handled by parent
          return;
        } else {
          // Adding new component to container
          onAddComponent(item.type as ComponentType, undefined, component.mf_id);
        }
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
      canDrop: monitor.canDrop(),
    }),
  }));

  return (
    <div
      ref={drop}
      className={cn(
        className,
        isOver && canDrop && 'ring-2 ring-primary ring-offset-2 bg-primary/5'
      )}
      style={style}
    >
      {children}
      {isOver && canDrop && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-2 border-2 border-dashed border-primary rounded-lg flex items-center justify-center">
            <div className="bg-primary/10 px-3 py-1.5 rounded-md">
              <span className="text-sm text-primary font-medium">Drop here</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function CanvasComponent({
  component,
  isSelected,
  onSelect,
  onDelete,
  onDuplicate,
  onAddComponent,
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

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(component.id);
  };

  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDuplicate(component.id);
  };

  // Special handling for container-type components (grid, container, etc.)
  const isContainerType = ['container', 'grid'].includes(component.ui_template.id);
  const hasChildren = component.components && component.components.length > 0;

  const renderContent = () => {
    if (isContainerType) {
      return (
        <ContainerDropZone
          component={component}
          onAddComponent={onAddComponent}
          className={cn(
            'relative min-h-[100px] transition-all',
            !hasChildren && 'border-2 border-dashed border-border'
          )}
          style={component.styles}
        >
          {hasChildren ? (
            <div className={cn(
              'grid gap-4',
              component.ui_template.id === 'grid' && `grid-cols-${component.ui_template.props.columns || 2}`
            )}>
              {component.components?.map((child: Component) => (
                <CanvasComponent
                  key={child.id}
                  component={child}
                  isSelected={false}
                  onSelect={onSelect}
                  onDelete={onDelete}
                  onDuplicate={onDuplicate}
                  onAddComponent={onAddComponent}
                />
              ))}
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
              <span className="text-sm">Drop components here</span>
            </div>
          )}
        </ContainerDropZone>
      );
    }
    return createComponent(component, {
      className: cn(
        'relative cursor-move transition-all',
        isSelected && 'outline-none',
        component.ui_template.props?.className
      ),
    });
  };

  return (
    <div
      ref={drag}
      className={cn(
        'relative group',
        isDragging && 'opacity-50',
        isSelected && 'ring-2 ring-primary ring-offset-2'
      )}
      onClick={handleClick}
    >
      {/* Component Controls */}
      <div className={cn(
        'absolute -top-2 -right-2 flex items-center space-x-1 opacity-0 transition-opacity z-10',
        (isSelected || isDragging) && 'opacity-100',
        'group-hover:opacity-100'
      )}>
        <Button
          size="icon"
          variant="outline"
          className="h-6 w-6"
          onClick={handleDuplicate}
        >
          <Copy className="h-3 w-3" />
        </Button>
        <Button
          size="icon"
          variant="destructive"
          className="h-6 w-6"
          onClick={handleDelete}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>

      {/* Component Content */}
      {renderContent()}
    </div>
  );
}
