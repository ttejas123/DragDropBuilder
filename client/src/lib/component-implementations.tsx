import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Component } from '@shared/schema';

// Type for component implementation props
interface ComponentProps {
  component: Component;
  className?: string;
  children?: React.ReactNode;
}

// Heading Component
const Heading: React.FC<ComponentProps> = ({ component, className }) => {
  const { level = 'h2', content = '' } = component.props;
  const Tag = level as keyof JSX.IntrinsicElements;
  
  return (
    <Tag 
      className={cn('font-heading', className)} 
      style={component.styles}
    >
      {content}
    </Tag>
  );
};

// Paragraph Component
const Paragraph: React.FC<ComponentProps> = ({ component, className }) => {
  const { content = '' } = component.props;
  
  return (
    <p 
      className={cn('leading-relaxed', className)} 
      style={component.styles}
    >
      {content}
    </p>
  );
};

// Button Component
const ButtonComponent: React.FC<ComponentProps> = ({ component, className }) => {
  const { content = 'Button', variant = 'default', size = 'default' } = component.props;
  
  return (
    <Button 
      variant={variant}
      size={size}
      className={className}
      style={component.styles}
    >
      {content}
    </Button>
  );
};

// Input Component
const InputComponent: React.FC<ComponentProps> = ({ component, className }) => {
  const { 
    placeholder = 'Enter text...', 
    type = 'text',
    required = false 
  } = component.props;
  
  return (
    <Input
      type={type}
      placeholder={placeholder}
      required={required}
      className={className}
      style={component.styles}
    />
  );
};

// Container Component
const Container: React.FC<ComponentProps> = ({ component, className, children }) => {
  const { padding = '1rem' } = component.props;
  
  return (
    <div 
      className={cn('w-full', className)}
      style={{
        ...component.styles,
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
  } = component.props;
  
  return (
    <div 
      className={cn('grid w-full', className)}
      style={{
        ...component.styles,
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
  const { padding = '1rem' } = component.props;
  
  return (
    <Card 
      className={cn('', className)}
      style={{
        ...component.styles,
        padding,
      }}
    >
      {children}
    </Card>
  );
};

// Image Component
const ImageComponent: React.FC<ComponentProps> = ({ component, className }) => {
  const { src = '', alt = 'Image', fit = 'cover' } = component.props;
  
  return (
    <img
      src={src}
      alt={alt}
      className={cn('max-w-full h-auto', className)}
      style={{
        ...component.styles,
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
  props: Omit<ComponentProps, 'component'> = {}
) {
  const Component = componentMap[component.type];
  
  if (!Component) {
    console.warn(`Component type "${component.type}" not found`);
    return null;
  }

  return (
    <Component
      key={component.id}
      component={component}
      {...props}
    >
      {component.children?.map((child: Component) => 
        createComponent(child, {
          className: cn(props.className, child.props.className)
        })
      )}
    </Component>
  );
} 