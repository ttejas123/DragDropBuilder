export const DragItemTypes = {
  COMPONENT: 'component',
  CANVAS_COMPONENT: 'canvas_component'
} as const;

export interface DraggedComponent {
  type: string;
  id?: string;
}

export interface DropResult {
  dropZoneId?: string;
  position?: { x: number; y: number };
}

export function generateComponentId(type: string): string {
  return `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function getDropPosition(monitor: any, ref: React.RefObject<HTMLElement>): { x: number; y: number } {
  if (!ref.current) return { x: 0, y: 0 };
  
  const clientOffset = monitor.getClientOffset();
  if (!clientOffset) return { x: 0, y: 0 };
  
  const componentRect = ref.current.getBoundingClientRect();
  
  return {
    x: Math.max(0, clientOffset.x - componentRect.left),
    y: Math.max(0, clientOffset.y - componentRect.top)
  };
}
