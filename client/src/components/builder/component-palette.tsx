import { useDrag } from 'react-dnd';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { DragItemTypes } from '@/lib/drag-drop-utils';
import { useState } from 'react';
import { Search } from 'lucide-react';
import { ComponentDefinition, componentRegistry, getComponentsByCategory } from '@/lib/component-registry';

interface DraggableComponentProps {
  component: ComponentDefinition;
}

function DraggableComponent({ component }: DraggableComponentProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: DragItemTypes.COMPONENT,
    item: { type: component.type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const Icon = component.icon;

  return (
    <div
      ref={drag}
      className={`group cursor-move p-3 border border-input rounded-lg hover:border-primary hover:shadow-sm transition-all bg-background ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="flex flex-col items-center text-center">
        <div className="w-8 h-8 bg-primary/10 rounded-md flex items-center justify-center mb-2 group-hover:bg-primary/20 transition-colors">
          <Icon className="w-4 h-4 text-primary" />
        </div>
        <span className="text-xs font-medium text-foreground group-hover:text-primary transition-colors">
          {component.name}
        </span>
        <span className="text-xs text-muted-foreground mt-0.5">{component.description}</span>
      </div>
    </div>
  );
}

export function ComponentPalette() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'basic' | 'layout' | 'form' | 'data' | 'feedback' | 'navigation'>('all');

  const filteredComponents = Object.values(componentRegistry).filter(component => {
    const matchesSearch = component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         component.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || component.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const basicComponents = getComponentsByCategory('basic').filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const layoutComponents = getComponentsByCategory('layout').filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const formComponents = getComponentsByCategory('form').filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const dataComponents = getComponentsByCategory('data').filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const feedbackComponents = getComponentsByCategory('feedback').filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const navigationComponents = getComponentsByCategory('navigation').filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-80 bg-background border-r border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="text-sm font-semibold text-foreground mb-3">Components</h2>
        
        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search components..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 text-sm"
          />
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-1">
          {(['all', 'basic', 'layout', 'form', 'data', 'feedback', 'navigation'] as const).map((category) => (
            <Badge
              key={category}
              variant={activeCategory === category ? "default" : "secondary"}
              className="cursor-pointer text-xs px-2 py-1"
              onClick={() => setActiveCategory(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Badge>
          ))}
        </div>
      </div>

      {/* Component List */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeCategory === 'all' ? (
          <>
            {/* Basic Components */}
            {basicComponents.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
                  Basic Elements
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {basicComponents.map((component) => (
                    <DraggableComponent
                      key={component.type}
                      component={component}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Layout Components */}
            {layoutComponents.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
                  Layout
                </h3>
                <div className="space-y-2">
                  {layoutComponents.map((component) => (
                    <Card key={component.type} className="p-3 hover:border-primary cursor-move transition-colors">
                      <DraggableComponent
                        component={component}
                      />
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Form Components */}
            {formComponents.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
                  Forms
                </h3>
                <div className="space-y-2">
                  {formComponents.map((component) => (
                    <Card key={component.type} className="p-3 hover:border-primary cursor-move transition-colors">
                      <DraggableComponent
                        component={component}
                      />
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Data Display Components */}
            {dataComponents.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
                  Data Display
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {dataComponents.map((component) => (
                    <DraggableComponent
                      key={component.type}
                      component={component}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Feedback Components */}
            {feedbackComponents.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
                  Feedback
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {feedbackComponents.map((component) => (
                    <DraggableComponent
                      key={component.type}
                      component={component}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Navigation Components */}
            {navigationComponents.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
                  Navigation
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {navigationComponents.map((component) => (
                    <DraggableComponent
                      key={component.type}
                      component={component}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {filteredComponents.map((component) => (
              <DraggableComponent
                key={component.type}
                component={component}
              />
            ))}
          </div>
        )}

        {filteredComponents.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Search className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm">No components found</p>
          </div>
        )}
      </div>
    </div>
  );
}
