import React from 'react';
import { ViewMode } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import { LineageSidebar } from '../../features/lineage/components/LineageSidebar';

interface SidebarProps {
  files?: any[];
  onToggleFolder?: (id: string) => void;
  onSelectFile?: (node: any) => void;
  selectedFileId?: string | null;
  width: number;
}

const Sidebar: React.FC<SidebarProps> = ({ width }) => {
  const { 
    activeView,
    branches,
    activeBranchId,
    setActiveBranchId,
    persons,
    selectedPersonId,
    setSelectedPersonId,
    addBranch,
    updateBranch,
    deleteBranch,
    toggleBranchFolder
  } = useAppStore();

  if (activeView !== ViewMode.LINEAGE) {
    return null;
  }

  return (
    <div 
      style={{ width }}
      className="flex flex-col bg-card h-full shrink-0 transition-colors relative z-20 overflow-hidden border-r border-border"
    >
      <LineageSidebar 
        branches={branches}
        activeBranchId={activeBranchId}
        onSelectBranch={setActiveBranchId}
        persons={persons}
        selectedPersonId={selectedPersonId}
        onSelectPerson={setSelectedPersonId}
        onAddBranch={addBranch}
        onUpdateBranch={updateBranch}
        onDeleteBranch={deleteBranch}
        onToggleFolder={toggleBranchFolder}
      />
    </div>
  );
};

export default Sidebar;
