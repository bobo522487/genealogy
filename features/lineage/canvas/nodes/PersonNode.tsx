import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { PersonFlowNode } from '../types';
import { 
  User, 
  Crown, 
  Heart, 
  Plus, 
  Trash2, 
  Eye, 
  Sparkles,
  Scroll,
  ChevronDown,
  ChevronUp,
  Users
} from 'lucide-react';
import { formatGivenName } from '../../utils/nameUtils';

export const PersonNode: React.FC<NodeProps<PersonFlowNode>> = memo(({ data, selected }) => {
  const { 
    person, 
    onSelect, 
    onAddChild, 
    onAddSpouse, 
    onDelete, 
    hasChildren, 
    isCollapsed, 
    childrenCount = 0,
    onToggleCollapse 
  } = data;
  const isMale = person.gender === 'male';

  return (
    <div
      onClick={() => onSelect?.(person.id)}
      className={`group relative rounded-xl border transition-all duration-200 cursor-pointer select-none bg-card shadow-sm ${
        selected
          ? 'ring-2 ring-primary border-primary shadow-md bg-primary/5 -translate-y-0.5'
          : 'border-border hover:border-primary/50 hover:shadow'
      } ${
        person.generation === 1 
          ? 'w-56 border-amber-500/40 bg-gradient-to-b from-amber-500/5 to-transparent' 
          : 'w-52'
      }`}
    >
      {/* 1. Top Target Handle (Incoming parent bloodline) */}
      <Handle
        type="target"
        position={Position.Top}
        id="parent-in"
        className="!w-2.5 !h-2.5 !bg-primary !border-2 !border-background transition-transform hover:scale-125 -top-1.5"
      />

      {/* 2. Left / Right Handles (For horizontal relations or spouse connection) */}
      <Handle
        type="source"
        position={Position.Right}
        id="spouse-out"
        className="!w-2 !h-2 !bg-pink-500/80 !border-2 !border-background -right-1"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="spouse-in"
        className="!w-2 !h-2 !bg-pink-500/80 !border-2 !border-background -left-1"
      />

      {/* Card Header & Generation / Rank Tags */}
      <div className="px-3 pt-2.5 pb-1 flex items-center justify-between border-b border-border/40">
        <div className="flex items-center gap-1.5">
          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium flex items-center gap-1 ${
            person.generation === 1
              ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 font-bold'
              : 'bg-muted text-muted-foreground'
          }`}>
            {person.generation === 1 && <Crown size={10} className="text-amber-500" />}
            第 {person.generation} 世
          </span>

          {person.rank && (
            <span className="text-[10px] px-1 py-0.2 rounded bg-muted/60 text-muted-foreground">
              {person.rank}
            </span>
          )}
        </div>

        {/* Status / Title */}
        <div className="flex items-center gap-1">
          {person.officialTitle && (
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-primary/10 text-primary font-medium max-w-[70px] truncate">
              {person.officialTitle}
            </span>
          )}
          {person.status === 'deceased' ? (
            <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40" title="已故" />
          ) : (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="健在" />
          )}
        </div>
      </div>

      {/* Card Main Body */}
      <div className="p-3">
        <div className="flex items-start gap-2.5">
          {/* Avatar Icon */}
          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${
            person.generation === 1
              ? 'bg-amber-500/15 border-amber-500/30 text-amber-600 dark:text-amber-400'
              : isMale
              ? 'bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400'
              : 'bg-pink-500/10 border-pink-500/20 text-pink-600 dark:text-pink-400'
          }`}>
            {person.generation === 1 ? (
              <Crown size={15} />
            ) : (
              <User size={15} />
            )}
          </div>

          {/* Name & Subtitle Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-1.5">
              <span className="font-bold text-sm text-foreground tracking-wide font-serif truncate">
                {formatGivenName(person.name)}
              </span>
              {person.courtesyName && (
                <span className="text-[11px] text-muted-foreground font-normal truncate">
                  字 {person.courtesyName}
                </span>
              )}
            </div>

            {/* Birth / Death or Burial */}
            <div className="text-[11px] text-muted-foreground/80 mt-0.5 truncate">
              {person.birthDate ? (
                <span>生于 {person.birthDate}</span>
              ) : person.biography ? (
                <span>{person.biography.slice(0, 14)}...</span>
              ) : (
                <span className="text-[10px] text-muted-foreground/50">暂无详注</span>
              )}
            </div>
          </div>
        </div>

        {/* Spouses List Pills */}
        {person.spouses && person.spouses.length > 0 && (
          <div className="mt-2 pt-1.5 border-t border-border/40 flex items-center gap-1 flex-wrap">
            <Heart size={10} className="text-pink-500/70 shrink-0" />
            {person.spouses.map((s, idx) => (
              <span
                key={idx}
                className="text-[10px] px-1.5 py-0.2 rounded bg-pink-500/10 text-pink-700 dark:text-pink-300 truncate max-w-[120px]"
                title={`${s.name} (${s.clanOrigin || '待考'})`}
              >
                {s.name}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Subtree Collapse/Expand Toggle Button */}
      {hasChildren && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleCollapse?.(person.id);
          }}
          className={`absolute -bottom-2.5 right-2 px-1.5 py-0.5 rounded-full text-[10px] font-mono flex items-center gap-0.5 border shadow-2xs z-30 transition-colors ${
            isCollapsed
              ? 'bg-amber-500 text-white border-amber-600 font-semibold'
              : 'bg-card text-muted-foreground border-border hover:text-foreground'
          }`}
          title={isCollapsed ? `展开后代 (${childrenCount}人)` : '折叠后代分支'}
        >
          <Users size={10} />
          <span>{childrenCount}</span>
          {isCollapsed ? <ChevronDown size={10} /> : <ChevronUp size={10} />}
        </button>
      )}

      {/* Quick Action Floating Bar on Hover / Selection */}
      <div className={`absolute -bottom-3.5 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-popover/95 backdrop-blur border border-border rounded-full shadow px-1.5 py-0.5 z-20 transition-all ${
        selected ? 'opacity-100 scale-100' : 'opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100'
      }`}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddChild?.(person.id);
          }}
          title="添子女"
          className="p-1 hover:bg-primary/20 text-primary rounded-full transition-colors flex items-center gap-0.5 text-[10px] font-medium px-1.5"
        >
          <Plus size={11} /> 添子
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddSpouse?.(person.id);
          }}
          title="添配偶"
          className="p-1 hover:bg-pink-500/20 text-pink-600 dark:text-pink-400 rounded-full transition-colors flex items-center gap-0.5 text-[10px] font-medium px-1.5"
        >
          <Heart size={10} /> 添配
        </button>

        {onDelete && person.generation > 1 && (
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

      {/* 3. Bottom Source Handle (Outgoing bloodline to union or children) */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="child-out"
        className="!w-2.5 !h-2.5 !bg-primary !border-2 !border-background transition-transform hover:scale-125 -bottom-1.5"
      />
    </div>
  );
});

PersonNode.displayName = 'PersonNode';

