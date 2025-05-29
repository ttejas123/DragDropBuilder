import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Component } from '@shared/schema';
import { getComponentDefinition } from '@/lib/component-types';
import { Trash2, Copy, ChevronDown, ChevronRight } from 'lucide-react';

interface PropertiesPanelProps {
  components: Component[];
  selectedComponent: Component | null;
  onUpdateProps: (id: string, props: Record<string, any>) => void;
  onUpdateStyles: (id: string, styles: Record<string, string>) => void;
  onSelectComponent: (id: string | null) => void;
  onDeleteComponent: (id: string) => void;
  onDuplicateComponent: (id: string) => void;
}

export function PropertiesPanel({
  components,
  selectedComponent,
  onUpdateProps,
  onUpdateStyles,
  onSelectComponent,
  onDeleteComponent,
  onDuplicateComponent
}: PropertiesPanelProps) {
  const [expandedTreeItems, setExpandedTreeItems] = useState<Set<string>>(new Set());

  const toggleTreeItem = (id: string) => {
    const newExpanded = new Set(expandedTreeItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedTreeItems(newExpanded);
  };

  const renderTreeItem = (component: Component, level = 0) => {
    const hasChildren = component.children && component.children.length > 0;
    const isExpanded = expandedTreeItems.has(component.id);
    const isSelected = selectedComponent?.id === component.id;
    const definition = getComponentDefinition(component.type);

    return (
      <div key={component.id}>
        <div
          className={`flex items-center py-1 px-2 rounded text-sm cursor-pointer transition-colors ${
            isSelected ? 'bg-blue-50 border border-blue-200 text-blue-700' : 'hover:bg-gray-100 text-gray-700'
          }`}
          style={{ paddingLeft: `${8 + level * 16}px` }}
          onClick={() => onSelectComponent(component.id)}
        >
          {hasChildren ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleTreeItem(component.id);
              }}
              className="mr-1 p-0.5 hover:bg-gray-200 rounded"
            >
              {isExpanded ? (
                <ChevronDown className="w-3 h-3" />
              ) : (
                <ChevronRight className="w-3 h-3" />
              )}
            </button>
          ) : (
            <div className="w-4 mr-1" />
          )}
          
          <i className={`${definition?.icon || 'fas fa-square'} text-xs mr-2 ${
            isSelected ? 'text-blue-500' : 'text-gray-500'
          }`} />
          
          <span className={`flex-1 ${isSelected ? 'font-medium' : ''}`}>
            {definition?.name || component.type}
          </span>
          
          <span className="text-xs text-gray-400 ml-auto">
            #{component.id.split('-')[0]}
          </span>
        </div>
        
        {hasChildren && isExpanded && (
          <div>
            {component.children!.map((child) => renderTreeItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const updateProp = (key: string, value: any) => {
    if (!selectedComponent) return;
    const newProps = { ...selectedComponent.props, [key]: value };
    onUpdateProps(selectedComponent.id, newProps);
  };

  const updateStyle = (key: string, value: string) => {
    if (!selectedComponent) return;
    const newStyles = { ...selectedComponent.styles, [key]: value };
    onUpdateStyles(selectedComponent.id, newStyles);
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
      <Tabs defaultValue="properties" className="flex-1 flex flex-col">
        {/* Tabs Header */}
        <TabsList className="grid w-full grid-cols-3 rounded-none border-b">
          <TabsTrigger value="properties" className="text-xs">Properties</TabsTrigger>
          <TabsTrigger value="styles" className="text-xs">Styles</TabsTrigger>
          <TabsTrigger value="tree" className="text-xs">Tree</TabsTrigger>
        </TabsList>

        {/* Properties Tab */}
        <TabsContent value="properties" className="flex-1 overflow-y-auto m-0 p-4">
          {selectedComponent ? (
            <div className="space-y-6">
              {/* Component Info */}
              <Card className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-900">Selected Component</h3>
                  <div className="flex space-x-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onDuplicateComponent(selectedComponent.id)}
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => onDeleteComponent(selectedComponent.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded p-2">
                  <div className="flex items-center space-x-2 mb-1">
                    <i className={`${getComponentDefinition(selectedComponent.type)?.icon || 'fas fa-square'} text-primary text-sm`} />
                    <span className="text-sm font-medium text-gray-900">
                      {getComponentDefinition(selectedComponent.type)?.name || selectedComponent.type}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">ID: {selectedComponent.id}</div>
                </div>
              </Card>

              {/* Basic Properties */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="component-id" className="text-sm font-medium">Component ID</Label>
                  <Input
                    id="component-id"
                    value={selectedComponent.id}
                    readOnly
                    className="mt-1 text-sm bg-gray-50"
                  />
                </div>

                <div>
                  <Label htmlFor="css-classes" className="text-sm font-medium">CSS Classes</Label>
                  <Input
                    id="css-classes"
                    value={selectedComponent.props.className || ''}
                    onChange={(e) => updateProp('className', e.target.value)}
                    placeholder="Enter CSS classes..."
                    className="mt-1 text-sm"
                  />
                </div>

                <div>
                  <Label htmlFor="data-id" className="text-sm font-medium">Data ID</Label>
                  <Input
                    id="data-id"
                    value={selectedComponent.dataId || ''}
                    onChange={(e) => onUpdateProps(selectedComponent.id, { ...selectedComponent.props, dataId: e.target.value })}
                    placeholder="data_id for store binding"
                    className="mt-1 text-sm"
                  />
                </div>

                {/* Component-specific properties */}
                {selectedComponent.type === 'heading' && (
                  <>
                    <div>
                      <Label htmlFor="content" className="text-sm font-medium">Content</Label>
                      <Textarea
                        id="content"
                        value={selectedComponent.props.content || ''}
                        onChange={(e) => updateProp('content', e.target.value)}
                        placeholder="Enter text content..."
                        className="mt-1 text-sm resize-none"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="tag" className="text-sm font-medium">Heading Level</Label>
                      <Select value={selectedComponent.props.tag || 'h2'} onValueChange={(value) => updateProp('tag', value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="h1">H1</SelectItem>
                          <SelectItem value="h2">H2</SelectItem>
                          <SelectItem value="h3">H3</SelectItem>
                          <SelectItem value="h4">H4</SelectItem>
                          <SelectItem value="h5">H5</SelectItem>
                          <SelectItem value="h6">H6</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                {selectedComponent.type === 'paragraph' && (
                  <div>
                    <Label htmlFor="content" className="text-sm font-medium">Content</Label>
                    <Textarea
                      id="content"
                      value={selectedComponent.props.content || ''}
                      onChange={(e) => updateProp('content', e.target.value)}
                      placeholder="Enter text content..."
                      className="mt-1 text-sm resize-none"
                      rows={4}
                    />
                  </div>
                )}

                {selectedComponent.type === 'button' && (
                  <div>
                    <Label htmlFor="content" className="text-sm font-medium">Button Text</Label>
                    <Input
                      id="content"
                      value={selectedComponent.props.content || ''}
                      onChange={(e) => updateProp('content', e.target.value)}
                      placeholder="Button text..."
                      className="mt-1 text-sm"
                    />
                  </div>
                )}

                {selectedComponent.type === 'input' && (
                  <>
                    <div>
                      <Label htmlFor="placeholder" className="text-sm font-medium">Placeholder</Label>
                      <Input
                        id="placeholder"
                        value={selectedComponent.props.placeholder || ''}
                        onChange={(e) => updateProp('placeholder', e.target.value)}
                        placeholder="Enter placeholder text..."
                        className="mt-1 text-sm"
                      />
                    </div>
                    <div>
                      <Label htmlFor="input-type" className="text-sm font-medium">Input Type</Label>
                      <Select value={selectedComponent.props.type || 'text'} onValueChange={(value) => updateProp('type', value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="text">Text</SelectItem>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="password">Password</SelectItem>
                          <SelectItem value="number">Number</SelectItem>
                          <SelectItem value="tel">Phone</SelectItem>
                          <SelectItem value="url">URL</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                {selectedComponent.type === 'grid' && (
                  <>
                    <div>
                      <Label htmlFor="columns" className="text-sm font-medium">Columns</Label>
                      <Input
                        id="columns"
                        type="number"
                        min="1"
                        max="12"
                        value={selectedComponent.props.columns || 2}
                        onChange={(e) => updateProp('columns', parseInt(e.target.value))}
                        className="mt-1 text-sm"
                      />
                    </div>
                    <div>
                      <Label htmlFor="gap" className="text-sm font-medium">Gap</Label>
                      <Input
                        id="gap"
                        value={selectedComponent.props.gap || '16px'}
                        onChange={(e) => updateProp('gap', e.target.value)}
                        placeholder="e.g., 16px, 1rem"
                        className="mt-1 text-sm"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <i className="fas fa-mouse-pointer text-2xl mb-3 block" />
              <p className="text-sm">Select a component to edit its properties</p>
            </div>
          )}
        </TabsContent>

        {/* Styles Tab */}
        <TabsContent value="styles" className="flex-1 overflow-y-auto m-0 p-4">
          {selectedComponent ? (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Styling</h3>
              
              {/* Typography styles for text components */}
              {['heading', 'paragraph', 'button', 'link'].includes(selectedComponent.type) && (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-700">Typography</h4>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="font-size" className="text-xs text-gray-600">Font Size</Label>
                      <Input
                        id="font-size"
                        value={selectedComponent.styles?.fontSize || ''}
                        onChange={(e) => updateStyle('fontSize', e.target.value)}
                        placeholder="16px"
                        className="text-xs"
                      />
                    </div>
                    <div>
                      <Label htmlFor="font-weight" className="text-xs text-gray-600">Font Weight</Label>
                      <Select 
                        value={selectedComponent.styles?.fontWeight || '400'} 
                        onValueChange={(value) => updateStyle('fontWeight', value)}
                      >
                        <SelectTrigger className="text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="300">Light</SelectItem>
                          <SelectItem value="400">Normal</SelectItem>
                          <SelectItem value="500">Medium</SelectItem>
                          <SelectItem value="600">Semibold</SelectItem>
                          <SelectItem value="700">Bold</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="text-color" className="text-xs text-gray-600">Text Color</Label>
                    <div className="flex space-x-2 mt-1">
                      <input
                        type="color"
                        value={selectedComponent.styles?.color || '#000000'}
                        onChange={(e) => updateStyle('color', e.target.value)}
                        className="w-10 h-8 border border-gray-200 rounded cursor-pointer"
                      />
                      <Input
                        value={selectedComponent.styles?.color || '#000000'}
                        onChange={(e) => updateStyle('color', e.target.value)}
                        placeholder="#000000"
                        className="flex-1 text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Layout styles */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-700">Layout</h4>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="width" className="text-xs text-gray-600">Width</Label>
                    <Input
                      id="width"
                      value={selectedComponent.styles?.width || ''}
                      onChange={(e) => updateStyle('width', e.target.value)}
                      placeholder="auto"
                      className="text-xs"
                    />
                  </div>
                  <div>
                    <Label htmlFor="height" className="text-xs text-gray-600">Height</Label>
                    <Input
                      id="height"
                      value={selectedComponent.styles?.height || ''}
                      onChange={(e) => updateStyle('height', e.target.value)}
                      placeholder="auto"
                      className="text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="margin" className="text-xs text-gray-600">Margin</Label>
                    <Input
                      id="margin"
                      value={selectedComponent.styles?.margin || ''}
                      onChange={(e) => updateStyle('margin', e.target.value)}
                      placeholder="0"
                      className="text-xs"
                    />
                  </div>
                  <div>
                    <Label htmlFor="padding" className="text-xs text-gray-600">Padding</Label>
                    <Input
                      id="padding"
                      value={selectedComponent.styles?.padding || ''}
                      onChange={(e) => updateStyle('padding', e.target.value)}
                      placeholder="0"
                      className="text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Background and Border */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-700">Background & Border</h4>
                
                <div>
                  <Label htmlFor="bg-color" className="text-xs text-gray-600">Background Color</Label>
                  <div className="flex space-x-2 mt-1">
                    <input
                      type="color"
                      value={selectedComponent.styles?.backgroundColor || '#ffffff'}
                      onChange={(e) => updateStyle('backgroundColor', e.target.value)}
                      className="w-10 h-8 border border-gray-200 rounded cursor-pointer"
                    />
                    <Input
                      value={selectedComponent.styles?.backgroundColor || ''}
                      onChange={(e) => updateStyle('backgroundColor', e.target.value)}
                      placeholder="#ffffff"
                      className="flex-1 text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="border" className="text-xs text-gray-600">Border</Label>
                    <Input
                      id="border"
                      value={selectedComponent.styles?.border || ''}
                      onChange={(e) => updateStyle('border', e.target.value)}
                      placeholder="1px solid #ccc"
                      className="text-xs"
                    />
                  </div>
                  <div>
                    <Label htmlFor="border-radius" className="text-xs text-gray-600">Border Radius</Label>
                    <Input
                      id="border-radius"
                      value={selectedComponent.styles?.borderRadius || ''}
                      onChange={(e) => updateStyle('borderRadius', e.target.value)}
                      placeholder="0"
                      className="text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <i className="fas fa-palette text-2xl mb-3 block" />
              <p className="text-sm">Select a component to edit its styles</p>
            </div>
          )}
        </TabsContent>

        {/* Tree Tab */}
        <TabsContent value="tree" className="flex-1 overflow-y-auto m-0 p-4">
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Component Tree</h3>
            
            {components.length > 0 ? (
              <div className="space-y-1">
                {components.map((component) => renderTreeItem(component))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <i className="fas fa-sitemap text-2xl mb-3 block" />
                <p className="text-sm">No components yet</p>
                <p className="text-xs mt-1">Add components to see the tree structure</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
