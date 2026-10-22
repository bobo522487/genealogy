import React, { useState, useEffect } from 'react';
import { PersonRecord, SpouseInfo } from '../types';
import { 
  User, 
  Heart, 
  MapPin, 
  Award, 
  Calendar, 
  BookOpen, 
  Trash2, 
  Plus, 
  Save, 
  X,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Badge } from '../../../components/ui/badge';

interface PersonDetailPanelProps {
  person: PersonRecord | null;
  onUpdatePerson: (id: string, updates: Partial<PersonRecord>) => void;
  onDeletePerson: (id: string) => void;
  onAddChild: (fatherId: string) => void;
  width: number;
  onClose?: () => void;
}

export const PersonDetailPanel: React.FC<PersonDetailPanelProps> = ({
  person,
  onUpdatePerson,
  onDeletePerson,
  onAddChild,
  width,
  onClose
}) => {
  const [formData, setFormData] = useState<Partial<PersonRecord>>({});
  const [showSavedToast, setShowSavedToast] = useState(false);

  useEffect(() => {
    if (person) {
      setFormData({ ...person });
    }
  }, [person]);

  if (!person) {
    return (
      <div 
        style={{ width }} 
        className="h-full bg-card border-l border-border flex flex-col items-center justify-center p-6 text-center text-muted-foreground shrink-0 select-none"
      >
        <User size={40} className="text-muted-foreground/40 mb-3" />
        <h3 className="font-semibold text-sm text-foreground">未选择族人</h3>
        <p className="text-xs text-muted-foreground mt-1 max-w-[200px]">
          在世系图或世系表中点击任意族人节点，即可在此查看并编辑其详细行传与生卒档案。
        </p>
      </div>
    );
  }

  const handleChange = (field: keyof PersonRecord, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (person.id && formData) {
      onUpdatePerson(person.id, formData);
      setShowSavedToast(true);
      setTimeout(() => setShowSavedToast(false), 2500);
    }
  };

  // Spouses handlers
  const handleAddSpouseField = () => {
    const currentSpouses = formData.spouses || [];
    setFormData(prev => ({
      ...prev,
      spouses: [...currentSpouses, { name: '', clanOrigin: '' }]
    }));
  };

  const handleUpdateSpouse = (index: number, field: keyof SpouseInfo, val: string) => {
    const currentSpouses = [...(formData.spouses || [])];
    if (currentSpouses[index]) {
      currentSpouses[index] = { ...currentSpouses[index], [field]: val };
      setFormData(prev => ({ ...prev, spouses: currentSpouses }));
    }
  };

  const handleRemoveSpouse = (index: number) => {
    const currentSpouses = [...(formData.spouses || [])];
    currentSpouses.splice(index, 1);
    setFormData(prev => ({ ...prev, spouses: currentSpouses }));
  };

  return (
    <div 
      style={{ width }} 
      className="h-full bg-card border-l border-border flex flex-col overflow-hidden shrink-0 select-none transition-colors relative z-20"
    >
      {/* Panel Header */}
      <div className="h-14 px-4 border-b border-border flex items-center justify-between shrink-0 bg-muted/20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
            {formData.name ? formData.name.slice(-1) : '族'}
          </div>
          <div>
            <h3 className="font-bold text-sm text-foreground flex items-center gap-1.5">
              {formData.name || '族人档案'}
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 font-normal">
                第 {formData.generation} 世
              </Badge>
            </h3>
            <span className="text-[10px] text-muted-foreground">
              {formData.rank || '男'} · {formData.status === 'living' ? '健在' : '已故'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {showSavedToast && (
            <span className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium animate-fade-in">
              <CheckCircle2 size={13} /> 已保存
            </span>
          )}
          {onClose && (
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
              <X size={14} />
            </Button>
          )}
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 scrollbar-thin text-xs">
        {/* 1. 基本信息 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-muted-foreground uppercase">
            <span>基本信息</span>
            <span className="text-[10px] text-primary">必填项</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[11px] text-muted-foreground mb-1">姓名 *</label>
              <Input
                value={formData.name || ''}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="如: 陈元英"
                className="h-8 text-xs font-semibold"
              />
            </div>
            <div>
              <label className="block text-[11px] text-muted-foreground mb-1">字 / 号</label>
              <Input
                value={formData.courtesyName || ''}
                onChange={(e) => handleChange('courtesyName', e.target.value)}
                placeholder="如: 伯宣"
                className="h-8 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-[11px] text-muted-foreground mb-1">世次 (代)</label>
              <Input
                type="number"
                value={formData.generation || 1}
                onChange={(e) => handleChange('generation', parseInt(e.target.value) || 1)}
                className="h-8 text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] text-muted-foreground mb-1">派语字辈</label>
              <Input
                value={formData.generationWord || ''}
                onChange={(e) => handleChange('generationWord', e.target.value)}
                placeholder="如: 元"
                className="h-8 text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] text-muted-foreground mb-1">排行</label>
              <Input
                value={formData.rank || ''}
                onChange={(e) => handleChange('rank', e.target.value)}
                placeholder="如: 长子"
                className="h-8 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] text-muted-foreground mb-1">性别</label>
              <select
                value={formData.gender || 'male'}
                onChange={(e) => handleChange('gender', e.target.value)}
                className="w-full h-8 px-2 text-xs rounded-md border border-input bg-background"
              >
                <option value="male">男</option>
                <option value="female">女</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] text-muted-foreground mb-1">生存状态</label>
              <select
                value={formData.status || 'deceased'}
                onChange={(e) => handleChange('status', e.target.value)}
                className="w-full h-8 px-2 text-xs rounded-md border border-input bg-background"
              >
                <option value="deceased">已故</option>
                <option value="living">健在</option>
              </select>
            </div>
          </div>
        </div>

        {/* 2. 父母与承祧 */}
        <div className="space-y-3 pt-2 border-t border-border/60">
          <div className="text-xs font-bold text-muted-foreground uppercase">
            <span>父母与承祧</span>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[11px] text-muted-foreground mb-1">父亲名讳</label>
              <Input
                value={formData.fatherName || ''}
                onChange={(e) => handleChange('fatherName', e.target.value)}
                placeholder="如: 陈元英"
                className="h-8 text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] text-muted-foreground mb-1">生母姓氏 / 郡望</label>
              <Input
                value={formData.motherName || ''}
                onChange={(e) => handleChange('motherName', e.target.value)}
                placeholder="如: 妣李氏"
                className="h-8 text-xs"
              />
            </div>
          </div>
        </div>

        {/* 3. 配偶信息 */}
        <div className="space-y-3 pt-2 border-t border-border/60">
          <div className="flex items-center justify-between text-xs font-bold text-muted-foreground uppercase">
            <span>配偶信息 ({formData.spouses?.length || 0})</span>
            <button
              onClick={handleAddSpouseField}
              className="text-xs text-primary hover:underline font-normal flex items-center gap-0.5"
            >
              <Plus size={12} /> 添加配偶
            </button>
          </div>

          {(formData.spouses || []).map((spouse, idx) => (
            <div key={idx} className="p-2.5 rounded-lg border border-border bg-muted/20 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-foreground flex items-center gap-1">
                  <Heart size={11} className="text-rose-500" /> 配偶 {idx + 1}
                </span>
                <button
                  onClick={() => handleRemoveSpouse(idx)}
                  className="text-muted-foreground hover:text-destructive"
                  title="删除配偶"
                >
                  <Trash2 size={12} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Input
                  value={spouse.name || ''}
                  onChange={(e) => handleUpdateSpouse(idx, 'name', e.target.value)}
                  placeholder="配偶姓氏 如: 妣李氏"
                  className="h-7 text-xs"
                />
                <Input
                  value={spouse.clanOrigin || ''}
                  onChange={(e) => handleUpdateSpouse(idx, 'clanOrigin', e.target.value)}
                  placeholder="籍贯郡望 如: 系出清河"
                  className="h-7 text-xs"
                />
              </div>

              <Input
                value={spouse.burialPlace || ''}
                onChange={(e) => handleUpdateSpouse(idx, 'burialPlace', e.target.value)}
                placeholder="合葬或葬地坐向"
                className="h-7 text-xs"
              />
            </div>
          ))}
        </div>

        {/* 4. 生卒与寿元 */}
        <div className="space-y-3 pt-2 border-t border-border/60">
          <div className="text-xs font-bold text-muted-foreground uppercase">
            <span>生卒历与享寿</span>
          </div>

          <div>
            <label className="block text-[11px] text-muted-foreground mb-1">出生日期 (农历/时辰)</label>
            <Input
              value={formData.birthDate || ''}
              onChange={(e) => handleChange('birthDate', e.target.value)}
              placeholder="如: 明洪武十八年乙丑三月初六日亥时"
              className="h-8 text-xs"
            />
          </div>

          <div>
            <label className="block text-[11px] text-muted-foreground mb-1">殁年日期 (农历/时辰)</label>
            <Input
              value={formData.deathDate || ''}
              onChange={(e) => handleChange('deathDate', e.target.value)}
              placeholder="如: 明永乐二十一年癸卯九月十二日未时"
              className="h-8 text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] text-muted-foreground mb-1">享寿 (岁)</label>
              <Input
                type="number"
                value={formData.age || ''}
                onChange={(e) => handleChange('age', parseInt(e.target.value) || undefined)}
                placeholder="如: 78"
                className="h-8 text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] text-muted-foreground mb-1">功名 / 官阶</label>
              <Input
                value={formData.officialTitle || ''}
                onChange={(e) => handleChange('officialTitle', e.target.value)}
                placeholder="如: 举人 / 奉议大夫"
                className="h-8 text-xs"
              />
            </div>
          </div>
        </div>

        {/* 5. 墓茔与葬地 */}
        <div className="space-y-3 pt-2 border-t border-border/60">
          <div className="text-xs font-bold text-muted-foreground uppercase">
            <span>墓茔山向与风水</span>
          </div>
          <div>
            <label className="block text-[11px] text-muted-foreground mb-1">葬地位置及坐向朝向</label>
            <textarea
              value={formData.burialPlace || ''}
              onChange={(e) => handleChange('burialPlace', e.target.value)}
              rows={2}
              placeholder="如: 桐梓县狮子山金钗穴，坐北朝南兼子午三分，有碑刻华表"
              className="w-full p-2 text-xs rounded-md border border-input bg-background resize-none"
            />
          </div>
        </div>

        {/* 6. 行状纪略与传记 */}
        <div className="space-y-3 pt-2 border-t border-border/60">
          <div className="text-xs font-bold text-muted-foreground uppercase">
            <span>行状传记与事略记述</span>
          </div>
          <div>
            <textarea
              value={formData.biography || ''}
              onChange={(e) => handleChange('biography', e.target.value)}
              rows={4}
              placeholder="记录该族人先祖生平事略、功德善行、迁徙源流等..."
              className="w-full p-2.5 text-xs rounded-md border border-input bg-background resize-none leading-relaxed"
            />
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-border bg-muted/20 flex items-center justify-between shrink-0 gap-2">
        <Button
          variant="outline"
          size="sm"
          className="text-xs text-primary border-primary/30 hover:bg-primary/10"
          onClick={() => onAddChild(person.id)}
        >
          <Plus size={13} className="mr-1" /> 为其添子
        </Button>

        <div className="flex items-center gap-2">
          {person.generation > 1 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground hover:text-destructive"
              onClick={() => {
                if (confirm(`确定要从谱系中删除 ${person.name} 吗？`)) {
                  onDeletePerson(person.id);
                }
              }}
            >
              <Trash2 size={13} />
            </Button>
          )}

          <Button size="sm" className="text-xs px-4" onClick={handleSave}>
            <Save size={13} className="mr-1.5" /> 保存档案
          </Button>
        </div>
      </div>
    </div>
  );
};
