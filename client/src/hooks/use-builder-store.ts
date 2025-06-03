import { create } from 'zustand';
import { Component, ComponentType, EventHandlerSchema } from '@shared/schema';
import { getComponentDefinition, getDefaultProps, getDefaultStyles } from '@/lib/component-registry';
import { nanoid } from 'nanoid';
import { z } from 'zod';

interface BuilderStore {
  components: Component[];
  selectedComponentId: string | null;
  addComponent: (type: ComponentType, position?: { x: number; y: number }, parentId?: string) => void;
  updateComponentProps: (id: string, props: Record<string, any>) => void;
  updateComponentStyles: (id: string, styles: Record<string, string>) => void;
  updateComponentEvents: (id: string, events: z.infer<typeof EventHandlerSchema>[]) => void;
  deleteComponent: (id: string) => void;
  selectComponent: (id: string | null) => void;
  moveComponent: (id: string, position: { x: number; y: number }) => void;
  duplicateComponent: (id: string) => void;
  getSelectedComponent: () => Component | null;
  exportJSON: () => string;
  clearCanvas: () => void;
  importComponents: (components: Component[]) => void;
  setComponents: (components: Component[]) => void;
}

// Helper function to add a component to a parent's children array
const addComponentToParent = (components: Component[], parentId: string, newComponent: Component): Component[] => {
  return components.map(component => {
    if (component.mf_id === parentId) {
      return {
        ...component,
        components: [...(component.components || []), newComponent]
      };
    }
    if (component.components) {
      return {
        ...component,
        components: addComponentToParent(component.components, parentId, newComponent)
      };
    }
    return component;
  });
};

// Helper function to generate a unique mf_id
const generateMfId = (type: string): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  return `${type.toLowerCase()}_${timestamp}_${random}`;
};

export const useBuilderStore = create<BuilderStore>((set, get) => ({
  components: [],
  selectedComponentId: null,

  addComponent: (type, position, parentId) => {
    const definition = getComponentDefinition(type);
    if (!definition) return;

    const mfId = generateMfId(type);
    const dataId = `${type.toLowerCase()}_${nanoid(6)}`;

    const newComponent: Component = {
      entity_key: null,
      entity_label: null,
      id: nanoid(),
      mf_id: mfId,
      data_id: dataId,
      ui_template: {
        id: type,
        grid: {
          xs: 24,
          md: 12,
          lg: 8,
        },
        props: {
          ...getDefaultProps(type),
          ...(position && !parentId && {
            style: {
              position: 'absolute',
              left: `${position.x}px`,
              top: `${position.y}px`,
            }
          }),
        },
        style: getDefaultStyles(type),
        gutter: null,
      },
      parent_id: parentId || null,
      layout_config: {
        order: 1,
        visible: true,
      },
      api: [],
      type: type === 'container' || type === 'grid' ? 'MODULE' : 'FIELD',
      application_context_dependency: [],
      local_context_dependency: [],
      created_at: new Date().toISOString(),
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null,
      remarks: null,
      components: [],
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
    const updatePropsRecursive = (components: Component[]): Component[] => {
      return components.map(component => {
        if (component.id === id) {
          return {
            ...component,
            ui_template: {
              ...component.ui_template,
              props: {
                ...component.ui_template.props,
                ...props,
              },
            },
          };
        }
        if (component.components) {
          return {
            ...component,
            components: updatePropsRecursive(component.components),
          };
        }
        return component;
      });
    };

    set((state) => ({
      components: updatePropsRecursive(state.components),
    }));
  },

  updateComponentStyles: (id, styles) => {
    const updateStylesRecursive = (components: Component[]): Component[] => {
      return components.map(component => {
        if (component.id === id) {
          return {
            ...component,
            ui_template: {
              ...component.ui_template,
              style: {
                ...component.ui_template.style,
                ...styles,
              },
            },
          };
        }
        if (component.components) {
          return {
            ...component,
            components: updateStylesRecursive(component.components),
          };
        }
        return component;
      });
    };

    set((state) => ({
      components: updateStylesRecursive(state.components),
    }));
  },

  updateComponentEvents: (id, events) => {
    const updateEventsRecursive = (components: Component[]): Component[] => {
      return components.map(component => {
        if (component.id === id) {
          return {
            ...component,
            events
          };
        }
        if (component.components) {
          return {
            ...component,
            components: updateEventsRecursive(component.components)
          };
        }
        return component;
      });
    };

    set((state) => ({
      components: updateEventsRecursive(state.components)
    }));
  },

  deleteComponent: (id) => {
    const deleteComponentRecursive = (components: Component[]): Component[] => {
      return components.filter(component => {
        if (component.id === id) return false;
        if (component.components) {
          component.components = deleteComponentRecursive(component.components);
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
            ui_template: {
              ...component.ui_template,
              props: {
                ...component.ui_template.props,
                style: {
                  ...component.ui_template.props?.style,
                  position: 'absolute',
                  left: `${position.x}px`,
                  top: `${position.y}px`,
                },
              },
            },
          };
        }
        if (component.components) {
          return {
            ...component,
            components: moveComponentRecursive(component.components),
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
    const findAndDuplicateComponent = (components: Component[]): [Component[], Component | null] => {
      for (const component of components) {
        if (component.id === id) {
          const duplicated: Component = {
            ...component,
            id: nanoid(),
            mf_id: generateMfId(component.type),
            data_id: `${component.type.toLowerCase()}_${nanoid(6)}`,
            ui_template: {
              ...component.ui_template,
              props: {
                ...component.ui_template.props,
                style: {
                  ...component.ui_template.props?.style,
                  left: `${parseInt(component.ui_template.props?.style?.left || '0') + 20}px`,
                  top: `${parseInt(component.ui_template.props?.style?.top || '0') + 20}px`,
                },
              },
            },
            created_at: new Date().toISOString(),
            updated_at: null,
          };
          return [components, duplicated];
        }
        if (component.components) {
          const [updatedChildren, duplicated] = findAndDuplicateComponent(component.components);
          if (duplicated) {
            return [[...components, duplicated], duplicated];
          }
          component.components = updatedChildren;
        }
      }
      return [components, null];
    };

    set((state) => {
      const [updatedComponents, duplicated] = findAndDuplicateComponent(state.components);
      return {
        components: updatedComponents,
        selectedComponentId: duplicated?.id || null,
      };
    });
  },

  getSelectedComponent: () => {
    const { components, selectedComponentId } = get();
    if (!selectedComponentId) return null;

    const findComponentRecursive = (components: Component[]): Component | null => {
      for (const component of components) {
        if (component.id === selectedComponentId) return component;
        if (component.components) {
          const found = findComponentRecursive(component.components);
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

  importComponents: (components) => {
    set((state) => ({
      components: [...state.components, ...components],
      selectedComponentId: null,
    }));
  },

  setComponents: (components) => {
    set({ components });
  },
}));
