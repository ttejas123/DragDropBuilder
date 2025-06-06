import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Copy, Download, CheckCircle } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  jsonData: any;
}

export function ExportModal({ isOpen, onClose, jsonData }: ExportModalProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const jsonString = JSON.stringify(jsonData, null, 2);

  const handleCopyJson = async () => {
    try {
      await navigator.clipboard.writeText(JSON.parse(jsonString));
      setCopied(true);
      toast({
        title: "Copied to clipboard",
        description: "JSON data has been copied to your clipboard",
      });
      
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Could not copy to clipboard",
        variant: "destructive"
      });
    }
  };

  const handleDownloadJson = () => {
    const blob = new Blob([JSON.parse(jsonString)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ui-components-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Download started",
      description: "JSON file download has started",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl w-full">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <i className="fas fa-download text-primary" />
            <span>Export JSON</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-foreground">
                Component Tree JSON
              </label>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-muted-foreground">
                  {jsonString.length} characters
                </span>
              </div>
            </div>
            
            <Textarea
              value={JSON.parse(jsonString)}
              readOnly
              className="w-full h-64 text-sm font-mono bg-muted/50 border border-input rounded-md resize-none"
              placeholder="No components to export"
            />
          </div>

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 dark:bg-blue-500/5">
            <h4 className="text-sm font-medium text-foreground mb-1">Usage Instructions</h4>
            <p className="text-xs text-muted-foreground">
              This JSON structure contains your complete component tree with properties, styles, and data bindings. 
              Use it with a compatible renderer to recreate your UI.
            </p>
          </div>
        </div>

        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={handleCopyJson}
              disabled={!jsonString.trim() || jsonString === '{}'}
            >
              {copied ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy JSON
                </>
              )}
            </Button>
            
            <Button 
              onClick={handleDownloadJson}
              disabled={!jsonString.trim() || jsonString === '{}'}
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
