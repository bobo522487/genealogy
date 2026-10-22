import React, { useState } from 'react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { GitBranch, X, Folder, Plus } from 'lucide-react';
import { LineageBranch } from '../types';

interface CreateBranchDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (branch: LineageBranch) => void;
  folders: LineageBranch[];
  defaultParentId?: string;
}

export const CreateBranchDialog: React.FC<CreateBranchDialogProps> = ({
  isOpen,
  onClose,
  onCreate,
  folders,
  defaultParentId
}) => {
  const [name, setName] = useState('');
  const [originAncestor, setOriginAncestor] = useState('陈元英');
  const [region, setRegion] = useState('中国/贵州/遵义/桐梓县');
  const [hallName, setHallName] = useState('颖川堂');
  const [description, setDescription] = useState('');
  const [parentId, setParentId] = useState<string>(defaultParentId || '');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newBranch: LineageBranch = {
      id: `branch-${Date.now()}`,
      name: name.trim(),
      type: 'branch',
      parentId: parentId || undefined,
      code: `BRANCH_${Date.now()}`,
      description: description.trim() || '新增支系世系卷册',
      originAncestor: originAncestor.trim() || '始祖',
      region: region.trim() || '中国/贵州/遵义',
      generationsCount: 1,
      membersCount: 0,
      hallName: hallName.trim() || '颖川堂',
      updatedAt: new Date().toISOString().split('T')[0]
    };

    onCreate(newBranch);
    setName('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-border flex items-center justify-between bg-muted/20">
          <div className="flex items-center gap-2">
            <GitBranch size={18} className="text-primary" />
            <h3 className="font-bold text-sm text-foreground">新建谱系世系</h3>
          </div>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
            <X size={14} />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
          <div>
            <label className="block text-[11px] font-semibold text-foreground mb-1">
              谱系名称 *
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="如: 东冈支系世系图 / 伯崇公房世系"
              required
              className="h-8 text-xs font-semibold"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-[11px] text-muted-foreground mb-1">
              归属卷宗文件夹
            </label>
            <select
              value={parentId}
              onChange={(e) => setParentId(e.target.value)}
              className="w-full h-8 px-2 text-xs rounded-md border border-input bg-background text-foreground"
            >
              <option value="">-- 根目录 (无父级文件夹) --</option>
              {folders.map(f => (
                <option key={f.id} value={f.id}>
                  📁 {f.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] text-muted-foreground mb-1">开派始祖</label>
              <Input
                value={originAncestor}
                onChange={(e) => setOriginAncestor(e.target.value)}
                placeholder="如: 陈伯崇"
                className="h-8 text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] text-muted-foreground mb-1">宗族堂号</label>
              <Input
                value={hallName}
                onChange={(e) => setHallName(e.target.value)}
                placeholder="如: 颖川堂 / 德星堂"
                className="h-8 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] text-muted-foreground mb-1">支脉流徙地域</label>
            <Input
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              placeholder="如: 中国/贵州/遵义/桐梓县"
              className="h-8 text-xs"
            />
          </div>

          <div>
            <label className="block text-[11px] text-muted-foreground mb-1">支系修谱说明</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="说明本谱系昭穆字辈、发脉源流与修撰沿革..."
              className="w-full p-2 text-xs rounded-md border border-input bg-background resize-none"
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              取消
            </Button>
            <Button type="submit" size="sm" className="px-5">
              创建谱系
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
