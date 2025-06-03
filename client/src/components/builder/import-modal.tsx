import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ComponentSchema } from '@shared/schema';
import { AlertCircle, ArrowRight, Check } from 'lucide-react';
import { JsonTreeRenderer } from './json-renderer';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (components: any[]) => void;
}

export function ImportModal({ isOpen, onClose, onImport }: ImportModalProps) {
  const [jsonInput, setJsonInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [parsedComponents, setParsedComponents] = useState<any[] | null>(null);

  const handleImport = () => {
    try {
      // Try to parse the JSON
      const parsed = JSON.parse(jsonInput);
      
      // If it's an array, validate each component
      const components = Array.isArray(parsed) ? parsed : [parsed];
      
      // Validate against our schema
      components.forEach(component => {
        const result = ComponentSchema.safeParse(component);
        if (!result.success) {
          throw new Error('Invalid component structure: ' + result.error.message);
        }
      });

      // Store parsed components for preview
      setParsedComponents(components);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid JSON format');
      setParsedComponents(null);
    }
  };

  const handleConfirmImport = () => {
    if (parsedComponents) {
      onImport(parsedComponents);
      onClose();
      setJsonInput('');
      setParsedComponents(null);
      setError(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full h-[80vh]">
        <DialogHeader>
          <DialogTitle>Import Components</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-4 flex-1 overflow-hidden">
          {/* Input Section */}
          <div className="space-y-4">
            <Textarea
              placeholder="Paste your component JSON here..."
              className="h-[calc(100vh-300px)] font-mono text-sm"
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
            />
            <Button 
              size="icon"
              onClick={handleImport}
              className="rounded-full cursor-pointer absolute right-[48%] top-1/2 transform -translate-y-1/2 z-10"
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
            
            {parsedComponents && !error && (
              <Alert className="bg-green-50 border-green-200">
                <Check className="h-4 w-4 text-green-500" />
                <AlertDescription className="text-green-700">
                  Valid component structure. Click Import to add to canvas.
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Preview Section */}
          <div className="border rounded-lg p-4 bg-background overflow-auto">
            <div className="font-medium mb-2">Preview</div>
            {parsedComponents ? (
              <JsonTreeRenderer components={parsedComponents} />
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <p className="text-sm">Preview will appear here</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmImport}
            disabled={!parsedComponents || !!error}
          >
            Import
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 