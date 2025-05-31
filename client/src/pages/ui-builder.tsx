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

export default function UIBuilder() {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const { toast } = useToast();
  
  const {
    components,
    selectedComponentId,
    addComponent,
    updateComponentProps,
    updateComponentStyles,
    deleteComponent,
    selectComponent,
    moveComponent,
    duplicateComponent,
    getSelectedComponent,
    exportJSON,
    clearCanvas
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
      <div className="h-screen flex flex-col bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <i className="fas fa-cube text-white text-sm" />
              </div>
              <h1 className="text-lg font-semibold text-gray-900">UI Builder</h1>
            </div>
            
            <div className="h-6 w-px bg-gray-300" />
            
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
            <Button onClick={handleExport} className="bg-accent hover:bg-orange-600">
              <Download className="w-4 h-4 mr-2" />
              Export JSON
            </Button>
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
            onSelectComponent={selectComponent}
            onDeleteComponent={deleteComponent}
            onDuplicateComponent={duplicateComponent}
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
