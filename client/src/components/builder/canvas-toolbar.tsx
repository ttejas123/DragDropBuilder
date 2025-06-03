import { Button } from '@/components/ui/button';
import { useBuilderStore } from '@/hooks/use-builder-store';
import { Download, Import, Trash } from 'lucide-react';
import { useState } from 'react';
import { ImportModal } from './import-modal';

export function CanvasToolbar() {
  const { exportJSON, clearCanvas, importComponents } = useBuilderStore();
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const handleExport = () => {
    const json = exportJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'components.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsImportModalOpen(true)}
          title="Import Components"
        >
          <Import className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleExport}
          title="Export Components"
        >
          <Download className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={clearCanvas}
          title="Clear Canvas"
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>

      <ImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={importComponents}
      />
    </>
  );
} 