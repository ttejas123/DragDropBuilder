import { create } from 'zustand';
import { Component, ComponentType } from '@shared/schema';
import { getComponentDefinition, getDefaultProps, getDefaultStyles } from '@/lib/component-registry';
import { nanoid } from 'nanoid';

interface BuilderStore {
  components: Component[];
  selectedComponentId: string | null;
  addComponent: (type: ComponentType, position?: { x: number; y: number }, parentId?: string) => void;
  updateComponentProps: (id: string, props: Record<string, any>) => void;
  updateComponentStyles: (id: string, styles: Record<string, string>) => void;
  deleteComponent: (id: string) => void;
  selectComponent: (id: string | null) => void;
  moveComponent: (id: string, position: { x: number; y: number }) => void;
  duplicateComponent: (id: string) => void;
  getSelectedComponent: () => Component | null;
  exportJSON: () => string;
  clearCanvas: () => void;
}

// Helper function to add a component to a parent's children array
const addComponentToParent = (components: Component[], parentId: string, newComponent: Component): Component[] => {
  return components.map(component => {
    if (component.id === parentId) {
      return {
        ...component,
        children: [...(component.children || []), newComponent]
      };
    }
    if (component.children) {
      return {
        ...component,
        children: addComponentToParent(component.children, parentId, newComponent)
      };
    }
    return component;
  });
};

export const useBuilderStore = create<BuilderStore>((set, get) => ({
  components: [],
  selectedComponentId: null,

  addComponent: (type, position, parentId) => {
    const definition = getComponentDefinition(type);
    if (!definition) return;

    const newComponent: Component = {
      id: nanoid(),
      type,
      props: {
        ...getDefaultProps(type),
        ...(position && !parentId && { style: `position: absolute; left: ${position.x}px; top: ${position.y}px;` }),
      },
      styles: getDefaultStyles(type),
      children: [],
    };

    set((state) => {
      if (parentId) {
        // Add component as a child of the specified parent
        return {
          components: addComponentToParent(state.components, parentId, newComponent),
          selectedComponentId: newComponent.id,
        };
      } else {
        // Add component to the root level
        return {
          components: [...state.components, newComponent],
          selectedComponentId: newComponent.id,
        };
      }
    });
  },

  updateComponentProps: (id, props) => {
    set((state) => ({
      components: state.components.map((component) =>
        component.id === id ? { ...component, props } : component
      ),
    }));
  },

  updateComponentStyles: (id, styles) => {
    set((state) => ({
      components: state.components.map((component) =>
        component.id === id ? { ...component, styles } : component
      ),
    }));
  },

  deleteComponent: (id) => {
    const deleteComponentRecursive = (components: Component[]): Component[] => {
      return components.filter(component => {
        if (component.id === id) return false;
        if (component.children) {
          component.children = deleteComponentRecursive(component.children);
        }
        return true;
      });
    };

    set((state) => ({
      components: deleteComponentRecursive(state.components),
      selectedComponentId: state.selectedComponentId === id ? null : state.selectedComponentId,
    }));
  },

  selectComponent: (id) => {
    set({ selectedComponentId: id });
  },

  moveComponent: (id, position) => {
    const moveComponentRecursive = (components: Component[]): Component[] => {
      return components.map(component => {
        if (component.id === id) {
          return {
            ...component,
            props: {
              ...component.props,
              style: `position: absolute; left: ${position.x}px; top: ${position.y}px;`,
            },
          };
        }
        if (component.children) {
          return {
            ...component,
            children: moveComponentRecursive(component.children),
          };
        }
        return component;
      });
    };

    set((state) => ({
      components: moveComponentRecursive(state.components),
    }));
  },

  duplicateComponent: (id) => {
    const component = get().components.find((c) => c.id === id);
    if (!component) return;

    const duplicatedComponent: Component = {
      ...component,
      id: nanoid(),
      props: {
        ...component.props,
        style: component.props.style?.replace(
          /left: (\d+)px/,
          (_: string, x: string) => `left: ${parseInt(x) + 20}px`
        ).replace(
          /top: (\d+)px/,
          (_: string, y: string) => `top: ${parseInt(y) + 20}px`
        ),
      },
    };

    set((state) => ({
      components: [...state.components, duplicatedComponent],
      selectedComponentId: duplicatedComponent.id,
    }));
  },

  getSelectedComponent: () => {
    const { components, selectedComponentId } = get();
    if (!selectedComponentId) return null;

    const findComponentRecursive = (components: Component[]): Component | null => {
      for (const component of components) {
        if (component.id === selectedComponentId) return component;
        if (component.children) {
          const found = findComponentRecursive(component.children);
          if (found) return found;
        }
      }
      return null;
    };

    return findComponentRecursive(components);
  },

  exportJSON: () => {
    return JSON.stringify(get().components, null, 2);
  },

  clearCanvas: () => {
    set({ components: [], selectedComponentId: null });
  },
}));
