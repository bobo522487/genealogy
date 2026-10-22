import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { PersonFlowNode } from '../types';
import { 
  BookOpen, 
  Plus, 
  Trash2, 
  Heart, 
  ChevronRight, 
  ChevronLeft,
  Users
} from 'lucide-react';
import { formatGivenName } from '../../utils/nameUtils';

export const BookPersonNode: React.FC<NodeProps<PersonFlowNode>> = memo(({ data, selected }) => {
  const { 
    person, 
    onSelect, 
    onOpenBiography, 
    onAddChild, 
    onAddSpouse, 
    onDelete, 
    hasChildren, 
    isCollapsed, 
    childrenCount = 0, 
    onToggleCollapse 
  } = data;

  const isRoot = person.generation === 1;
  const isMale = person.gender === 'male';

  // Calculate default biography page index (e.g., base 20 + generation * 2 + rank)
  const displayPage = person.biographyPage || (20 + (person.generation - 1) * 3 + (person.generation > 4 ? 2 : 0));
  const displayOrder = person.biographyOrder;

  return (
    <div
      onClick={() => onSelect?.(person.id)}
      className={`group relative w-[112px] flex flex-col items-center justify-center text-center select-none cursor-pointer transition-all duration-150 py-1 px-1 rounded-md ${
        selected
          ? 'ring-2 ring-primary bg-primary/10 shadow-xs'
          : 'hover:bg-muted/60'
      }`}
    >
      {/* 1. Left Target Handle (Bloodline incoming from Left / Father) */}
      {!isRoot && (
        <Handle
          type="target"
          position={Position.Left}
          id="parent-in-ltr"
          className="!w-2 !h-2 !bg-primary !border-2 !border-background -left-1 !top-[14px] opacity-0 group-hover:opacity-100 transition-opacity"
        />
      )}

      {/* Main Row: Bullet Dot + Person Name (Strictly Centered) */}
      <div className="flex items-center justify-center gap-1.5 w-full">
        {/* Theme Bullet Dot (○ for root, ● for descendants) */}
        <span 
          className={`shrink-0 flex items-center justify-center transition-transform group-hover:scale-125 ${
            isRoot
              ? 'w-3.5 h-3.5 rounded-full border-2 border-primary bg-background shadow-xs'
              : 'w-2.5 h-2.5 rounded-full bg-primary'
          }`}
          title={isRoot ? '始祖' : `第 ${person.generation} 世`}
        />

        {/* Person Name (Classic SongTi/Serif Font) */}
        <span className="font-serif font-bold text-sm md:text-base tracking-widest text-foreground whitespace-nowrap">
          {formatGivenName(person.name)}
        </span>

        {/* Rank indicator (e.g., 幼 / 长) */}
        {person.rank && !isRoot && (
          <span className="text-[10px] text-muted-foreground font-serif shrink-0">
            {person.rank.replace('子', '').replace('女', '')}
          </span>
        )}
      </div>

      {/* Sub Row: Book Page Index [ 🕮 24 ] (Classic European Genealogy Page Reference) */}
      <div className="flex items-center justify-center gap-1 mt-0.5 w-full">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenBiography?.(person.id) || onSelect?.(person.id);
          }}
          title={`点击查阅第 ${displayPage} 页【${person.name}】行传事略`}
          className="flex items-center gap-0.5 px-1 py-0.2 rounded border border-border bg-card/90 text-[10px] font-mono text-muted-foreground hover:border-primary hover:text-foreground transition-colors shadow-2xs"
        >
          <BookOpen size={9} className="text-muted-foreground group-hover:text-primary shrink-0" />
          <span className="font-semibold">{displayPage}</span>
          {displayOrder && (
            <span className="text-[9px] text-muted-foreground/70">\{displayOrder}</span>
          )}
        </button>

        {/* Subtree Collapse Toggle Button */}
        {hasChildren && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleCollapse?.(person.id);
            }}
            className={`px-1 py-0.2 rounded text-[9px] font-mono flex items-center gap-0.5 border shadow-2xs transition-colors ${
              isCollapsed
                ? 'bg-primary/15 text-primary border-primary/30 font-bold'
                : 'bg-muted text-muted-foreground border-border hover:text-foreground'
            }`}
            title={isCollapsed ? `展开后代 (${childrenCount}人)` : '折叠后代'}
          >
            {isCollapsed ? <ChevronRight size={9} /> : <ChevronLeft size={9} />}
            <span>{childrenCount}</span>
          </button>
        )}
      </div>

      {/* Floating Action Menu on Hover / Selection */}
      <div className={`absolute -top-7 left-1/2 -translate-x-1/2 flex items-center gap-0.5 bg-popover/95 border border-border backdrop-blur text-popover-foreground rounded-full shadow-md px-1.5 py-0.5 z-40 transition-all ${
        selected ? 'opacity-100 scale-100' : 'opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 pointer-events-none group-hover:pointer-events-auto'
      }`}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddChild?.(person.id);
          }}
          title="添子女"
          className="p-1 hover:bg-muted rounded-full transition-colors flex items-center gap-0.5 text-[10px] font-medium"
        >
          <Plus size={10} /> 添子
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenBiography?.(person.id) || onSelect?.(person.id);
          }}
          title="查阅行传"
          className="p-1 hover:bg-muted rounded-full transition-colors flex items-center gap-0.5 text-[10px] font-medium"
        >
          <BookOpen size={10} /> 行传
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddSpouse?.(person.id);
          }}
          title="添配偶"
          className="p-1 hover:bg-muted rounded-full transition-colors text-pink-500"
        >
          <Heart size={10} />
        </button>

        {onDelete && !isRoot && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (confirm(`确定从谱系中删除【${person.name}】吗？`)) {
                onDelete(person.id);
              }
            }}
            title="删除"
            className="p-1 hover:bg-destructive/20 text-destructive rounded-full transition-colors"
          >
            <Trash2 size={10} />
          </button>
        )}
      </div>

      {/* 2. Right Source Handle (Bloodline outgoing to Right / Children) */}
      <Handle
        type="source"
        position={Position.Right}
        id="child-out-ltr"
        className="!w-2 !h-2 !bg-primary !border-2 !border-background -right-1 !top-[14px] opacity-0 group-hover:opacity-100 transition-opacity"
      />
    </div>
  );
});

BookPersonNode.displayName = 'BookPersonNode';

