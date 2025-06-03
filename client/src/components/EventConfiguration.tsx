import React, { useState, useEffect } from 'react';
import { EventHandlerSchema } from '@shared/schema';
import { z } from 'zod';
import {
  CONTEXT_TYPES,
  APPLICATION_CONTEXT_HANDLERS,
  LOCAL_CONTEXT_HANDLERS,
  ContextType,
  ApplicationHandler,
  LocalHandler
} from '../lib/event-handlers';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

type EventType = z.infer<typeof EventHandlerSchema>['type'];

interface EventConfigurationProps {
  initialValues?: {
    contextType?: ContextType;
    eventType?: z.infer<typeof EventHandlerSchema>['type'];
    handler?: string;
    propName?: string;
  };
  onEventConfigured: (config: {
    contextType: ContextType;
    eventType: z.infer<typeof EventHandlerSchema>['type'];
    handler: string;
    propName: string;
  }) => void;
}

export const EventConfiguration: React.FC<EventConfigurationProps> = ({ 
  initialValues,
  onEventConfigured 
}) => {
  const [contextType, setContextType] = useState<ContextType>('application');
  const [eventType, setEventType] = useState<EventType>(initialValues?.eventType || 'click');
  const [selectedHandler, setSelectedHandler] = useState(initialValues?.handler || '');
  const [propName, setPropName] = useState(initialValues?.propName || '');

  const eventTypes = EventHandlerSchema.shape.type.options;

  // Get available handlers based on context and event type
  const getAvailableHandlers = () => {
    const handlers = contextType === 'application' 
      ? APPLICATION_CONTEXT_HANDLERS
      : LOCAL_CONTEXT_HANDLERS;
    return {
      functions: handlers.functions.filter((h: ApplicationHandler | LocalHandler) => 
        h.eventTypes.includes(eventType)
      ),
      states: handlers.states
    };
  };

  // Update prop name when handler changes
  useEffect(() => {
    if (selectedHandler) {
      const handlers = getAvailableHandlers();
      const handler = [...handlers.functions, ...handlers.states].find(h => h.key === selectedHandler);
      if (handler) {
        setPropName(handler.key.startsWith('handle') ? handler.key.charAt(6).toLowerCase() + handler.key.slice(7) : handler.key);
      }
    }
  }, [selectedHandler]);

  const handleSubmit = () => {
    if (eventType && selectedHandler && propName) {
      onEventConfigured({
        contextType,
        eventType,
        handler: selectedHandler,
        propName
      });
    }
  };

  const availableHandlers = getAvailableHandlers();
  const selectedHandlerDetails = [...availableHandlers.functions, ...availableHandlers.states]
    .find(h => h.key === selectedHandler);

  return (
    <Card className="p-4 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {/* Context Type Selection */}
        <div className="space-y-2">
          <Label>Context</Label>
          <Select value={contextType} onValueChange={(value: ContextType) => setContextType(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CONTEXT_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Event Type Selection */}
        <div className="space-y-2">
          <Label>Event Type</Label>
          <Select 
            value={eventType} 
            onValueChange={(value: EventType) => setEventType(value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {eventTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Handler Selection */}
      <div className="space-y-2">
        <Label>Handler</Label>
        <Select 
          value={selectedHandler} 
          onValueChange={setSelectedHandler}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a handler" />
          </SelectTrigger>
          <SelectContent>
            {availableHandlers.functions.length > 0 && (
              <>
                <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground bg-muted/50">
                  Functions
                </div>
                {availableHandlers.functions.map((handler) => (
                  <SelectItem key={handler.key} value={handler.key}>
                    <div>
                      <div className="font-medium">{handler.label}</div>
                      <div className="text-xs text-muted-foreground">{handler.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </>
            )}
            {availableHandlers.states.length > 0 && (
              <>
                <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground bg-muted/50 mt-2">
                  States
                </div>
                {availableHandlers.states.map((state) => (
                  <SelectItem key={state.key} value={state.key}>
                    <div>
                      <div className="font-medium">{state.label}</div>
                      <div className="text-xs text-muted-foreground">{state.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </>
            )}
          </SelectContent>
        </Select>
        {selectedHandlerDetails && (
          <p className="text-xs text-muted-foreground mt-1">{selectedHandlerDetails.description}</p>
        )}
      </div>

      {/* Prop Name */}
      <div className="space-y-2">
        <Label>Component Prop Name</Label>
        <Input
          placeholder="Prop name (e.g. onClick, value)"
          value={propName}
          onChange={(e) => setPropName(e.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          The name of the prop that will receive this handler in the component
        </p>
      </div>

      {/* Submit Button */}
      <Button
        onClick={handleSubmit}
        disabled={!eventType || !selectedHandler || !propName}
        className="w-full"
        variant="default"
      >
        Save Event Configuration
      </Button>
    </Card>
  );
}; 