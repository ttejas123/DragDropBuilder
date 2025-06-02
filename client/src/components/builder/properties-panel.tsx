import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Component } from '@shared/schema';
import { ComponentDefinition, ComponentProperty, ComponentStyle, getComponentDefinition } from '@/lib/component-registry';
import { ImageUpload } from './image-upload';
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

function PropertyField({ 
  property, 
  value, 
  onChange 
}: { 
  property: ComponentProperty; 
  value: any; 
  onChange: (value: any) => void;
}) {
  switch (property.type) {
    case 'string':
      return property.name === 'content' ? (
        <Textarea
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Enter ${property.label.toLowerCase()}...`}
          className="mt-1 text-sm resize-none"
          rows={3}
        />
      ) : (
        <Input
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Enter ${property.label.toLowerCase()}...`}
          className="mt-1 text-sm"
        />
      );

    case 'number':
      return (
        <Input
          type="number"
          value={value || property.defaultValue || ''}
          onChange={(e) => onChange(Number(e.target.value))}
          className="mt-1 text-sm"
        />
      );

    case 'boolean':
      return (
        <Switch
          checked={value || false}
          onCheckedChange={onChange}
        />
      );

    case 'select':
      return (
        <Select value={value || property.defaultValue} onValueChange={onChange}>
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {property.options?.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );

    case 'color':
      return (
        <div className="flex space-x-2 mt-1">
          <input
            type="color"
            value={value || '#000000'}
            onChange={(e) => onChange(e.target.value)}
            className="w-10 h-8 border border-border rounded cursor-pointer"
          />
          <Input
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="#000000"
            className="flex-1 text-xs"
          />
        </div>
      );

    case 'image':
      return (
        <ImageUpload
          currentSrc={value || ''}
          onImageChange={onChange}
          className="mt-1"
        />
      );

    default:
      return null;
  }
}

function StyleField({ 
  style, 
  value, 
  onChange 
}: { 
  style: ComponentStyle; 
  value: string; 
  onChange: (value: string) => void;
}) {
  switch (style.type) {
    case 'color':
      return (
        <div className="flex space-x-2 mt-1">
          <input
            type="color"
            value={value || '#000000'}
            onChange={(e) => onChange(e.target.value)}
            className="w-10 h-8 border border-border rounded cursor-pointer"
          />
          <Input
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="#000000"
            className="flex-1 text-xs"
          />
        </div>
      );

    case 'select':
      return (
        <Select value={value || style.defaultValue} onValueChange={onChange}>
          <SelectTrigger className="mt-1 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {style.options?.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );

    case 'size':
    case 'string':
    default:
      return (
        <Input
          value={value || style.defaultValue || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={style.defaultValue}
          className="mt-1 text-xs"
        />
      );
  }
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
  const [expandedStyleCategories, setExpandedStyleCategories] = useState<Set<string>>(new Set(['typography', 'layout', 'spacing', 'colors']));

  const componentDefinition = selectedComponent ? getComponentDefinition(selectedComponent.ui_template.id) : null;

  const toggleTreeItem = (id: string) => {
    const newExpanded = new Set(expandedTreeItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedTreeItems(newExpanded);
  };

  const toggleStyleCategory = (category: string) => {
    const newExpanded = new Set(expandedStyleCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedStyleCategories(newExpanded);
  };

  const renderTreeItem = (component: Component, level = 0) => {
    const hasChildren = component.components && component.components.length > 0;
    const isExpanded = expandedTreeItems.has(component.id);
    const isSelected = selectedComponent?.id === component.id;
    const definition = getComponentDefinition(component.ui_template.id);

    return (
      <div key={component.id}>
        <div
          className={`flex items-center py-1 px-2 rounded text-sm cursor-pointer transition-colors ${
            isSelected ? 'bg-primary/10 border border-primary/20 text-primary' : 'hover:bg-muted text-foreground'
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
              className="mr-1 p-0.5 hover:bg-muted rounded"
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
            isSelected ? 'text-primary' : 'text-muted-foreground'
          }`} />
          
          <span className={`flex-1 ${isSelected ? 'font-medium' : ''}`}>
            {definition?.name || component.ui_template.id}
          </span>
          
          <span className="text-xs text-muted-foreground ml-auto">
            #{component.id.split('-')[0]}
          </span>
        </div>
        
        {hasChildren && isExpanded && (
          <div>
            {component.components!.map((child: Component) => renderTreeItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-80 bg-background border-l border-border flex flex-col">
      <Tabs defaultValue="properties" className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-3 rounded-none border-b">
          <TabsTrigger value="properties" className="text-xs">Properties</TabsTrigger>
          <TabsTrigger value="styles" className="text-xs">Styles</TabsTrigger>
          <TabsTrigger value="tree" className="text-xs">Tree</TabsTrigger>
        </TabsList>

        {/* Properties Tab */}
        <TabsContent value="properties" className="flex-1 overflow-y-auto m-0 p-4">
          {selectedComponent && componentDefinition ? (
            <div className="space-y-6">
              {/* Component Info */}
              <Card className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-foreground">Selected Component</h3>
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
                
                <div className="bg-muted rounded p-2">
                  <div className="flex items-center space-x-2 mb-1">
                    <componentDefinition.icon className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">
                      {componentDefinition.name}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">ID: {selectedComponent.id}</div>
                </div>
              </Card>
              {/* Component Properties */}
              {componentDefinition.properties.length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-foreground">Properties</h4>
                  {componentDefinition.properties.map((property) => (
                    <div key={property.name}>
                      <Label className="text-xs text-muted-foreground mb-1 flex items-center">
                        {property.label}
                        {property.required && <span className="text-destructive ml-1">*</span>}
                      </Label>
                      <PropertyField
                        property={property}
                        value={selectedComponent.ui_template.props[property.name]}
                        onChange={(value) => onUpdateProps(selectedComponent.id, { 
                          ...selectedComponent.ui_template.props, 
                          [property.name]: value 
                        })}
                      />
                      {property.description && (
                        <p className="text-xs text-muted-foreground mt-1">{property.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <i className="fas fa-mouse-pointer text-2xl mb-3 block" />
              <p className="text-sm">Select a component to edit its properties</p>
            </div>
          )}
        </TabsContent>

        {/* Styles Tab */}
        <TabsContent value="styles" className="flex-1 overflow-y-auto m-0 p-4">
          {selectedComponent && componentDefinition ? (
            <div className="space-y-6">
              {['typography', 'layout', 'spacing', 'colors', 'effects'].map((category) => {
                const categoryStyles = componentDefinition.styles.filter(
                  (style) => style.category === category
                );

                if (categoryStyles.length === 0) return null;

                const isExpanded = expandedStyleCategories.has(category);

                return (
                  <div key={category}>
                    <button
                      className="flex items-center justify-between w-full text-sm font-medium text-foreground mb-2"
                      onClick={() => toggleStyleCategory(category)}
                    >
                      <span className="capitalize">{category}</span>
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>

                    {isExpanded && (
                      <div className="space-y-3">
                        {categoryStyles.map((style) => (
                          <div key={style.name}>
                            <Label className="text-xs text-muted-foreground">
                              {style.label}
                            </Label>
                            <StyleField
                              style={style}
                              value={selectedComponent.ui_template.style[style.name] || ''}
                              onChange={(value) => onUpdateStyles(selectedComponent.id, {
                                ...selectedComponent.ui_template.style,
                                [style.name]: value,
                              })}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <i className="fas fa-palette text-2xl mb-3 block" />
              <p className="text-sm">Select a component to edit its styles</p>
            </div>
          )}
        </TabsContent>

        {/* Tree Tab */}
        <TabsContent value="tree" className="flex-1 overflow-y-auto m-0 p-4">
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-foreground mb-3">Component Tree</h3>
            
            {components.length > 0 ? (
              <div className="space-y-1">
                {components.map((component) => renderTreeItem(component))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
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
