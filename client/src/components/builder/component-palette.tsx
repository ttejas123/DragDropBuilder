import { useDrag } from 'react-dnd';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { COMPONENT_DEFINITIONS, getComponentsByCategory } from '@/lib/component-types';
import { DragItemTypes } from '@/lib/drag-drop-utils';
import { useState } from 'react';
import { Search, Type, AlignLeft, MousePointer, Edit3, Image, Link, Square, Grid3X3, ArrowLeftRight, FileText, List, CheckSquare, CreditCard, Award, Tag, User, Table, AlertTriangle, TrendingUp, Star, ChevronRight, MoreHorizontal, Folder, Minus, ChevronDown, ToggleLeft, Sliders } from 'lucide-react';

interface DraggableComponentProps {
  type: string;
  name: string;
  icon: string;
  description: string;
}

function DraggableComponent({ type, name, icon, description }: DraggableComponentProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: DragItemTypes.COMPONENT,
    item: { type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  // Map icon names to actual Lucide components
  const IconComponent = {
    'Type': Type,
    'AlignLeft': AlignLeft,
    'MousePointer': MousePointer,
    'Edit3': Edit3,
    'Image': Image,
    'Link': Link,
    'Square': Square,
    'Grid3X3': Grid3X3,
    'ArrowLeftRight': ArrowLeftRight,
    'FileText': FileText,
    'List': List,
    'CheckSquare': CheckSquare,
    'CreditCard': CreditCard,
    'Award': Award,
    'Tag': Tag,
    'User': User,
    'Table': Table,
    'AlertTriangle': AlertTriangle,
    'TrendingUp': TrendingUp,
    'Star': Star,
    'ChevronRight': ChevronRight,
    'MoreHorizontal': MoreHorizontal,
    'Folder': Folder,
    'Minus': Minus,
    'ChevronDown': ChevronDown,
    'ToggleLeft': ToggleLeft,
    'Sliders': Sliders,
  }[icon] || Square;

  return (
    <div
      ref={drag}
      className={`group cursor-move p-3 border border-gray-200 rounded-lg hover:border-primary hover:shadow-sm transition-all bg-white ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="flex flex-col items-center text-center">
        <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center mb-2 group-hover:bg-blue-200 transition-colors">
          <IconComponent className="w-4 h-4 text-blue-600" />
        </div>
        <span className="text-xs font-medium text-gray-900 group-hover:text-primary transition-colors">
          {name}
        </span>
        <span className="text-xs text-gray-500 mt-0.5">{description}</span>
      </div>
    </div>
  );
}

export function ComponentPalette() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'basic' | 'layout' | 'form' | 'data' | 'feedback' | 'navigation'>('all');

  const filteredComponents = COMPONENT_DEFINITIONS.filter(component => {
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
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">Components</h2>
        
        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
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
                <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
                  Basic Elements
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {basicComponents.map((component) => (
                    <DraggableComponent
                      key={component.type}
                      type={component.type}
                      name={component.name}
                      icon={component.icon}
                      description={component.description}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Layout Components */}
            {layoutComponents.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
                  Layout
                </h3>
                <div className="space-y-2">
                  {layoutComponents.map((component) => (
                    <Card key={component.type} className="p-3 hover:border-primary cursor-move transition-colors">
                      <DraggableComponent
                        type={component.type}
                        name={component.name}
                        icon={component.icon}
                        description={component.description}
                      />
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Form Components */}
            {formComponents.length > 0 && (
              <div>
                <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
                  Forms
                </h3>
                <div className="space-y-2">
                  {formComponents.map((component) => (
                    <Card key={component.type} className="p-3 hover:border-primary cursor-move transition-colors">
                      <DraggableComponent
                        type={component.type}
                        name={component.name}
                        icon={component.icon}
                        description={component.description}
                      />
                    </Card>
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
                type={component.type}
                name={component.name}
                icon={component.icon}
                description={component.description}
              />
            ))}
          </div>
        )}

        {filteredComponents.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <Search className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm">No components found</p>
          </div>
        )}
      </div>
    </div>
  );
}
