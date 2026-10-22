import { PersonRecord } from '../../types';
import { GenealogyFlowNode, GenealogyFlowEdge, PersonFlowNode, UnionFlowNode } from '../types';

export interface LayoutOptions {
  onSelectPerson?: (id: string) => void;
  onAddChild?: (fatherId: string) => void;
  onAddSpouse?: (personId: string) => void;
  onDeletePerson?: (id: string) => void;
  onToggleCollapse?: (personId: string) => void;
  collapsedNodeIds?: Set<string>;
  selectedPersonId?: string | null;
}

export function buildGenealogyGraph(
  persons: PersonRecord[],
  options: LayoutOptions = {}
): { nodes: GenealogyFlowNode[]; edges: GenealogyFlowEdge[] } {
  if (!persons || persons.length === 0) {
    return { nodes: [], edges: [] };
  }

  const {
    collapsedNodeIds = new Set<string>(),
    onToggleCollapse,
    onSelectPerson,
    onAddChild,
    onAddSpouse,
    onDeletePerson,
    selectedPersonId,
  } = options;

  // Build a children map
  const childrenMap = new Map<string, PersonRecord[]>();
  persons.forEach((person) => {
    if (person.fatherId) {
      if (!childrenMap.has(person.fatherId)) {
        childrenMap.set(person.fatherId, []);
      }
      childrenMap.get(person.fatherId)!.push(person);
    }
  });

  // Calculate descendant count helper
  function countDescendants(personId: string): number {
    const children = childrenMap.get(personId) || [];
    let count = children.length;
    children.forEach((c) => {
      count += countDescendants(c.id);
    });
    return count;
  }

  // Find all hidden persons due to ancestor collapse
  const hiddenPersonIds = new Set<string>();
  function markDescendantsHidden(personId: string) {
    const children = childrenMap.get(personId) || [];
    children.forEach((c) => {
      hiddenPersonIds.add(c.id);
      markDescendantsHidden(c.id);
    });
  }

  collapsedNodeIds.forEach((collapsedId) => {
    markDescendantsHidden(collapsedId);
  });

  // Filter visible persons
  const visiblePersons = persons.filter((p) => !hiddenPersonIds.has(p.id));

  const nodes: GenealogyFlowNode[] = [];
  const edges: GenealogyFlowEdge[] = [];

  // Calculate hierarchical positions (Tree structure based on father-child)
  const nodeWidth = 230;
  const nodeHeight = 110;
  const horizontalGap = 50;
  const verticalGap = 160;

  // Find root ancestors
  const allVisibleIds = new Set(visiblePersons.map((p) => p.id));
  const rootPersons = visiblePersons.filter((p) => !p.fatherId || !allVisibleIds.has(p.fatherId));
  const roots = rootPersons.length > 0 ? rootPersons : visiblePersons.filter((p) => p.generation === 1);

  // Position calculation tree traversal
  const positions = new Map<string, { x: number; y: number }>();
  let currentLeafX = 0;

  function calculateSubtreePositions(person: PersonRecord): number {
    const isCollapsed = collapsedNodeIds.has(person.id);
    const visibleChildren = isCollapsed
      ? []
      : (childrenMap.get(person.id) || []).filter((c) => !hiddenPersonIds.has(c.id));

    const y = (person.generation - 1) * (nodeHeight + verticalGap);

    if (visibleChildren.length === 0) {
      const x = currentLeafX;
      positions.set(person.id, { x, y });
      currentLeafX += nodeWidth + horizontalGap;
      return x;
    }

    const childXPositions: number[] = [];
    visibleChildren.forEach((child) => {
      childXPositions.push(calculateSubtreePositions(child));
    });

    const minChildX = Math.min(...childXPositions);
    const maxChildX = Math.max(...childXPositions);
    const x = (minChildX + maxChildX) / 2;

    positions.set(person.id, { x, y });
    return x;
  }

  roots.forEach((root) => {
    calculateSubtreePositions(root);
    currentLeafX += horizontalGap * 2;
  });

  visiblePersons.forEach((person) => {
    if (!positions.has(person.id)) {
      const y = (person.generation - 1) * (nodeHeight + verticalGap);
      positions.set(person.id, { x: currentLeafX, y });
      currentLeafX += nodeWidth + horizontalGap;
    }
  });

  // Create Person Nodes and Union Nodes
  visiblePersons.forEach((person) => {
    const pos = positions.get(person.id) || { x: 0, y: 0 };
    const allChildren = childrenMap.get(person.id) || [];
    const isCollapsed = collapsedNodeIds.has(person.id);
    const visibleChildren = isCollapsed
      ? []
      : allChildren.filter((c) => !hiddenPersonIds.has(c.id));
    const hasSpouse = person.spouses && person.spouses.length > 0;
    const descendantsCount = countDescendants(person.id);

    // 1. Person Node
    const personNode: PersonFlowNode = {
      id: person.id,
      type: 'person',
      position: pos,
      data: {
        person,
        generation: person.generation,
        isSelected: person.id === selectedPersonId,
        hasChildren: allChildren.length > 0,
        isCollapsed,
        childrenCount: descendantsCount,
        onSelect: onSelectPerson,
        onAddChild,
        onAddSpouse,
        onDelete: onDeletePerson,
        onToggleCollapse,
      },
    };
    nodes.push(personNode);

    // 2. Union Node and Edges (only if not collapsed and has visible children)
    if (visibleChildren.length > 0) {
      const unionId = `union-${person.id}`;
      const spouseName = hasSpouse ? person.spouses.map((s) => s.name).join(' / ') : undefined;

      const unionNode: UnionFlowNode = {
        id: unionId,
        type: 'union',
        position: {
          x: pos.x + nodeWidth / 2 - 10,
          y: pos.y + nodeHeight + 40,
        },
        data: {
          unionId,
          fatherId: person.id,
          spouseName,
          generation: person.generation,
        },
      };
      nodes.push(unionNode);

      // Edge: Father -> Union
      edges.push({
        id: `e-${person.id}-${unionId}`,
        source: person.id,
        sourceHandle: 'child-out',
        target: unionId,
        targetHandle: 'union-father-in',
        type: 'genealogy',
        data: { relationship: 'bloodline' },
      });

      // Edge: Union -> Children
      visibleChildren.forEach((child) => {
        edges.push({
          id: `e-${unionId}-${child.id}`,
          source: unionId,
          sourceHandle: 'union-children-out',
          target: child.id,
          targetHandle: 'parent-in',
          type: 'genealogy',
          data: { relationship: 'bloodline' },
        });
      });
    }
  });

  return { nodes, edges };
}
