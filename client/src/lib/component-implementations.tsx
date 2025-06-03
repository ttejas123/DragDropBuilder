import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Component } from '@shared/schema';
import type { EventHandlerSchema } from '@shared/schema';
import { z } from 'zod';

// Type for component implementation props
interface ComponentProps {
  component: Component;
  className?: string;
  children?: React.ReactNode;
  context?: Record<string, any>; // Add context prop for event handlers
}

type EventHandler = z.infer<typeof EventHandlerSchema>;

// Helper function to bind events from component definition
function bindEvents(component: Component, context: Record<string, any> = {}) {
  const eventHandlers: Record<string, any> = {};
  
  component.events?.forEach((event: EventHandler) => {
    const handlerFn = context[event.handler.key];
    if (handlerFn) {
      eventHandlers[event.type] = (...args: any[]) => {
        // Get dependencies from context if specified
        const deps = event.dependencies?.map((dep: string) => context[dep]) || [];
        handlerFn(...args, ...deps);
      };
    }
  });

  return eventHandlers;
}

// Heading Component
const Heading: React.FC<ComponentProps> = ({ component, className }) => {
  const { level = 'h2', content = '' } = component.ui_template.props;
  const Tag = level as keyof JSX.IntrinsicElements;
  return (
    <Tag 
      className={cn('font-heading', className)} 
      style={component.ui_template.style}
    >
      {content}
    </Tag>
  );
};

// Paragraph Component
const Paragraph: React.FC<ComponentProps> = ({ component, className }) => {
  const { content = '' } = component.ui_template.props;
  
  return (
    <p 
      className={cn('leading-relaxed', className)} 
      style={component.ui_template.style}
    >
      {content}
    </p>
  );
};

// Button Component
const ButtonComponent: React.FC<ComponentProps> = ({ component, className, context }) => {
  const { content = 'Button', variant = 'default', size = 'default' } = component.ui_template.props;
  const eventHandlers = bindEvents(component, context);
  
  return (
    <Button 
      variant={variant}
      size={size}
      className={className}
      style={component.ui_template.style}
      {...eventHandlers}
    >
      {content}
    </Button>
  );
};

// Input Component
const InputComponent: React.FC<ComponentProps> = ({ component, className, context }) => {
  const { 
    placeholder = 'Enter text...', 
    type = 'text',
    required = false 
  } = component.ui_template.props;
  const eventHandlers = bindEvents(component, context);
  
  return (
    <Input
      type={type}
      placeholder={placeholder}
      required={required}
      className={className}
      style={component.ui_template.style}
      {...eventHandlers}
    />
  );
};

// Container Component
const Container: React.FC<ComponentProps> = ({ component, className, children }) => {
  const { padding = '1rem' } = component.ui_template.props;
  
  return (
    <div 
      className={cn('w-full', className)}
      style={{
        ...component.ui_template.style,
        padding,
      }}
    >
      {children}
    </div>
  );
};

// Grid Component
const Grid: React.FC<ComponentProps> = ({ component, className, children }) => {
  const { 
    columns = 2, 
    gap = '1rem',
    rowGap,
    columnGap,
    autoFlow = 'row',
    alignItems = 'start',
    justifyItems = 'stretch',
  } = component.ui_template.props;
  
  return (
    <div 
      className={cn('grid w-full', className)}
      style={{
        ...component.ui_template.style,
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        gap: gap,
        rowGap: rowGap,
        columnGap: columnGap,
        gridAutoFlow: autoFlow,
        alignItems,
        justifyItems,
      }}
    >
      {children}
    </div>
  );
};

// Card Component
const CardComponent: React.FC<ComponentProps> = ({ component, className, children }) => {
  const { padding = '1rem' } = component.ui_template.props;
  
  return (
    <Card 
      className={cn('', className)}
      style={{
        ...component.ui_template.style,
        padding,
      }}
    >
      {children}
    </Card>
  );
};

// Image Component
const ImageComponent: React.FC<ComponentProps> = ({ component, className }) => {
  const { src = '', alt = 'Image', fit = 'cover' } = component.ui_template.props;
  
  return (
    <img
      src={src}
      alt={alt}
      className={cn('max-w-full h-auto', className)}
      style={{
        ...component.ui_template.style,
        objectFit: fit,
      }}
    />
  );
};

// Component Map
export const componentMap: Record<string, React.FC<ComponentProps>> = {
  heading: Heading,
  paragraph: Paragraph,
  button: ButtonComponent,
  input: InputComponent,
  container: Container,
  grid: Grid,
  card: CardComponent,
  image: ImageComponent,
};

// Component Factory
export function createComponent(
  component: Component,
  props: Omit<ComponentProps, 'component'> & { context?: Record<string, any> } = {}
) {
  const Component = componentMap[component.ui_template.id];
  
  if (!Component) {
    console.warn(`Component type "${component.type}" not found`);
    return null;
  }

  return (
    <Component
      key={component.id}
      component={component}
      context={props.context}
      {...props}
    >
      {component.components?.map((child: Component) => 
        createComponent(child, {
          className: cn(props.className, child.ui_template.props?.className),
          context: props.context
        })
      )}
    </Component>
  );
} 