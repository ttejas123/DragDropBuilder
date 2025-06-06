import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useBuilderStore } from '@/hooks/use-builder-store';
import { ComponentPalette } from '@/components/builder/component-palette';
import { CanvasArea } from '@/components/builder/canvas-area';
import { PropertiesPanel } from '@/components/builder/properties-panel';
import { ExportModal } from '@/components/builder/export-modal';
import { Save, Download, Eye, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ThemeToggle } from '@/components/theme-toggle';
import { UIBuilderLogo } from '@/components/builder/logo';
import { Component } from '@shared/schema';

export default function UIBuilder() {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const { toast } = useToast();
  
  const {
    components,
    selectedComponentId,
    addComponent,
    updateComponentProps,
    updateComponentStyles,
    updateComponentEvents,
    deleteComponent,
    selectComponent,
    moveComponent,
    duplicateComponent,
    getSelectedComponent,
    exportJSON,
    clearCanvas,
    setComponents
  } = useBuilderStore();

  const selectedComponent = getSelectedComponent();

  const handleSave = () => {
    // In a real app, this would save to the backend
    toast({
      title: "Project saved",
      description: "Your UI design has been saved successfully",
    });
  };

  const handleExport = () => {
    setIsExportModalOpen(true);
  };

  const handlePreview = () => {
    // In a real app, this would open a preview window
    toast({
      title: "Preview mode",
      description: "Preview functionality would open your design in a new window",
    });
  };

  const handleClear = () => {
    if (components.length > 0) {
      const confirmed = window.confirm('Are you sure you want to clear the canvas? This action cannot be undone.');
      if (confirmed) {
        clearCanvas();
        toast({
          title: "Canvas cleared",
          description: "All components have been removed from the canvas",
        });
      }
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-screen flex flex-col bg-background">
        {/* Header */}
        <header className="bg-card border-b border-border px-4 py-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                <UIBuilderLogo size={32} />
              </div>
              <h1 className="text-lg font-semibold text-foreground">UI Builder</h1>
            </div>
            
            <div className="h-6 w-px bg-border" />
            
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={handleClear}>
                <i className="fas fa-trash mr-2 text-sm" />
                Clear
              </Button>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button variant="outline" onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button onClick={handleExport} className="bg-accent hover:bg-accent/90">
              <Download className="w-4 h-4 mr-2" />
              Export JSON
            </Button>
            <ThemeToggle />
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Component Palette */}
          <ComponentPalette />

          {/* Canvas Area */}
          <CanvasArea
            components={components}
            selectedComponentId={selectedComponentId}
            onAddComponent={addComponent}
            onSelectComponent={selectComponent}
            onDeleteComponent={deleteComponent}
            onDuplicateComponent={duplicateComponent}
            onMoveComponent={moveComponent}
          />

          {/* Properties Panel */}
          <PropertiesPanel
            components={components}
            selectedComponent={selectedComponent}
            onUpdateProps={updateComponentProps}
            onUpdateStyles={updateComponentStyles}
            onUpdateEvents={updateComponentEvents}
            onSelectComponent={selectComponent}
            onDeleteComponent={deleteComponent}
            onDuplicateComponent={duplicateComponent}
            onUpdateComponent={(id, component) => {
              // Find and update the component in the components array
              const updateComponentRecursive = (components: Component[]): Component[] => {
                return components.map(c => {
                  if (c.id === id) {
                    return component;
                  }
                  if (c.components) {
                    return {
                      ...c,
                      components: updateComponentRecursive(c.components)
                    };
                  }
                  return c;
                });
              };
              setComponents(updateComponentRecursive(components));
            }}
          />
        </div>

        {/* Export Modal */}
        <ExportModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          jsonData={exportJSON()}
        />
      </div>
    </DndProvider>
  );
}
