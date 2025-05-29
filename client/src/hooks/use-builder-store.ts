import { useState, useCallback } from 'react';
import { Component, ComponentType } from '@shared/schema';
import { getComponentDefinition, ComponentDefinition } from '@/lib/component-types';
import { generateComponentId } from '@/lib/drag-drop-utils';

interface BuilderState {
  components: Component[];
  selectedComponentId: string | null;
  canvasSize: { width: number; height: number };
}

export function useBuilderStore() {
  const [state, setState] = useState<BuilderState>({
    components: [],
    selectedComponentId: null,
    canvasSize: { width: 800, height: 600 }
  });

  const addComponent = useCallback((type: ComponentType, position?: { x: number; y: number }, parentId?: string) => {
    const definition = getComponentDefinition(type);
    if (!definition) return;

    const newComponent: Component = {
      id: generateComponentId(type),
      type,
      props: { ...definition.defaultProps },
      styles: { ...definition.defaultStyles },
      position: position || { x: 0, y: 0 },
      children: []
    };

    setState(prev => {
      let updatedComponents;
      
      if (parentId) {
        // Add as child to parent component
        updatedComponents = prev.components.map(comp => 
          comp.id === parentId 
            ? { ...comp, children: [...(comp.children || []), newComponent] }
            : comp
        );
      } else {
        // Add as root component
        updatedComponents = [...prev.components, newComponent];
      }

      return {
        ...prev,
        components: updatedComponents,
        selectedComponentId: newComponent.id
      };
    });

    return newComponent.id;
  }, []);

  const updateComponent = useCallback((id: string, updates: Partial<Component>) => {
    setState(prev => ({
      ...prev,
      components: updateComponentInTree(prev.components, id, updates)
    }));
  }, []);

  const updateComponentProps = useCallback((id: string, props: Record<string, any>) => {
    setState(prev => ({
      ...prev,
      components: updateComponentInTree(prev.components, id, { props })
    }));
  }, []);

  const updateComponentStyles = useCallback((id: string, styles: Record<string, string>) => {
    setState(prev => ({
      ...prev,
      components: updateComponentInTree(prev.components, id, { styles })
    }));
  }, []);

  const deleteComponent = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      components: removeComponentFromTree(prev.components, id),
      selectedComponentId: prev.selectedComponentId === id ? null : prev.selectedComponentId
    }));
  }, []);

  const selectComponent = useCallback((id: string | null) => {
    setState(prev => ({
      ...prev,
      selectedComponentId: id
    }));
  }, []);

  const moveComponent = useCallback((id: string, newPosition: { x: number; y: number }) => {
    setState(prev => ({
      ...prev,
      components: updateComponentInTree(prev.components, id, { position: newPosition })
    }));
  }, []);

  const duplicateComponent = useCallback((id: string) => {
    const component = findComponentInTree(state.components, id);
    if (!component) return;

    const duplicated = duplicateComponentRecursive(component);
    setState(prev => ({
      ...prev,
      components: [...prev.components, duplicated],
      selectedComponentId: duplicated.id
    }));
  }, [state.components]);

  const getSelectedComponent = useCallback(() => {
    if (!state.selectedComponentId) return null;
    return findComponentInTree(state.components, state.selectedComponentId);
  }, [state.components, state.selectedComponentId]);

  const exportJSON = useCallback(() => {
    return {
      version: "1.0",
      components: state.components,
      metadata: {
        created: new Date().toISOString(),
        canvasSize: state.canvasSize
      }
    };
  }, [state.components, state.canvasSize]);

  const importJSON = useCallback((data: any) => {
    if (data.components && Array.isArray(data.components)) {
      setState(prev => ({
        ...prev,
        components: data.components,
        selectedComponentId: null
      }));
    }
  }, []);

  const clearCanvas = useCallback(() => {
    setState(prev => ({
      ...prev,
      components: [],
      selectedComponentId: null
    }));
  }, []);

  return {
    // State
    components: state.components,
    selectedComponentId: state.selectedComponentId,
    canvasSize: state.canvasSize,
    
    // Actions
    addComponent,
    updateComponent,
    updateComponentProps,
    updateComponentStyles,
    deleteComponent,
    selectComponent,
    moveComponent,
    duplicateComponent,
    
    // Computed
    getSelectedComponent,
    
    // Import/Export
    exportJSON,
    importJSON,
    clearCanvas
  };
}

// Helper functions
function updateComponentInTree(components: Component[], id: string, updates: Partial<Component>): Component[] {
  return components.map(component => {
    if (component.id === id) {
      return { ...component, ...updates };
    }
    if (component.children) {
      return {
        ...component,
        children: updateComponentInTree(component.children, id, updates)
      };
    }
    return component;
  });
}

function removeComponentFromTree(components: Component[], id: string): Component[] {
  return components
    .filter(component => component.id !== id)
    .map(component => ({
      ...component,
      children: component.children ? removeComponentFromTree(component.children, id) : undefined
    }));
}

function findComponentInTree(components: Component[], id: string): Component | null {
  for (const component of components) {
    if (component.id === id) return component;
    if (component.children) {
      const found = findComponentInTree(component.children, id);
      if (found) return found;
    }
  }
  return null;
}

function duplicateComponentRecursive(component: Component): Component {
  return {
    ...component,
    id: generateComponentId(component.type),
    children: component.children?.map(duplicateComponentRecursive)
  };
}
