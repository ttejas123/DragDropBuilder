import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Component, EventHandlerSchema, ContextDependencySchema } from '@shared/schema';
import { ComponentDefinition, ComponentProperty, ComponentStyle, getComponentDefinition } from '@/lib/component-registry';
import { ImageUpload } from './image-upload';
import { Trash2, Copy, ChevronDown, ChevronRight, Plus, X } from 'lucide-react';
import { z } from 'zod';
import { PREDEFINED_HANDLERS, HANDLER_CATEGORIES, ContextType } from '@/lib/event-handlers';
import { EventConfiguration } from '@/components/EventConfiguration';

interface PropertiesPanelProps {
  components: Component[];
  selectedComponent: Component | null;
  onUpdateProps: (id: string, props: Record<string, any>) => void;
  onUpdateStyles: (id: string, styles: Record<string, string>) => void;
  onSelectComponent: (id: string | null) => void;
  onDeleteComponent: (id: string) => void;
  onDuplicateComponent: (id: string) => void;
  onUpdateEvents: (id: string, events: z.infer<typeof EventHandlerSchema>[]) => void;
  onUpdateComponent: (id: string, component: Component) => void;
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
  onUpdateEvents,
  onDuplicateComponent,
  onUpdateComponent
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

  const handleAddEvent = () => {
    if (!selectedComponent) return;

    // Default empty event configuration
    const newDependency: z.infer<typeof ContextDependencySchema> = {
      key: '',
      value: ''
    };

    // Add to application context by default
    const updatedComponent = {
      ...selectedComponent,
      application_context_dependency: [
        ...selectedComponent.application_context_dependency || [],
        newDependency
      ]
    };

    onUpdateComponent(selectedComponent.id, updatedComponent);
  };

  const handleUpdateEvent = (index: number, updated: {
    contextType: ContextType;
    eventType: string;
    handler: string;
    propName: string;
  }) => {
    if (!selectedComponent) return;

    const newDependency = {
      key: updated.handler,
      value: updated.propName
    };

    const updatedComponent = { ...selectedComponent };
    
    const oldAppDeps = updatedComponent.application_context_dependency.filter((_: any, i: number) => i !== index);
    const oldLocalDeps = updatedComponent.local_context_dependency.filter((_: any, i: number) => i !== index);

    if (updated.contextType === 'application') {
      updatedComponent.application_context_dependency = [...oldAppDeps, newDependency];
      updatedComponent.local_context_dependency = oldLocalDeps;
    } else {
      updatedComponent.application_context_dependency = oldAppDeps;
      updatedComponent.local_context_dependency = [...oldLocalDeps, newDependency];
    }

    onUpdateComponent(selectedComponent.id, updatedComponent);
  };

  const handleDeleteEvent = (index: number, contextType: ContextType) => {
    if (!selectedComponent) return;

    const updatedComponent = { ...selectedComponent };
    
    if (contextType === 'application') {
      updatedComponent.application_context_dependency = updatedComponent.application_context_dependency.filter((_: any, i: number) => i !== index);
    } else {
      updatedComponent.local_context_dependency = updatedComponent.local_context_dependency.filter((_: any, i: number) => i !== index);
    }

    onUpdateComponent(selectedComponent.id, updatedComponent);
  };

  return (
    <Card className="w-80 h-full flex flex-col">
      <Tabs defaultValue="props" className="flex-1 flex flex-col h-full">
        <TabsList className="w-full shrink-0">
          <TabsTrigger value="props" className="flex-1">Props</TabsTrigger>
          <TabsTrigger value="styles" className="flex-1">Styles</TabsTrigger>
          <TabsTrigger value="events" className="flex-1">Events</TabsTrigger>
          <TabsTrigger value="tree" className="flex-1">Tree</TabsTrigger>
        </TabsList>

        <TabsContent value="props" className="flex-1 overflow-y-auto m-0 p-4">
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
        <TabsContent value="events" className="flex-1 flex flex-col overflow-hidden m-0">
          {selectedComponent ? (
            <div className="flex flex-col h-full">
              <div className="shrink-0 px-4 pt-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium">Event Handlers</h3>
                  <Button variant="outline" size="sm" onClick={handleAddEvent}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Event
                  </Button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-4 pb-4">
                <div className="space-y-4">
                  {/* Application Context Dependencies */}
                  {selectedComponent.application_context_dependency.map((dependency: z.infer<typeof ContextDependencySchema>, index: number) => (
                    <div key={`app-${index}`} className="border rounded-lg">
                      <EventConfiguration
                        initialValues={{
                          contextType: 'application',
                          handler: dependency.key,
                          propName: dependency.value
                        }}
                        onEventConfigured={(updated) => handleUpdateEvent(index, updated)}
                      />
                      <div className="flex justify-end p-2 border-t">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteEvent(index, 'application')}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  {/* Local Context Dependencies */}
                  {selectedComponent.local_context_dependency.map((dependency: z.infer<typeof ContextDependencySchema>, index: number) => (
                    <div key={`local-${index}`} className="border rounded-lg">
                      <EventConfiguration
                        initialValues={{
                          contextType: 'local',
                          handler: dependency.key,
                          propName: dependency.value
                        }}
                        onEventConfigured={(updated) => handleUpdateEvent(index, updated)}
                      />
                      <div className="flex justify-end p-2 border-t">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteEvent(index, 'local')}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  {(!selectedComponent.application_context_dependency.length && !selectedComponent.local_context_dependency.length) && (
                    <div className="text-center py-8 text-muted-foreground">
                      <p className="text-sm">No events configured</p>
                      <p className="text-xs mt-1">Click "Add Event" to create one</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-center p-4 text-muted-foreground">
              <p>Select a component to configure events</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </Card>
  );
}
