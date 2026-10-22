import React, { useState } from 'react';
import { LineageTreeView } from '../components/LineageTreeView';
import { LineageBiographyView } from '../components/LineageBiographyView';
import { LineageGridView } from '../components/LineageGridView';
import { LineageTableView } from '../components/LineageTableView';
import { PersonDetailPanel } from '../components/PersonDetailPanel';
import { AddPersonDialog } from '../components/AddPersonDialog';
import { PersonRecord } from '../types';
import { useResizable } from '../../../hooks/useResizable';
import { useAppStore } from '../../../store/useAppStore';
import { 
  Network, 
  Table, 
  ListTree, 
  UserPlus, 
  BookOpen, 
  Share2, 
  Printer, 
  Check, 
  Download,
  Scroll,
  Database
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { DatabaseTestDialog } from '../../../components/database/DatabaseTestDialog';

export const LineagePage: React.FC = () => {
  const {
    branches,
    activeBranchId,
    persons,
    selectedPersonId,
    setSelectedPersonId,
    lineageViewMode: viewMode,
    setLineageViewMode: setViewMode,
    addPerson,
    updatePerson,
    deletePerson
  } = useAppStore();

  const [scale, setScale] = useState<number>(1);
  const [maxGenFilter, setMaxGenFilter] = useState<number>(20);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);
  const [addDialogParent, setAddDialogParent] = useState<PersonRecord | null>(null);
  const [copiedNotification, setCopiedNotification] = useState(false);
  const [isDatabaseModalOpen, setIsDatabaseModalOpen] = useState(false);

  // Right Inspector Resizing
  const { width: inspectorWidth, startResizing } = useResizable({
    initialWidth: 340,
    minWidth: 280,
    maxWidth: 550,
    edge: 'right'
  });

  const activeBranch = branches.find(b => b.id === activeBranchId) || branches[0];
  const branchPersons = persons.filter(p => p.branchId === activeBranchId || !p.branchId);
  const selectedPerson = branchPersons.find(p => p.id === selectedPersonId) || branchPersons[0] || null;

  const handleOpenAddChild = (fatherId: string) => {
    const father = branchPersons.find(p => p.id === fatherId) || null;
    setAddDialogParent(father);
    setIsAddDialogOpen(true);
  };

  const handleOpenAddSpouse = (personId: string) => {
    setSelectedPersonId(personId);
    const person = branchPersons.find(p => p.id === personId);
    if (person) {
      const currentSpouses = person.spouses || [];
      updatePerson(personId, {
        spouses: [...currentSpouses, { name: '妣某氏', clanOrigin: '系出待考' }]
      });
    }
  };

  const handleShareOrExport = () => {
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
    window.print();
  };

  const handleAddPersonDirectly = (initialData: Partial<PersonRecord>, position?: { x: number; y: number }) => {
    const newId = `person-${Date.now()}`;
    const newPerson: PersonRecord = {
      id: newId,
      name: initialData.name || '新录族人',
      generation: initialData.generation || 1,
      gender: initialData.gender || 'male',
      status: 'living',
      fatherId: initialData.fatherId || null,
      branchId: activeBranchId,
      spouses: [],
      biographyPage: 20 + ((initialData.generation || 1) - 1) * 3,
    };
    addPerson(newPerson);
    setSelectedPersonId(newId);
  };

  const handleUpdatePersonFather = (childId: string, fatherId: string | null) => {
    const father = persons.find(p => p.id === fatherId);
    updatePerson(childId, { 
      fatherId,
      fatherName: father?.name,
      generation: father ? father.generation + 1 : 1
    });
  };

  return (
    <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden bg-background">
      {/* 1. Lineage Workspace Toolbar */}
      <div className="h-14 border-b border-border bg-card/80 backdrop-blur px-4 flex items-center justify-between shrink-0 z-10 select-none">
        {/* Left: Branch Title & Generation count */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <BookOpen size={18} className="text-primary" />
            <h1 className="font-bold text-sm tracking-tight text-foreground font-serif">
              {activeBranch?.name || '陈氏族谱世系图'}
            </h1>
          </div>

          <span className="text-xs text-muted-foreground bg-muted/80 px-2 py-0.5 rounded-full font-mono">
            共 {branchPersons.length} 位族人
          </span>
        </div>

        {/* Center: View Switcher Tabs (欧式世系图 / 欧式行传 / 五世表 / 名录总表) */}
        <div className="flex bg-muted/60 p-1 rounded-lg border border-border/40 font-serif">
          <button
            onClick={() => setViewMode('tree')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-all ${
              viewMode === 'tree'
                ? 'bg-background text-primary shadow-sm font-bold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            title="现代书籍阅读习惯：欧式左至右世系图"
          >
            <Network size={13} />
            <span>欧式世系图</span>
          </button>

          <button
            onClick={() => setViewMode('biography')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-all ${
              viewMode === 'biography'
                ? 'bg-background text-primary shadow-sm font-bold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            title="欧式行传录：五世提头、图传互引"
          >
            <Scroll size={13} />
            <span>欧式行传录</span>
          </button>

          <button
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-all ${
              viewMode === 'grid'
                ? 'bg-background text-primary shadow-sm font-bold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <ListTree size={13} />
            <span>五世对照表</span>
          </button>

          <button
            onClick={() => setViewMode('table')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-all ${
              viewMode === 'table'
                ? 'bg-background text-primary shadow-sm font-bold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Table size={13} />
            <span>宗谱总名录</span>
          </button>
        </div>

        {/* Right: Cloud DB & Actions */}
        <div className="flex items-center gap-2">
          <Button
            id="lineage-btn-supabase-sync"
            variant="outline"
            size="sm"
            onClick={() => setIsDatabaseModalOpen(true)}
            className="h-8 px-2.5 text-xs gap-1.5 border-emerald-500/30 bg-emerald-500/5 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/10"
            title="测试与同步 Supabase 数据库"
          >
            <Database size={13} className="text-emerald-500" />
            <span className="hidden sm:inline font-medium">Supabase 云数据库</span>
          </Button>
        </div>
      </div>

      {/* 2. Main Content & Right Inspector */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Main View Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative bg-muted/10">
          {viewMode === 'tree' && (
            <LineageTreeView
              persons={branchPersons}
              selectedPersonId={selectedPersonId}
              branchTitle={activeBranch?.name || '陈氏族谱世系图'}
              onSelectPerson={setSelectedPersonId}
              onOpenBiography={(id) => {
                setSelectedPersonId(id);
                setViewMode('biography');
              }}
              onAddChild={handleOpenAddChild}
              onAddSpouse={handleOpenAddSpouse}
              onDeletePerson={deletePerson}
              onAddPersonDirectly={handleAddPersonDirectly}
              onUpdatePersonFather={handleUpdatePersonFather}
              scale={scale}
              maxGenerationFilter={maxGenFilter}
            />
          )}

          {viewMode === 'biography' && (
            <LineageBiographyView
              persons={branchPersons}
              selectedPersonId={selectedPersonId}
              branchName={activeBranch?.name || '陈氏族谱'}
              onSelectPerson={setSelectedPersonId}
              onNavigateToTree={(id) => {
                setSelectedPersonId(id);
                setViewMode('tree');
              }}
            />
          )}

          {viewMode === 'grid' && (
            <LineageGridView
              persons={branchPersons}
              selectedPersonId={selectedPersonId}
              onSelectPerson={setSelectedPersonId}
              onAddChild={handleOpenAddChild}
            />
          )}

          {viewMode === 'table' && (
            <LineageTableView
              persons={branchPersons}
              selectedPersonId={selectedPersonId}
              onSelectPerson={setSelectedPersonId}
              onAddPerson={() => {
                setAddDialogParent(null);
                setIsAddDialogOpen(true);
              }}
              onDeletePerson={deletePerson}
            />
          )}
        </div>

        {/* Resizer bar */}
        <div
          className="w-[1px] bg-border hover:bg-red-600 cursor-col-resize z-50 relative transition-colors"
          onMouseDown={startResizing}
        >
          <div className="absolute inset-y-0 -left-1 w-3 cursor-col-resize z-50" />
        </div>

        {/* Right Inspector: Person Details */}
        <PersonDetailPanel
          person={selectedPerson}
          onUpdatePerson={updatePerson}
          onDeletePerson={deletePerson}
          onAddChild={handleOpenAddChild}
          width={inspectorWidth}
        />
      </div>

      {/* Add Person Modal */}
      <AddPersonDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onAdd={addPerson}
        parentPerson={addDialogParent}
        existingPersons={branchPersons}
      />

      {/* Supabase Database Modal */}
      <DatabaseTestDialog 
        isOpen={isDatabaseModalOpen}
        onClose={() => setIsDatabaseModalOpen(false)}
        autoRun={true}
      />
    </div>
  );
};

export default LineagePage;
