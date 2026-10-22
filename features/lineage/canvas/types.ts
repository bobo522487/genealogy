import { Node, Edge } from '@xyflow/react';
import { PersonRecord } from '../types';

export interface PersonNodeData {
  person: PersonRecord;
  generation: number;
  isSelected?: boolean;
  hasChildren?: boolean;
  isCollapsed?: boolean;
  childrenCount?: number;
  biographyPage?: number;
  biographyOrder?: number;
  onSelect?: (personId: string) => void;
  onOpenBiography?: (personId: string) => void;
  onAddChild?: (personId: string) => void;
  onAddSpouse?: (personId: string) => void;
  onDelete?: (personId: string) => void;
  onToggleCollapse?: (personId: string) => void;
}

export interface UnionNodeData {
  unionId: string;
  fatherId: string;
  spouseName?: string;
  spouseId?: string;
  generation: number;
}

export interface GenHeaderNodeData {
  generation: number;
  label: string;
  count?: number;
  onFilterGeneration?: (gen: number) => void;
}

export type PersonFlowNode = Node<PersonNodeData, 'person' | 'bookPerson'>;
export type UnionFlowNode = Node<UnionNodeData, 'union'>;
export type GenHeaderFlowNode = Node<GenHeaderNodeData, 'genHeader'>;
export type GenealogyFlowNode = PersonFlowNode | UnionFlowNode | GenHeaderFlowNode;

export type GenealogyFlowEdge = Edge<{
  relationship?: 'marriage' | 'bloodline' | 'adoption';
  color?: string;
}>;
