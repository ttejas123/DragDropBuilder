import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Link as LinkIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  currentSrc: string;
  onImageChange: (src: string) => void;
  className?: string;
}

export function ImageUpload({ currentSrc, onImageChange, className }: ImageUploadProps) {
  const [uploadMethod, setUploadMethod] = useState<'url' | 'file'>('url');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onImageChange(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlChange = (url: string) => {
    onImageChange(url);
  };

  return (
    <div className={cn("space-y-3", className)}>
      <Label className="text-sm font-medium">Image Source</Label>
      
      {/* Method selector */}
      <div className="flex space-x-2">
        <Button
          size="sm"
          variant={uploadMethod === 'url' ? 'default' : 'outline'}
          onClick={() => setUploadMethod('url')}
          className="flex-1"
        >
          <LinkIcon className="w-3 h-3 mr-1" />
          URL
        </Button>
        <Button
          size="sm"
          variant={uploadMethod === 'file' ? 'default' : 'outline'}
          onClick={() => setUploadMethod('file')}
          className="flex-1"
        >
          <Upload className="w-3 h-3 mr-1" />
          Upload
        </Button>
      </div>

      {uploadMethod === 'url' ? (
        <div>
          <Input
            placeholder="Enter image URL..."
            value={currentSrc}
            onChange={(e) => handleUrlChange(e.target.value)}
            className="text-sm"
          />
        </div>
      ) : (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="w-full"
          >
            <Upload className="w-4 h-4 mr-2" />
            Choose Image File
          </Button>
        </div>
      )}

      {/* Preview */}
      {currentSrc && (
        <div className="mt-2">
          <Label className="text-xs text-gray-600">Preview</Label>
          <div className="mt-1 border rounded-lg overflow-hidden">
            <img
              src={currentSrc}
              alt="Preview"
              className="w-full h-20 object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://via.placeholder.com/300x200?text=Invalid+Image';
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}