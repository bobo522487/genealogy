import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Plus, 
  Folder, 
  FolderOpen, 
  FolderPlus, 
  GitBranch, 
  ChevronDown, 
  ChevronRight, 
  Search, 
  MoreVertical, 
  Pencil, 
  Trash2, 
  Copy, 
  BookOpen
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { LineageBranch, PersonRecord } from '../types';
import { CreateBranchDialog } from './CreateBranchDialog';

interface LineageSidebarProps {
  branches: LineageBranch[];
  activeBranchId: string;
  onSelectBranch: (id: string) => void;
  persons?: PersonRecord[];
  selectedPersonId?: string | null;
  onSelectPerson?: (id: string) => void;
  onAddBranch: (branch: LineageBranch) => void;
  onUpdateBranch?: (id: string, updates: Partial<LineageBranch>) => void;
  onDeleteBranch?: (id: string) => void;
  onToggleFolder?: (id: string) => void;
}

export const LineageSidebar: React.FC<LineageSidebarProps> = ({
  branches,
  activeBranchId,
  onSelectBranch,
  onAddBranch,
  onUpdateBranch,
  onDeleteBranch,
  onToggleFolder,
}) => {
  // Dialogs
  const [isCreateBranchOpen, setIsCreateBranchOpen] = useState(false);
  const [targetFolderIdForNewBranch, setTargetFolderIdForNewBranch] = useState<string>('');

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');

  // Active Context Menu
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Inline Rename
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState<string>('');

  // Handle outside click for menus
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Directly create a default folder without dialog modal
  const handleCreateDefaultFolder = (parentId?: string) => {
    const existingNewFolders = branches.filter(
      b => b.type === 'folder' && b.name.startsWith('新建文件夹')
    );
    const folderNumber = existingNewFolders.length > 0 ? ` ${existingNewFolders.length + 1}` : '';
    const newFolderName = `新建文件夹${folderNumber}`;
    
    const newFolderId = `folder-${Date.now()}`;
    const newFolder: LineageBranch = {
      id: newFolderId,
      name: newFolderName,
      type: 'folder',
      isOpen: true,
      parentId: parentId || undefined,
      description: '新建卷宗文件夹',
      updatedAt: new Date().toISOString().split('T')[0]
    };

    onAddBranch(newFolder);
    // Directly start inline renaming
    setEditingId(newFolderId);
    setEditingName(newFolderName);
  };

  // Extract all folders
  const allFolders = useMemo(() => {
    return branches.filter(b => b.type === 'folder');
  }, [branches]);

  // Hierarchy builder for branches & folders
  const hierarchicalTree = useMemo(() => {
    const filterQuery = searchQuery.trim().toLowerCase();

    const buildTree = (parentId?: string): LineageBranch[] => {
      return branches
        .filter(b => (b.parentId || undefined) === (parentId || undefined))
        .filter(b => {
          if (!filterQuery) return true;
          return (
            b.name.toLowerCase().includes(filterQuery) ||
            b.description?.toLowerCase().includes(filterQuery) ||
            b.originAncestor?.toLowerCase().includes(filterQuery)
          );
        });
    };

    return buildTree(undefined);
  }, [branches, searchQuery]);

  const handleStartRename = (item: LineageBranch) => {
    setEditingId(item.id);
    setEditingName(item.name);
    setActiveMenuId(null);
  };

  const handleSaveRename = (id: string) => {
    if (editingName.trim() && onUpdateBranch) {
      onUpdateBranch(id, { name: editingName.trim() });
    }
    setEditingId(null);
  };

  const handleDuplicateBranch = (branch: LineageBranch) => {
    const newId = `branch-${Date.now()}`;
    const duplicated: LineageBranch = {
      ...branch,
      id: newId,
      name: `${branch.name} (副本)`,
      updatedAt: new Date().toISOString().split('T')[0]
    };
    onAddBranch(duplicated);
    setActiveMenuId(null);
  };

  const renderTreeItem = (item: LineageBranch, level: number = 0) => {
    const isFolder = item.type === 'folder';
    const isSelected = item.id === activeBranchId;
    const isEditing = editingId === item.id;
    const children = branches.filter(b => b.parentId === item.id);
    const isOpen = item.isOpen ?? true;

    return (
      <div key={item.id} className="flex flex-col select-none">
        <div
          style={{ paddingLeft: `${level * 14 + 10}px` }}
          onClick={() => {
            if (isFolder) {
              if (onToggleFolder) {
                onToggleFolder(item.id);
              } else if (onUpdateBranch) {
                onUpdateBranch(item.id, { isOpen: !isOpen });
              }
            } else {
              onSelectBranch(item.id);
            }
          }}
          className={`group flex items-center h-8 pr-2 py-1 cursor-pointer text-xs transition-colors rounded-md mx-1 ${
            isSelected
              ? 'bg-accent text-accent-foreground font-semibold shadow-2xs'
              : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
          }`}
        >
          {/* Chevron / Toggle for folder */}
          {isFolder ? (
            <span className="p-0.5 mr-1 text-muted-foreground/80 hover:text-foreground">
              {isOpen ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
            </span>
          ) : (
            <span className="w-3.5 mr-1" />
          )}

          {/* Icon */}
          <span className="mr-2 shrink-0">
            {isFolder ? (
              isOpen ? (
                <FolderOpen size={14} className="text-amber-500 fill-amber-500/20" />
              ) : (
                <Folder size={14} className="text-amber-500 fill-amber-500/20" />
              )
            ) : (
              <GitBranch size={14} className={isSelected ? 'text-primary' : 'text-primary/70'} />
            )}
          </span>

          {/* Name / Inline edit */}
          <div className="flex-1 min-w-0 mr-1">
            {isEditing ? (
              <input
                type="text"
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                onBlur={() => handleSaveRename(item.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveRename(item.id);
                  if (e.key === 'Escape') setEditingId(null);
                }}
                autoFocus
                onClick={(e) => e.stopPropagation()}
                className="w-full bg-background border border-primary rounded px-1 py-0.5 text-xs text-foreground outline-none"
              />
            ) : (
              <span className="truncate block">{item.name}</span>
            )}
          </div>

          {/* Badge (Generations or child count) */}
          {!isFolder && item.generationsCount && (
            <span className="text-[10px] px-1 py-0.2 rounded bg-muted/60 text-muted-foreground shrink-0 mr-1">
              {item.generationsCount}世
            </span>
          )}

          {isFolder && (
            <span className="text-[10px] px-1.5 rounded-full bg-muted/50 text-muted-foreground shrink-0 mr-1 font-mono">
              {children.length}
            </span>
          )}

          {/* Action Menu Trigger on Hover */}
          <div className="opacity-0 group-hover:opacity-100 flex items-center gap-0.5 transition-opacity">
            {isFolder && (
              <button
                title="在此文件夹下新建谱系"
                onClick={(e) => {
                  e.stopPropagation();
                  setTargetFolderIdForNewBranch(item.id);
                  setIsCreateBranchOpen(true);
                }}
                className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted rounded"
              >
                <Plus size={12} />
              </button>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveMenuId(activeMenuId === item.id ? null : item.id);
              }}
              className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted rounded"
            >
              <MoreVertical size={12} />
            </button>
          </div>

          {/* Context Menu Dropdown */}
          {activeMenuId === item.id && (
            <div
              ref={menuRef}
              onClick={(e) => e.stopPropagation()}
              className="absolute left-36 z-50 mt-1 w-32 bg-popover text-popover-foreground border border-border rounded-lg shadow-lg py-1 text-xs animate-in fade-in zoom-in-95"
            >
              <button
                onClick={() => handleStartRename(item)}
                className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-accent hover:text-accent-foreground text-left"
              >
                <Pencil size={12} /> 重命名
              </button>

              {!isFolder && (
                <button
                  onClick={() => handleDuplicateBranch(item)}
                  className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-accent hover:text-accent-foreground text-left"
                >
                  <Copy size={12} /> 复制谱系
                </button>
              )}

              {onDeleteBranch && (
                <button
                  onClick={() => {
                    if (confirm(`确定删除【${item.name}】${isFolder ? '及其包含的谱系' : ''}吗？`)) {
                      onDeleteBranch(item.id);
                    }
                    setActiveMenuId(null);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-destructive/10 text-destructive text-left"
                >
                  <Trash2 size={12} /> 删除
                </button>
              )}
            </div>
          )}
        </div>

        {/* Recursive Children for Folders */}
        {isFolder && isOpen && children.length > 0 && (
          <div className="flex flex-col">
            {children.map(child => renderTreeItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full overflow-hidden select-none bg-card text-foreground">
      {/* 1. Header */}
      <div className="h-12 px-4 border-b border-border flex justify-between items-center shrink-0 bg-muted/10">
        <div className="flex items-center gap-2">
          <BookOpen size={16} className="text-primary" />
          <span className="font-semibold text-sm text-foreground">谱系管理</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleCreateDefaultFolder()}
            className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            title="新建文件夹"
          >
            <FolderPlus size={15} />
          </button>
          <button
            onClick={() => {
              setTargetFolderIdForNewBranch('');
              setIsCreateBranchOpen(true);
            }}
            className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            title="新建谱系"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        {/* 2. Top Action Button: 新建谱系 */}
        <div className="px-3 mb-2 mt-3 shrink-0">
          <Button
            variant="secondary"
            className="w-full justify-start h-8 text-xs font-semibold bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 shadow-xs"
            size="sm"
            onClick={() => {
              setTargetFolderIdForNewBranch('');
              setIsCreateBranchOpen(true);
            }}
          >
            <Plus size={14} className="mr-2" /> 新建谱系
          </Button>
        </div>

        {/* 3. 谱系树 (Lineage & Folders Tree - Full Height) */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {/* Header Row */}
          <div className="px-4 py-1 text-xs font-bold text-muted-foreground uppercase mb-1.5 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-1.5">
              <span>谱系卷册</span>
              <span className="text-[10px] bg-muted px-1.5 py-0.2 rounded-full font-mono">
                {branches.filter(b => b.type !== 'folder').length}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleCreateDefaultFolder()}
                className="text-muted-foreground hover:text-foreground p-1 rounded hover:bg-muted transition-colors"
                title="新建文件夹"
              >
                <FolderPlus size={13} />
              </button>
              <button
                onClick={() => {
                  setTargetFolderIdForNewBranch('');
                  setIsCreateBranchOpen(true);
                }}
                className="text-muted-foreground hover:text-foreground p-1 rounded hover:bg-muted transition-colors"
                title="新建谱系"
              >
                <Plus size={13} />
              </button>
            </div>
          </div>

          {/* Search Box */}
          <div className="px-3 mb-2 shrink-0">
            <div className="relative group">
              <Search
                size={12}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary"
              />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索谱系或文件夹..."
                className="h-7 pl-7 pr-2 text-xs bg-muted/40 border-border rounded"
              />
            </div>
          </div>

          {/* Tree View Container */}
          <div className="flex-1 overflow-y-auto px-1 pb-4 scrollbar-thin scrollbar-thumb-muted-foreground/20">
            {hierarchicalTree.length === 0 ? (
              <div className="px-4 py-6 text-center text-xs text-muted-foreground">
                <p>暂无匹配谱系</p>
                <button
                  onClick={() => setIsCreateBranchOpen(true)}
                  className="mt-2 text-primary text-[11px] underline underline-offset-2"
                >
                  点击新建谱系
                </button>
              </div>
            ) : (
              hierarchicalTree.map(item => renderTreeItem(item, 0))
            )}
          </div>
        </div>
      </div>

      {/* Dialog: Create Branch */}
      <CreateBranchDialog
        isOpen={isCreateBranchOpen}
        onClose={() => setIsCreateBranchOpen(false)}
        onCreate={(branch) => {
          onAddBranch(branch);
          onSelectBranch(branch.id);
        }}
        folders={allFolders}
        defaultParentId={targetFolderIdForNewBranch}
      />
    </div>
  );
};

export default LineageSidebar;
